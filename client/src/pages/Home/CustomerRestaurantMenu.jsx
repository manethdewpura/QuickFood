import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API_URL } from '../../config/api.config';

const CustomerRestaurantMenu = () => {
  const location = useLocation();
  const { restaurant } = location.state || {};
  const [menuItems, setMenuItems] = useState([]);
  const [groupedMenus, setGroupedMenus] = useState({});
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState("available");
  const [cart, setCart] = useState({});
  const token = localStorage.getItem("token");

  const fetchMenuItems = (endpoint, groupByCuisine = false) => {
    setLoading(true);
    axios
      .get(endpoint, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        const menus = response.data.data;

        const initialCart = menus.reduce((acc, menu) => {
          acc[menu._id] = { ...menu, quantity: 1 };
          return acc;
        }, {});
        setCart(initialCart);

        if (groupByCuisine) {
          const grouped = menus.reduce((acc, menu) => {
            const { cuisineType } = menu;
            if (!acc[cuisineType]) {
              acc[cuisineType] = [];
            }
            acc[cuisineType].push(menu);
            return acc;
          }, {});
          setGroupedMenus(grouped);
        } else {
          setMenuItems(menus);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (restaurant?._id) {
      fetchMenuItems(
        `${API_URL}menu/restaurant/${restaurant._id}/available`
      );
    }
  }, [restaurant?._id]);

  const handleShowAvailableMenus = () => {
    setActivePanel("available");
    fetchMenuItems(
      `${API_URL}menu/restaurant/${restaurant._id}/available`
    );
  };

  const handleShowAllMenus = () => {
    setActivePanel("all");
    fetchMenuItems(`${API_URL}menu/restaurant/${restaurant._id}`);
  };

  const handleShowMenusByCuisine = () => {
    setActivePanel("cuisine");
    fetchMenuItems(
      `${API_URL}menu/restaurant/${restaurant._id}`,
      true
    );
  };

  const handleIncreaseQuantity = (menuItemId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[menuItemId]) {
        newCart[menuItemId].quantity += 1;
      }
      return newCart;
    });
  };

  const handleDecreaseQuantity = (menuItemId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[menuItemId] && newCart[menuItemId].quantity > 1) {
        newCart[menuItemId].quantity -= 1;
      }
      return newCart;
    });
  };

  const handleAddToCart = (menuItem) => {
    const restaurantId = restaurant._id;
    const payload = {
      restaurantId,
      items: [
        {
          menuItemId: menuItem._id,
          quantity: cart[menuItem._id]?.quantity || 1,
        },
      ],
    };

    axios
      .post(`${API_URL}cart/add`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Cart item added successfully:", response.data);
        alert(`${menuItem.menuItemName} added to cart successfully!`);
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
      });
  };

  if (loading) {
    return <p>Loading menu...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={token !== null} onCartClick={() => {}} />
      <h1 className="text-3xl font-bold my-4 mx-6">
        Menu for {restaurant?.restaurantName || "Unknown Restaurant"}
      </h1>
      <p className="text-gray-600 mb-2 mx-6">
        Address: {restaurant?.Address || "N/A"}
      </p>
      <p className="text-gray-600 mb-2 mx-6">
        Contact: {restaurant?.Hotline || "N/A"}
      </p>
      <p className="text-gray-600 mb-2 mx-6">
        Opening Hours: {restaurant?.OpeningHours || "N/A"}
      </p>
      <div className="my-4 mx-6">
        <button
          className={`px-4 py-2 rounded mr-2 ${
            activePanel === "available"
              ? "bg-blue-600 text-white"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={handleShowAvailableMenus}
        >
          Available Menus
        </button>
        <button
          className={`px-4 py-2 rounded mr-2 ${
            activePanel === "all"
              ? "bg-green-600 text-white"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
          onClick={handleShowAllMenus}
        >
          All Menus
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activePanel === "cuisine"
              ? "bg-yellow-600 text-white"
              : "bg-yellow-500 text-white hover:bg-yellow-600"
          }`}
          onClick={handleShowMenusByCuisine}
        >
          Categorized by Cuisine
        </button>
      </div>

      {/* Panels */}
      {activePanel === "available" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-6">
          {menuItems.map((menuItem) => (
            <div
              key={menuItem._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">
                {menuItem.menuItemName}
              </h2>
              {menuItem.imageUrl && (
                <img
                  src={menuItem.imageUrl}
                  alt={menuItem.menuItemName}
                  className="w-full h-40 object-cover rounded-md"
                />
              )}
              <p className="text-gray-600 mb-2">{menuItem.description}</p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Price:</span> Rs.
                {menuItem.price}.00
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Cuisine:</span>{" "}
                {menuItem.cuisineType}
              </p>
              <div className="flex items-center mt-4">
                <div className="flex items-center mr-4">
                  <button
                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                    onClick={() => handleDecreaseQuantity(menuItem._id)}
                  >
                    -
                  </button>
                  <span className="mx-2">
                    {cart[menuItem._id]?.quantity || 1}
                  </span>
                  <button
                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                    onClick={() => handleIncreaseQuantity(menuItem._id)}
                  >
                    +
                  </button>
                </div>
                <button
                  className={`px-4 py-2 rounded ${
                    menuItem.isAvailable
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() => handleAddToCart(menuItem)}
                  disabled={!menuItem.isAvailable}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activePanel === "all" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  mx-6">
          {menuItems.map((menuItem) => (
            <div
              key={menuItem._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">
                {menuItem.menuItemName}
              </h2>
              {menuItem.imageUrl && (
                <img
                  src={menuItem.imageUrl}
                  alt={menuItem.menuItemName}
                  className="w-full h-40 object-cover rounded-md"
                />
              )}
              <p className="text-gray-600 mb-2">{menuItem.description}</p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Price:</span> Rs.
                {menuItem.price}.00
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Cuisine:</span>{" "}
                {menuItem.cuisineType}
              </p>
              <div className="flex items-center mt-4">
                <div className="flex items-center mr-4">
                  <button
                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                    onClick={() => handleDecreaseQuantity(menuItem._id)}
                  >
                    -
                  </button>
                  <span className="mx-2">
                    {cart[menuItem._id]?.quantity || 1}
                  </span>
                  <button
                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                    onClick={() => handleIncreaseQuantity(menuItem._id)}
                  >
                    +
                  </button>
                </div>
                <button
                  className={`px-4 py-2 rounded ${
                    menuItem.isAvailable
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() => handleAddToCart(menuItem)}
                  disabled={!menuItem.isAvailable}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activePanel === "cuisine" &&
        Object.keys(groupedMenus).map((cuisineType) => (
          <div key={cuisineType} className="mb-6 mx-6">
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              {cuisineType}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedMenus[cuisineType].map((menuItem) => (
                <div
                  key={menuItem._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {menuItem.menuItemName}
                  </h3>
                  {menuItem.imageUrl && (
                    <img
                      src={menuItem.imageUrl}
                      alt={menuItem.menuItemName}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  )}
                  <p className="text-gray-600 mb-2">{menuItem.description}</p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Price:</span> Rs.
                    {menuItem.price}.00
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Availability:</span>{" "}
                    {menuItem.isAvailable ? "Available" : "Not Available"}
                  </p>
                  <div className="flex items-center mt-4">
                    <div className="flex items-center mr-4">
                      <button
                        className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                        onClick={() => handleDecreaseQuantity(menuItem._id)}
                      >
                        -
                      </button>
                      <span className="mx-2">
                        {cart[menuItem._id]?.quantity || 1}
                      </span>
                      <button
                        className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                        onClick={() => handleIncreaseQuantity(menuItem._id)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className={`px-4 py-2 rounded ${
                        menuItem.isAvailable
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      onClick={() => handleAddToCart(menuItem)}
                      disabled={!menuItem.isAvailable}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      <Footer />
    </div>
  );
};

export default CustomerRestaurantMenu;
