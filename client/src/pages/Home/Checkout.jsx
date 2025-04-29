import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLocation as useLocationContext } from "../../context/LocationContext.jsx";
import { API_URL } from "../../config/api.config";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RD89zPuIXCAe5na6392eGLANkFWsolQLENDttXwT6YczwaesCUl3y0QRp07aNPrpgh2jxrwtydKhNJpcRBWg1qP00EZmjzc1L"
);

// Form component for handling checkout process
const CheckoutForm = () => {
  // State and context management
  const location = useLocation();
  const navigate = useNavigate();
  const elements = useElements();
  const stripe = useStripe();
  const { restaurantId } = location.state || {};
  const { location: locationContext } = useLocationContext();
  const [restaurantName, setRestaurantName] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    amount: "",
    items: "",
  });
  const shippingFee = 500;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!restaurantId) return;

    // Fetch restaurant and cart details
    axios
      .get(`${API_URL}cart/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const { restaurant, items } = response.data.data || {};
        if (
          restaurant?.data?.restaurantName &&
          Array.isArray(items) &&
          items.length > 0
        ) {
          setRestaurantName(restaurant.data.restaurantName);
          const formattedItems = items.map((item) => ({
            menuItemName: item.menuItem.data.menuItemName,
            price: item.menuItem.data.price,
            quantity: item.quantity,
            imageUrl: item.menuItem.data.imageUrl,
          }));
          setItems(formattedItems);
          setFormData((prev) => ({
            ...prev,
            items: formattedItems.map((item) => item.menuItemName).join(", "),
            amount: calculateSubtotal() + shippingFee,
          }));
        } else {
          console.error("Invalid or incomplete response data:", response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching checkout details:", error);
        setLoading(false);
      });
  }, [restaurantId, token]);

  useEffect(() => {
    if (locationContext?.cityName) {
      setFormData((prev) => ({
        ...prev,
        city: locationContext.cityName,
      }));
    }
  }, [locationContext]);

  const calculateSubtotal = () =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Payment processing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}payment/create-payment-intent`,
        {
          amount: Math.round((calculateSubtotal() + shippingFee) * 100),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { clientSecret } = response.data;

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${formData.first_name} ${formData.last_name}`,
              email: formData.email,
            },
          },
        }
      );

      if (error) {
        throw error;
      }

      // Create order and receipt after successful payment
      await axios.post(
        `${API_URL}payment/success-payment`,
        {
          amount: calculateSubtotal() + shippingFee,
          currency: "lkr",
          paymentIntentId: paymentIntent.id,
          orderData: {
            restaurantId,
            restaurantName: restaurantName,
            customerLatitude: locationContext.latitude,
            customerLongitude: locationContext.longitude,
            items: items,
            deliveryAddress: formData.address,
            customerDetails: {
              firstName: formData.first_name,
              lastName: formData.last_name,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Payment successful! Order has been created.");

      // Fetch order details and navigate to customer orders page
      const orderResponse = await axios.get(
        `${API_URL}order/customer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const orderDetails = orderResponse.data.data;
      console.log(orderDetails);
      navigate("/customer/orders", { state: { orderDetails } });
    } catch (error) {
      console.error("Payment Error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Form rendering
  if (loading) {
    return <p>Loading checkout details...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={token !== null} onCartClick={() => {}} />
      <div className="flex flex-row justify-between p-6 gap-6">
        {/* Left side - Cart items */}
        <div className="w-1/2">
          <h1 className="text-2xl font-bold mb-4">Checkout</h1>
          <h2 className="text-xl font-semibold mb-4">
            Restaurant: {restaurantName}
          </h2>
          <div className="space-y-4 mb-6">
            {items.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-gray-300 rounded-md shadow-md flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.menuItemName}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  )}
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Item Name:</span>{" "}
                      {item.menuItemName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Quantity:</span>{" "}
                      {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Subtotal:</span> Rs.
                    {item.price * item.quantity}.00
                  </p>
                  <p className="text-gray-400">
                    <span>Rs.{item.price}.00</span> Each
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4 border-t border-gray-200 pt-4 pl-28 pr-3">
            <div className="flex justify-between">
              <p className="text-gray-700 font-semibold">Subtotal:</p>
              <p className="text-gray-700">Rs.{calculateSubtotal()}.00</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-400 font-semibold">Delivery Fee:</p>
              <p className="text-gray-400">Rs.{shippingFee}.00</p>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between font-bold text-xl">
              <p className="text-gray-700">Total:</p>
              <p className="text-gray-700">
                Rs.{calculateSubtotal() + shippingFee}.00
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Payment Form */}
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Payment Details
          </h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-8 rounded-lg shadow-md"
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <CardElement className="p-3 border border-gray-300 rounded-md" />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Processing..." : "Pay with Stripe"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Wrapper component with Stripe Elements
const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
