import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaSearch } from "react-icons/fa";
import AdminHeader from "../../../components/Admin/AdminHeader";
import SideNav from "../../../components/Admin/SideNav";
import axios from "axios";

const RestaurantList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    axios
      .get("http://localhost:5000/restaurantAdmin/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setRestaurants(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
      });
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerify = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/restaurantAdmin/verify/${id}`,
        { isVerified: "Approved" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error verifying restaurant:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/restaurantAdmin/verify/${id}`,
        { isVerified: "Rejected" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error rejecting restaurant:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed inset-y-0 left-0 z-50">
        <SideNav />
      </div>
      <div className="ml-64 transition-all duration-300">
        <AdminHeader />
        <div className="max-w-7xl mx-auto p-4 mt-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Restaurant Management
          </h1>

          <div className="mb-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Telephone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRestaurants.map((restaurant) => (
                  <tr key={restaurant._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {restaurant.restaurantName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {restaurant.restaurantAdminId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {restaurant.Hotline}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          restaurant.isVerified === "Approved"
                            ? "bg-green-100 text-green-800"
                            : restaurant.isVerified === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {restaurant.isVerified}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {restaurant.isVerified === "Pending" && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleVerify(restaurant._id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleReject(restaurant._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
