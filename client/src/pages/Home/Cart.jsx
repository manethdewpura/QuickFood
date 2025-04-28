import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API_URL } from '../../config/api.config';

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
      .get(`${API_URL}cart/customer`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const cartData = response.data.data;
        if (cartData.length > 0) {
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

  const handleRemoveItem = async (restaurantId, menuItemId) => {
    try {
      await axios.delete(
        `${API_URL}cart/remove/${restaurantId}/${menuItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Refresh cart data
      window.location.reload();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleClearCart = async (restaurantId) => {
    try {
      await axios.delete(`${API_URL}cart/clear/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh cart data
      window.location.reload();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const handleIncreaseQuantity = async (restaurantId, menuItemId) => {
    try {
      await axios.patch(
        `${API_URL}cart/increase/${restaurantId}/${menuItemId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  const handleDecreaseQuantity = async (restaurantId, menuItemId) => {
    try {
      await axios.patch(
        `${API_URL}cart/decrease/${restaurantId}/${menuItemId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  if (loading) {
    return <p>Loading cart items...</p>;
  }

  if (!Object.keys(cartItemsByRestaurant).length) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header isLoggedIn={token !== null} onCartClick={() => {}} />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-600 font-semibold">
            Your cart is empty.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={token !== null} onCartClick={() => {}} />
      <h1 className="text-2xl font-bold my-4 mx-6">Your Cart</h1>
      {Object.entries(cartItemsByRestaurant).map(
        ([restaurantName, { restaurantId, items }]) => (
          <div key={restaurantId} className="mb-8 mx-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Restaurant: {restaurantName}
              </h2>
              <button
                onClick={() => handleClearCart(restaurantId)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Clear Cart
              </button>
            </div>
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
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() =>
                          handleDecreaseQuantity(restaurantId, item._id)
                        }
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="text-lg font-medium">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleIncreaseQuantity(restaurantId, item._id)
                        }
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(restaurantId, item._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
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
