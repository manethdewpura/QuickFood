import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const AdminHeader = () => {
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Handle admin logout and cleanup
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    // Header section with navigation links
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-end items-center">
        <nav className="flex items-center gap-6">
          {/* Link to admin dashboard */}
          <Link to="/admin" className="text-gray-600 hover:text-blue-600">
            Dashboard
          </Link>
          {/* Logout button */}
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

export default AdminHeader;
