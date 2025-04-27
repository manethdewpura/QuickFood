import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const RestaurantAdminHeader = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
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
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </nav>
    </header>
  );
};

export default RestaurantAdminHeader;
