import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RestaurantDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mock restaurant ID - in a real app, this would come from authentication
  const restaurantId = '60d21b4667d0d8992e610c86';

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/delivery/restaurant/${restaurantId}`);
        setDeliveries(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load deliveries');
        setLoading(false);
      }
    };

    fetchDeliveries();
    
    // Set up interval to refresh data
    const interval = setInterval(fetchDeliveries, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [restaurantId]);

  const verifyDeliveryCode = async (deliveryId, code) => {
    try {
      const response = await axios.post(`http://localhost:5002/delivery/${deliveryId}/verify`, { code });
      if (response.data.valid) {
        alert('Verification successful! The driver can now proceed with the delivery.');
      } else {
        alert('Invalid verification code. Please try again.');
      }
    } catch (err) {
      alert('Verification failed. Please try again.');
    }
  };

  if (loading) return <div>Loading deliveries...</div>;
  if (error) return <div>{error}</div>;

  // Group deliveries by status
  const pendingDeliveries = deliveries.filter(d => d.status === 'assigned');
  const activeDeliveries = deliveries.filter(d => ['picked_up', 'in_transit'].includes(d.status));
  const completedDeliveries = deliveries.filter(d => d.status === 'delivered');

  return (
    <div className="restaurant-deliveries">
      <h1>Restaurant Deliveries</h1>
      
      <h2>Pending Pickups ({pendingDeliveries.length})</h2>
      {pendingDeliveries.length === 0 ? (
        <p>No pending pickups</p>
      ) : (
        <div className="deliveries-list">
          {pendingDeliveries.map(delivery => (
            <div key={delivery._id} className="delivery-card">
              <h3>Order #{delivery.orderId._id.substring(0, 8)}</h3>
              <p><strong>Driver:</strong> {delivery.driverId.name}</p>
              <p><strong>Driver Phone:</strong> {delivery.driverId.phoneNumber}</p>
              <p><strong>Vehicle:</strong> {delivery.driverId.vehicleType} ({delivery.driverId.vehicleNumber})</p>
              <p><strong>Verification Code:</strong> {delivery.verificationCode}</p>
              <button 
                className="verify-btn"
                onClick={() => {
                  const code = prompt('Enter verification code to confirm pickup:');
                  if (code) {
                    verifyDeliveryCode(delivery._id, code);
                  }
                }}
              >
                Verify Pickup
              </button>
            </div>
          ))}
        </div>
      )}
      
      <h2>Active Deliveries ({activeDeliveries.length})</h2>
      {activeDeliveries.length === 0 ? (
        <p>No active deliveries</p>
      ) : (
        <div className="deliveries-list">
          {activeDeliveries.map(delivery => (
            <div key={delivery._id} className="delivery-card">
              <h3>Order #{delivery.orderId._id.substring(0, 8)}</h3>
              <p><strong>Status:</strong> {delivery.status.replace('_', ' ')}</p>
              <p><strong>Driver:</strong> {delivery.driverId.name}</p>
              <p><strong>Customer:</strong> {delivery.customerId.name}</p>
              <Link to={`/restaurant/track-delivery/${delivery._id}`} className="track-btn">
                Track Delivery
              </Link>
            </div>
          ))}
        </div>
      )}
      
      <h2>Completed Deliveries (Today)</h2>
      {completedDeliveries.length === 0 ? (
        <p>No completed deliveries today</p>
      ) : (
        <div className="deliveries-list">
          {completedDeliveries.map(delivery => (
            <div key={delivery._id} className="delivery-card completed">
              <h3>Order #{delivery.orderId._id.substring(0, 8)}</h3>
              <p><strong>Delivered at:</strong> {new Date(delivery.actualDeliveryTime).toLocaleTimeString()}</p>
              <p><strong>Driver:</strong> {delivery.driverId.name}</p>
              <p><strong>Customer:</strong> {delivery.customerId.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantDeliveries;
