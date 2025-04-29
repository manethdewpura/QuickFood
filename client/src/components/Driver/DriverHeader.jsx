import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import Notifications from "../Notifications";

const DriverHeader = () => {
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Handle driver logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-end items-center">
        <nav className="flex items-center gap-6">
          <Link
            to="/driver/dashboard"
            className="text-gray-600 hover:text-blue-600"
          >
            Dashboard
          </Link>
          <Notifications />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-700"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default DriverHeader;
