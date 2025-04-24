import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RestaurantForm = ({ restaurantId }) => {
    const [formData, setFormData] = useState({
        restaurantName: '',
        address: '',
        hotline: '',
        openingHours: '',
        isAvailable: '',
        // latitude: '',
        // longitude: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch existing restaurant data for edit
    useEffect(() => {
        if (restaurantId) {
            axios
                .get(`http://localhost:5007/restaurants/${restaurantId}`)
                .then((response) => {
                    setFormData(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching restaurant data:', error);
                    setError('Restaurant not found.')
                });
        }
    }, [restaurantId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const apiUrl = restaurantId
            ? `http://localhost:5007/restaurants/${restaurantId}`
            : 'http://localhost:5007/restaurant'; // For adding restaurant

        const method = restaurantId ? 'PUT' : 'POST'; // POST for new, PUT for updating

        try {
            await axios({
                method,
                url: apiUrl,
                data: formData,
            });
            navigate('/restaurantHome'); // Redirect after success
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md p-6 bg-white shadow-md rounded-md w-full md:w-1/2">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                {loading && <p>Loading...</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="restaurantName"
                        value={formData.restaurantName}
                        placeholder="Restaurant Name"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        placeholder="Address"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                    />
                    <input
                        type="text"
                        name="hotline"
                        value={formData.hotline}
                        placeholder="Hotline"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                    />
                    <input
                        type="text"
                        name="openingHours"
                        value={formData.openingHours}
                        placeholder="Opening Hours"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                    />
            {/* <input
            type="number"
            name="latitude"
            value={formData.latitude}
            placeholder="Latitude"
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            placeholder="Longitude"
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          /> */}
                    <div className="flex items-center">
                        <label className="mr-2">Available:</label>
                        <input
                            type="checkbox"
                            name="isAvailable"
                            checked={formData.isAvailable}
                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        {restaurantId ? 'Update Restaurant' : 'Add Restaurant'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RestaurantForm;
