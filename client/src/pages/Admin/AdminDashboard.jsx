import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaUtensils, FaClipboardList } from "react-icons/fa";
import AdminHeader from "../../components/Admin/AdminHeader";
import SideNav from "../../components/Admin/SideNav";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Navigation configuration
  const dashboardItems = [
    {
      title: "User Management",
      icon: <FaUsers className="text-4xl text-blue-500 mb-4" />,
      onClick: () => navigate("/admin/users"),
    },
    {
      title: "Restaurant Management",
      icon: <FaUtensils className="text-4xl text-blue-500 mb-4" />,
      onClick: () => navigate("/admin/restaurants"),
    },
    {
      title: "Order Management",
      icon: <FaClipboardList className="text-4xl text-blue-500 mb-4" />,
      onClick: () => navigate("/admin/orders"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar navigation */}
      <div className="fixed inset-y-0 left-0 z-50">
        <SideNav />
      </div>
      <div className="ml-64">
        {/* Admin header */}
        <AdminHeader />
        <div className="max-w-7xl mx-auto p-4 mt-8">
          {/* Dashboard title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Admin Dashboard
          </h1>
          {/* Dashboard navigation cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardItems.map((item, index) => (
              <div
                key={index}
                onClick={item.onClick}
                className="bg-white p-8 rounded-lg shadow-md text-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {item.icon}
                <h2 className="text-xl font-semibold text-gray-700">
                  {item.title}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
