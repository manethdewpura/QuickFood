import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getLocationName } from '../../utils/location.util';

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
        console.log('Nearest orders data:', response.data);
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
        console.log('Deliveries data:', response.data);
        setDeliveries(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching deliveries:', err);
        setError('Failed to load deliveries');
        setLoading(false);
      }
    };

    fetchDeliveries();

    // Set up interval to refresh data
    const interval = setInterval(fetchDeliveries, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update driver location periodically
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

    // Update location immediately and then every 2 minutes
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
      // Use the status field directly instead of isAvailable
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

  // Helper function to safely get order ID
  // const getOrderId = (delivery) => {
  //   if (!delivery || !delivery.orderId) return 'N/A';

  //   if (typeof delivery.orderId === 'string') {
  //     return delivery.orderId.substring(0, 8);
  //   }

  //   if (delivery.orderId && delivery.orderId._id) {
  //     return delivery.orderId._id.substring(0, 8);
  //   }

  //   return 'N/A';
  // };

  // Helper function to safely get restaurant name
  // const getRestaurantName = (delivery) => {
  //   if (!delivery || !delivery.restaurantId) return 'Unknown';

  //   if (typeof delivery.restaurantId === 'string') {
  //     return 'Restaurant #' + delivery.restaurantId.substring(0, 8);
  //   }

  //   return delivery.restaurantId.name || 'Unknown';
  // };

  if (loading) return <div>Loading deliveries...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">Driver Dashboard</h1>

        <h2 className="text-xl font-semibold mb-4 text-indigo-600">Nearest Ready Orders</h2>
        {nearestOrders.length === 0 ? (
          <p className="text-gray-500">No ready orders nearby at the moment.</p>
        ) : (
          <div className="grid gap-4">
            {nearestOrders.map(order => (
              <div key={order._id} className="bg-gray-50 p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-indigo-800">
                    Order #{order._id.substring(0, 8)}
                  </h3>
                  <p className="text-gray-700"><strong>Distance:</strong> {order.distance.toFixed(2)} km</p>
                  <p className="text-gray-700"><strong>Pickup:</strong> {order.restaurant.Address}</p>
                  <p className="text-gray-700"><strong>Customer Location:</strong> {customerLocations[order._id] || 'Fetching...'}</p>
                  <p className="text-gray-700"><strong>Status:</strong> {order.orderStatus}</p>
                </div>
                <button
                  className="mt-2 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-semibold"
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      
                      // Call the createDelivery API
                      await axios.post(
                        `http://localhost:5000/delivery`,
                        {
                          _id: order._id,
                          customerId: order.customerId,
                          restaurantId: order.restaurantId,
                          customerLatitude: order.customerLatitude,
                          customerLongitude: order.customerLongitude,
                          restaurant: {
                            latitude: order.restaurant.latitude,
                            longitude: order.restaurant.longitude,
                            Address: order.restaurant.name // or use a real address if available
                          }
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      

                      // Update the order status to "Accepted"
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


        <div className="mb-6 flex justify-end">
          <button
            className={`px-4 py-2 rounded-md font-semibold shadow ${isAvailable
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            onClick={toggleAvailability}
          >
            {isAvailable ? 'Available for Deliveries' : 'Not Available'}
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-indigo-600">Current Deliveries</h2>
        {deliveries.length === 0 ? (
          <p className="text-gray-500">No active deliveries at the moment.</p>
        ) : (
          <div className="grid gap-4">
            {deliveries.map(delivery => (
              <div key={delivery._id} className="bg-gray-50 p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-indigo-800">
                    Order #{delivery.orderId ? delivery.orderId.substring(0, 8) : 'N/A'}
                  </h3>
                  <p className="text-gray-700"><strong>Restaurant:</strong> {delivery.restaurantId.name}</p>
                  <p className="text-gray-700"><strong>Status:</strong> {delivery.status}</p>
                  <p className="text-gray-700"><strong>Estimated Delivery:</strong> {new Date(delivery.estimatedDeliveryTime).toLocaleTimeString()}</p>
                </div>
                <Link
                  to={`/driver/delivery/${delivery._id}`}
                  className="mt-2 md:mt-0 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 font-semibold"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  );
};

export default DriverDashboard;
