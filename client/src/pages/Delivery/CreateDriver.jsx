import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCurrentLocation } from "../../utils/location.util";
import { API_URL } from '../../config/api.config';

const CreateDriver = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    vehicleType: "",
    vehicleNumber: "",
    licenseNumber: "",
    phoneNumber: "",
    status: "available",
    currentLocation: { lat: 0, lng: 0 },
    rating: 0,
    totalDeliveries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the driver already exists
    const checkDriverExists = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}driver/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          navigate("/driver/dashboard");
        } else {
          setLoading(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setLoading(false);
        } else {
          console.error("Error checking driver existence:", error);
        }
      }
    };

    checkDriverExists();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to get current location
  const handleGetLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setFormData((prev) => ({
        ...prev,
        currentLocation: {
          lat: location.latitude,
          lng: location.longitude,
        },
      }));
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}driver`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/driver/dashboard");
    } catch (error) {
      console.error("Error creating driver:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md mt-10 ml-10 p-6 bg-white shadow-md rounded-md w-full md:w-1/2">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Driver</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="vehicleType"
            placeholder="Vehicle Type"
            value={formData.vehicleType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="vehicleNumber"
            placeholder="Vehicle Number"
            value={formData.vehicleNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="licenseNumber"
            placeholder="License Number"
            value={formData.licenseNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={handleGetLocation}
            className="w-full bg-gray-500 text-black py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Get Current Location
          </button>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Driver
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDriver;
