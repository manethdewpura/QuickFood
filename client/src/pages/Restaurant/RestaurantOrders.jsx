import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RestaurantOrders = ({ restaurantId }) => {
  const [menuItems, setMenuItems] = useState([]);
  const { id: restaurantIdFromParams } = useParams();
  restaurantId = restaurantId || restaurantIdFromParams;
  const [form, setForm] = useState({
    menuItemName: '',
    price: '',
    description: '',
    cuisineType: '',
    isAvailable: true,
    imageUrl: '',
  });
  const [editingId, setEditingId] = useState(null);
  // const user = JSON.parse(localStorage.getItem('user'));

  const fetchMenuItems = async () => {
    try {
      //todo: update to get only restaurants menu items
      // const restaurantId = '680b0608f204745ccb83e63c'; // Replace with actual restaurant ID
      const res = await axios.get(`http://localhost:5000/menu/restaurant/${restaurantIdFromParams}`,{
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMenuItems(res.data.data);
    } catch (err) {
      console.error("Failed to load menu items", err);
    }
  };

  useEffect(() => {
    if (restaurantId) fetchMenuItems();
  }, [restaurantId]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = { ...form, restaurantId }
    console.log("Form data", formData);
    console.log(token);

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/menuRes/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5000/menuRes/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setForm({
        menuItemName: '',
        price: '',
        description: '',
        cuisineType: '',
        isAvailable: true,
        imageUrl: '',
      });
      setEditingId(null);
      fetchMenuItems();
    } catch (err) {
      console.error("Submission error", err.response?.data || err);
    }
  };

  const handleEdit = (menu) => {
    setForm({
      menuItemName: menu.menuItemName || '',
      price: menu.price || '',
      description: menu.description || '',
      cuisineType: menu.cuisineType || '',
      isAvailable: menu.isAvailable ?? true,
      imageUrl: menu.imageUrl || '',
    });
    setEditingId(menu._id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this restaurant?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5007/menuRes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMenuItems();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{editingId ? 'Update' : 'Add'} Menu Item</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
        <input
          type="text"
          name="menuItemName"
          placeholder="Menu Item Name"
          value={form.menuItemName}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="cuisineType"
          placeholder="Cuisine Type"
          value={form.cuisineType}
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
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="isAvailable" className="text-sm">Available</label>
          </div>

          <div className="col-span-2 flex items-center space-x-2">
            {/* <button
              type="button"
              onClick={async () => {
                const location = await getCurrentLocation();
                setForm((prev) => ({
                  ...prev,
                  location: {
                    latitude: location.latitude,
                    longitude: location.longitude
                  }
                }));
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Get Current Location
            </button> */}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            {form.imageUrl && (
              <img src={form.imageUrl} alt="Preview" className="h-32 object-cover mt-2 rounded" />
            )}
          </div>
        </div>

        <button className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editingId ? 'Update' : 'Add'} Menu Item
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-10 mb-4">Menu Item List</h2>
      <div className="space-y-4">
        {menuItems.map((m) => (
          <div key={m._id} className="border p-4 rounded shadow bg-gray-50 w-full">
            <h3 className="font-bold text-lg">{m.menuItemName}</h3>
            <p><strong>Item Price : </strong> {m.price}</p>
            <p><strong>Description : </strong> {m.description}</p>
            <p><strong>Cuisine Type : </strong> {m.cuisineType}</p>
            <p><strong>Available : </strong> <span className={m.isAvailable ? 'text-green-600' : 'text-red-600'}>{m.isAvailable ? 'Yes' : 'No'}</span></p>
            {/* {user?.role === "RestaurantAdmin" && user._id === r.restaurantAdminId && */}
            {(
              <div className="mt-2 space-x-2 flex justify-end">
                <button onClick={() => handleEdit(m)} className="px-3 py-1 bg-yellow-500 text-white rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(m._id)} className="px-3 py-1 bg-red-600 text-white rounded">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantOrders;


