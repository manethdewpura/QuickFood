import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CustomerDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:5000/delivery/customer',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data);
        const deliveriesWithDriverNames = await Promise.all(
          response.data.map(async (delivery) => {
            if (delivery.driverId) {
              const driverResponse = await axios.get(
                `http://localhost:5000/driver/${delivery.driverId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return { ...delivery, driverName: driverResponse.data.name };
            }
            return { ...delivery, driverName: 'Not assigned' };
          })
        );

        setDeliveries(deliveriesWithDriverNames);
        setLoading(false);
      } catch (err) {
        setError('Failed to load your deliveries');
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  if (loading) return <div>Loading your deliveries...</div>;
  if (error) return <div>{error}</div>;
  if (deliveries.length === 0) return <div>No deliveries found.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          Your Deliveries
        </h1>
        <div className="grid gap-4">
          {deliveries.map(delivery => (
            <div key={delivery._id} className="bg-gray-50 p-4 rounded shadow">
              <h3 className="font-semibold text-lg text-indigo-800">
                Order #{typeof delivery.orderId === 'object'
                  ? delivery.orderId._id.substring(0, 8)
                  : (delivery.orderId || '').substring(0, 8)}
              </h3>
              <p className="text-gray-700">
                <strong>Restaurant:</strong> {delivery.restaurantDetails.restaurantName || 'Unknown'}
              </p>
              <p className="text-gray-700">
                <strong>Status:</strong> {delivery.status}
              </p>
              <p className="text-gray-700">
                <strong>Driver:</strong> {delivery.driverName}
              </p>
              <p className="text-gray-700">
                <strong>Estimated Delivery:</strong> {delivery.estimatedDeliveryTime
                  ? new Date(delivery.estimatedDeliveryTime).toLocaleTimeString()
                  : 'N/A'}
              </p>
              <p className="text-gray-700">
                <strong>Verification Code:</strong> {delivery.verificationCode || 'N/A'}
              </p>
              <Link
                to={`/track-delivery/${delivery._id}`}
                className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Track Delivery
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDeliveries;
