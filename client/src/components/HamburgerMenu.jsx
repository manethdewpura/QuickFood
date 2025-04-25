import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaInstagram, FaReceipt, FaSignOutAlt } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";

const HamburgerMenu = ({ isLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-600 hover:text-gray-800"
      >
        <FaBars />
      </button>
      {/* Overlay with transition */}
      <div
        className={`w-full fixed inset-0 z-10 backdrop-blur-sm transition-opacity duration-500 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      ></div>

      {/* Sidebar menu with TailwindCSS classes for transition */}
      <div
        className={`fixed inset-y-0 left-0 w-80 bg-white shadow-lg z-20 transform transition-transform duration-500 flex flex-col ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <img src="/LogoNoBg.png" alt="Logo" className="p-10" />
        <ul className="flex flex-col p-4 space-y-4 flex-grow">
          {isLoggedIn ? (
            <>
              <li className="flex flex-row hover:text-blue-500 cursor-pointer">
                <FaReceipt className="text-2xl mr-5 text-gray-600" />
                Orders
              </li>
              <li className="flex flex-row hover:text-blue-500 cursor-pointer">
                <BsPersonCircle className="text-2xl mr-5 text-gray-600" />
                Profile</li>
              <li className="flex flex-row hover:text-blue-500 cursor-pointer" onClick={handleLogout}>
                <FaSignOutAlt className="text-2xl mr-5 text-gray-600" />
                Logout</li>
            </>
          ) : (
            <>
              <li>
                <button className="w-full px-4 py-2 text-base font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
                  Login
                </button>
              </li>
              <li>
                <button className="w-full px-4 py-2 text-base font-medium text-blue-500 border border-blue-500 rounded-md hover:bg-gray-100">
                  Sign Up
                </button>
              </li>
            </>
          )}
        </ul>
        {/* Footer Section */}
        <div className="p-4">
          <ul className="flex flex-col space-y-2 text-base text-gray-600">
            <li className="hover:text-blue-500 cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-blue-500 cursor-pointer">Terms</li>
          </ul>
          <div className="flex justify-center space-x-4 mt-4 text-gray-600">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
