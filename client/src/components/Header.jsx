import React, { useState, useRef, useEffect } from "react";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import HamburgerMenu from "./HamburgerMenu";
import { useLocation } from "../context/LocationContext.jsx";
import Notifications from "./Notifications";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../config/api.config';

const Header = ({ isLoggedIn, onLogin, onSignUp }) => {
  const { location, loading, error } = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const token = localStorage.getItem("token");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}restaurantAll/search?query=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error searching restaurants:", error);
    }
  };

  const locationText = loading
    ? "Getting location..."
    : error
    ? "Please enable location services"
    : location?.cityName || "Select location";

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <HamburgerMenu isLoggedIn={isLoggedIn} />
        <h1
          className="text-xl font-bold text-gray-800 cursor-pointer"
          onClick={() => (window.location.href = "http://localhost:3005/")}
        >
          QuickFood
        </h1>
        {isLoggedIn && <span className="text-gray-600">{locationText}</span>}
      </div>
      {/* Middle Section */}
      {isLoggedIn && (
        <div className="flex items-center justify-center flex-grow">
          <div ref={searchRef} className="relative w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setShowResults(true)}
                placeholder="Search for Restaurants..."
                className="w-full p-2 pl-10 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.map((restaurant) => (
                  <div
                    key={restaurant._id}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate("/customer-restaurant/menu", {
                        state: {
                          restaurant
                        },
                      });
                      setShowResults(false);
                      setSearchQuery("");
                    }}
                  >
                    <h3 className="font-semibold">
                      {restaurant.restaurantName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {restaurant.Address}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Notifications />
            <button
              onClick={() => navigate("/cart")}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <FaShoppingCart className="text-2xl" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onLogin}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Login
            </button>
            <button
              onClick={onSignUp}
              className="px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-md hover:bg-gray-100"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
