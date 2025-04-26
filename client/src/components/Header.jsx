import React from "react";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import HamburgerMenu from "./HamburgerMenu";
import { useLocation } from "../context/LocationContext.jsx";
import Notifications from "./Notifications";

const Header = ({ isLoggedIn, onLogin, onSignUp, onCartClick }) => {
  const { location, loading, error } = useLocation();

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
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search for food..."
              className="w-full p-2 pl-10 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>
        </div>
      )}
      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Notifications />
            <button
              onClick={onCartClick}
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
