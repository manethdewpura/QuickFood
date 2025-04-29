import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import Notifications from "../../components/Notifications";

// Restaurant admin header component with navigation and notifications
const RestaurantAdminHeader = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage and redirect to login if not found
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    // Remove token from localStorage and reload the page
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="max-w-full mx-auto px-4 py-4 bg-white shadow-md">
      <nav className="flex items-center justify-between gap-6">
        <div className="text-blue-600 font-bold text-2xl">
          QuickFood Restaurant Admin
        </div>
        <div className="flex items-center gap-4">
          <Notifications />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-700"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default RestaurantAdminHeader;
