import React, { useState } from "react";
import axios from "axios";

const CreateDriverForm = () => {
  const [formData, setFormData] = useState({
    vehicleType: "",
    vehicleNumber: "",
    licenseNumber: "",
  });
  const [message, setMessage] = useState("");

  // Extract userId from JWT in localStorage
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token"); // Or your token key
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      // Adjust this if your JWT uses a different claim for user ID
      return decoded.id || decoded.userId || decoded.sub || null;
    } catch (err) {
      return null;
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = getUserIdFromToken();
    if (!userId) {
      setMessage("You must be logged in as a DeliveryPersonnel to create a driver profile.");
      return;
    }
    try {
      await axios.post("http://localhost:5002/driver", {
        userId,
        ...formData,
      });
      setMessage("Driver profile created successfully!");
      setFormData({ vehicleType: "", vehicleNumber: "", licenseNumber: "" });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to create driver. Make sure you are a DeliveryPersonnel user."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
          Create Driver Profile
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vehicle Type
          </label>
          <input
            type="text"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., motorcycle, car, van"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vehicle Number
          </label>
          <input
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., AB1234"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            License Number
          </label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., DL1234567890"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded shadow hover:bg-indigo-700 font-semibold"
        >
          Create Driver
        </button>
        {message && (
          <div className="mt-2 text-center text-sm text-red-600">{message}</div>
        )}
      </form>
    </div>
  );
};

export default CreateDriverForm;
