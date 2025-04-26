import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Checkout = () => {
  const location = useLocation();
//   const navigate = useNavigate();
  const { restaurantId } = location.state || {};
  const [restaurantName, setRestaurantName] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const shippingFee = 50; // Example shipping fee
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage

  useEffect(() => {
    if (!restaurantId) return;

    // Fetch restaurant and cart details
    axios
      .get(`http://localhost:5000/cart/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Checkout response:", response.data.data);
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

  const calculateSubtotal = () =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

//   const handlePayment = () => {
//     navigate("/payment", {
//       state: { restaurantId, items, total: calculateSubtotal() + shippingFee },
//     });
//   };

  if (loading) {
    return <p>Loading checkout details...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={token !== null} onCartClick={() => {}} />
      <div>
        <h1 className="text-2xl font-bold my-4 mx-6">Checkout</h1>
        <h2 className="text-xl font-semibold mb-4 mx-6">
          Restaurant: {restaurantName}
        </h2>
        <div className="m-6 space-y-4 w-2/5">
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
        {/* Total price section */}
        <div className="mb-6 pl-28 pr-3 mx-6 w-2/5 space-y-4">
          <div className="flex justify-between">
            <p className="text-gray-700 font-semibold">Subtotal:</p>
            <p className="text-gray-700">Rs.{calculateSubtotal()}.00</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-500 font-semibold">Delivery Fee:</p>
            <p className="text-gray-500">Rs.{shippingFee}.00</p>
          </div>
          <hr className="border-gray-500" />
          <div className="flex justify-between font-bold text-xl">
            <p className="text-gray-700">Total:</p>
            <p className="text-gray-700">
              Rs.{calculateSubtotal() + shippingFee}.00
            </p>
          </div>
          {/* <div className="flex justify-end mt-4">
            <button
              onClick={handlePayment}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Pay
            </button>
          </div> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
