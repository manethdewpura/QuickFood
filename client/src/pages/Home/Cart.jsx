import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Cart = () => {
  const [cartItemsByRestaurant, setCartItemsByRestaurant] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    // Fetch cart items for the customer
    axios
      .get("http://localhost:5000/cart/customer", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const cartData = response.data.data;
        if (cartData.length > 0) {
          // Group items by restaurantName
          const groupedItems = cartData.reduce((acc, cart) => {
            const restaurantId = cart.restaurantId;
            const restaurantName = cart.restaurant.data.restaurantName;
            if (!acc[restaurantName]) {
              acc[restaurantName] = { restaurantId, items: [] };
            }
            cart.items.forEach((item) => {
              acc[restaurantName].items.push({
                ...item.menuItem.data,
                quantity: item.quantity,
              });
            });
            return acc;
          }, {});
          setCartItemsByRestaurant(groupedItems);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
        setLoading(false);
      });
  }, []);

  const handleCheckout = (restaurantId) => {
    console.log(`Checkout for restaurant: ${restaurantId}`);
    navigate("/checkout", { state: { restaurantId } });
  };

  if (loading) {
    return <p>Loading cart items...</p>;
  }

  if (!Object.keys(cartItemsByRestaurant).length) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={token !== null} onCartClick={() => {}} />
      <h1 className="text-2xl font-bold my-4 mx-6">Your Cart</h1>
      {Object.entries(cartItemsByRestaurant).map(
        ([restaurantName, { restaurantId, items }]) => (
          <div key={restaurantId} className="mb-8 mx-6">
            <h2 className="text-xl font-semibold mb-4">
              Restaurant: {restaurantName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-xl font-semibold mb-2">
                    {item.menuItemName}
                  </h2>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.menuItemName}
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                  )}
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Price:</span> Rs.
                    {item.price}
                    .00
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Quantity:</span>{" "}
                    {item.quantity}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Total:</span> Rs.
                    {item.price * item.quantity}.00
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleCheckout(restaurantId)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Checkout
            </button>
          </div>
        )
      )}
      <Footer />
    </div>
  );
};

export default Cart;
