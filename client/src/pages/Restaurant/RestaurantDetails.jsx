import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentLocation } from "../../utils/location.util";
import { API_URL } from '../../config/api.config';
import RestaurantAdminHeader from "./RestaurantHeader.jsx";
import Footer from "../../components/Footer.jsx";

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    restaurantName: "",
    Address: "",
    Hotline: "",
    OpeningHours: "",
    isAvailable: true,
    location: {
      latitude: "",
      longitude: "",
    },
  });
  const [editingId, setEditingId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}restaurant/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurants(res.data.data);
    } catch (err) {
      console.error("Failed to load restaurants", err);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setForm({ ...form, isAvailable: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("Form data", form);
    console.log(token);

    try {
      if (editingId) {
        await axios.put(`${API_URL}restaurant/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}restaurant`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({
        restaurantName: "",
        Address: "",
        Hotline: "",
        OpeningHours: "",
        isAvailable: true,
        location: {
          latitude: "",
          longitude: "",
        },
      });
      setEditingId(null);
      fetchRestaurants();
    } catch (err) {
      console.error("Submission error", err.response?.data || err);
    }
  };

  const handleEdit = (restaurant) => {
    setForm({
      restaurantName: restaurant.restaurantName || "",
      Address: restaurant.Address || "",
      Hotline: restaurant.Hotline || "",
      OpeningHours: restaurant.OpeningHours || "",
      isAvailable: restaurant.isAvailable ?? true,
      location: restaurant.location || {
        latitude: restaurant.location?.latitude || "",
        longitude: restaurant.location?.longitude || "",
      },
    });
    setEditingId(restaurant._id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this restaurant?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}restaurant/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRestaurants();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <>
      <RestaurantAdminHeader />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">
          {editingId ? "Update" : "Add"} Restaurant
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow"
        >
          <input
            type="text"
            name="restaurantName"
            placeholder="Restaurant Name"
            value={form.restaurantName}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="Address"
            placeholder="Address"
            value={form.Address}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="Hotline"
            placeholder="Hotline"
            value={form.Hotline}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="OpeningHours"
            placeholder="Opening Hours"
            value={form.OpeningHours}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />

          <div className="col-span-2 flex items-center justify-between">
            <div className="flex items-center col-span-2 space-x-2">
              <input
                type="checkbox"
                id="isAvailable"
                name="isAvailable"
                checked={form.isAvailable}
                onChange={handleCheckboxChange}
                className="h-4 w-4"
              />
              <label htmlFor="isAvailable" className="text-sm">
                Available
              </label>
            </div>

            <div className="col-span-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={async () => {
                  const location = await getCurrentLocation();
                  setForm((prev) => ({
                    ...prev,
                    location: {
                      latitude: location.latitude,
                      longitude: location.longitude,
                    },
                  }));
                }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Get Current Location
              </button>
            </div>
          </div>

          <button className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editingId ? "Update" : "Add"} Restaurant
          </button>
        </form>

        <h2 className="text-xl font-semibold mt-10 mb-4">Restaurants List</h2>
        <div className="space-y-4">
          {restaurants.map((r) => (
            <div
              key={r._id}
              className="border p-4 rounded shadow bg-gray-50 w-full"
            >
              <h3 className="font-bold text-lg">{r.restaurantName}</h3>
              <p>
                <strong>Address:</strong> {r.Address}
              </p>
              <p>
                <strong>Hotline:</strong> {r.Hotline}
              </p>
              <p>
                <strong>Opening Hours:</strong> {r.OpeningHours}
              </p>
              <p>
                <strong>Available:</strong>{" "}
                <span
                  className={r.isAvailable ? "text-green-600" : "text-red-600"}
                >
                  {r.isAvailable ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <strong>Verification:</strong>
                <span
                  className={
                    r.isVerified === "Approved"
                      ? "text-green-600"
                      : r.isVerified === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {r.isVerified}
                </span>
              </p>
              {user?.role === "RestaurantAdmin" &&
                user._id === r.restaurantAdminId && (
                  <div className="mt-2 space-x-2 flex justify-end">
                    <button
                      onClick={() =>
                        (window.location.href = `/restaurant/order/${r._id}`)
                      }
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      View Orders
                    </button>
                    <button
                      onClick={() =>
                        (window.location.href = `/restaurant/menu/${r._id}`)
                      }
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Add Menu Items
                    </button>
                    <button
                      onClick={() => handleEdit(r)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RestaurantManagement;
