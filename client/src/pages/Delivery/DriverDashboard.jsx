import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getLocationName } from '../../utils/location.util';
import DriverHeader from '../../components/Driver/DriverHeader'; // Import DriverHeader

const DriverDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [nearestOrders, setNearestOrders] = useState([]);
  const [customerLocations, setCustomerLocations] = useState({});

  useEffect(() => {
    const fetchNearestOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/driver/nearest-ready-orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNearestOrders(response.data);
      } catch (err) {
        console.error('Error fetching nearest orders:', err);
      }
    };

    fetchNearestOrders();
    const interval = setInterval(fetchNearestOrders, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/delivery/driver`, { headers: { Authorization: `Bearer ${token}` } });
        console.log(response.data);
        setDeliveries(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching deliveries:', err);
        setError('Failed to load deliveries');
        setLoading(false);
      }
    };

    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const token = localStorage.getItem('token');
            await axios.patch(
              `http://localhost:5000/driver/location`,
              {
                location: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                }
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (err) {
            console.error('Failed to update location', err);
          }
        },
        (err) => {
          console.error('Unable to get current location', err);
        }
      );
    };

    updateLocation();
    const interval = setInterval(updateLocation, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCustomerLocations = async () => {
      const locations = {};
      for (const order of nearestOrders) {
        try {
          const locationName = await getLocationName(order.customerLatitude, order.customerLongitude);
          locations[order._id] = locationName;
        } catch (err) {
          console.error(`Failed to fetch location name for order ${order._id}`, err);
          locations[order._id] = 'Unknown Location';
        }
      }
      setCustomerLocations(locations);
    };

    if (nearestOrders.length > 0) {
      fetchCustomerLocations();
    }
  }, [nearestOrders]);

  const toggleAvailability = async () => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = isAvailable ? 'busy' : 'available';
      await axios.patch(
        `http://localhost:5000/driver/availability`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsAvailable(!isAvailable);
    } catch (err) {
      console.error('Failed to update availability:', err);
      setError('Failed to update availability');
    }
  };

  if (loading) return <div className="text-center text-gray-600 mt-10">Loading deliveries...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <DriverHeader /> {/* Include DriverHeader */}

      {/* Availability Toggle */}
      <div className="absolute top-20 right-4">
        {deliveries.length === 0 ? (
          <button
            className={`px-6 py-3 rounded-md font-semibold shadow ${isAvailable
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            onClick={toggleAvailability}
          >
            {isAvailable ? 'Available for Deliveries' : 'Not Available'}
          </button>
        ) : (
          <button
            className="px-6 py-3 rounded-md font-semibold shadow bg-yellow-500 text-white cursor-not-allowed"
            disabled
          >
            Busy
          </button>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-black mb-8">Driver Dashboard</h1>

        {/* Current Deliveries Section */}
        {deliveries.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-black mb-4">Current Deliveries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deliveries.map(delivery => (
                <div key={delivery._id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-gray-700 space-y-1">
                    <p><strong>Restaurant:</strong> {delivery.orderDetails.data.restaurant.name}</p>
                    <p><strong>Pickup Location:</strong> {delivery.orderDetails.data.restaurant.address}</p>
                    <p><strong>Verification Code:</strong>{delivery.verificationCode}</p>
                    <p><strong>Customer Location:</strong> {delivery.deliveryLocation.address}</p>
                    <p><strong>Status:</strong> {delivery.status}</p>
                    <p><strong>Estimated Delivery:</strong> {new Date(delivery.estimatedDeliveryTime).toLocaleTimeString()}</p>
                  </div>
                  <Link
                    to={`/driver/delivery/${delivery._id}`}
                    className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 font-semibold block text-center"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearest Ready Orders Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-black mb-4">Nearest Ready Orders</h2>
          {nearestOrders.length === 0 ? (
            <p className="text-gray-500 text-center">No ready orders nearby at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearestOrders.map(order => (
                <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold text-lg text-black mb-2">
                    Order #{order._id.substring(0, 8)}
                  </h3>
                  <div className="text-gray-700 space-y-1">
                    <p><strong>Distance:</strong> {order.distance.toFixed(2)} km</p>
                    <p><strong>Restaurant:</strong> {order.restaurant.name}</p>
                    <p><strong>Pickup:</strong> {order.restaurant.Address}</p>
                    <p><strong>Customer Location:</strong> {customerLocations[order._id] || 'Fetching...'}</p>
                    <p><strong>Status:</strong> {order.orderStatus}</p>
                  </div>
                  <button
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 font-semibold w-full"
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem('token');
                        await axios.post(
                          `http://localhost:5000/delivery`,
                          {
                            _id: order._id,
                            customerId: order.customerId,
                            restaurantId: order.restaurantId,
                            customerLatitude: order.customerLatitude,
                            customerLongitude: order.customerLongitude,
                            customerAddress: customerLocations[order._id],
                            restaurant: {
                              latitude: order.restaurant.latitude,
                              longitude: order.restaurant.longitude,
                              Address: order.restaurant.Address
                            }
                          },

                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        await axios.put(
                          `http://localhost:5000/order/status/${order._id}`,
                          { orderStatus: "Accepted" },
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        alert('Order accepted successfully!');
                      } catch (err) {
                        console.error('Failed to accept order:', err);
                        alert('Failed to accept order. Please try again.');
                      }
                    }}
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
