import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DeliveryMap from '../DeliveryComponents/DeliveryMap';

const RestaurantTrackDelivery = () => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/delivery/${id}`);
        setDelivery(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load delivery details');
        setLoading(false);
      }
    };

    fetchDeliveryDetails();
    
    // Set up interval to refresh data
    const interval = setInterval(fetchDeliveryDetails, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div>Loading delivery details...</div>;
  if (error) return <div>{error}</div>;
  if (!delivery) return <div>Delivery not found</div>;

  return (
    <div className="restaurant-track-delivery">
      <h1>Track Delivery</h1>
      
      <div className="delivery-details">
        <h2>Order #{delivery.orderId._id.substring(0, 8)}</h2>
        <p><strong>Status:</strong> {delivery.status.replace('_', ' ')}</p>
        <p><strong>Driver:</strong> {delivery.driverId.name}</p>
        <p><strong>Driver Phone:</strong> {delivery.driverId.phoneNumber}</p>
        <p><strong>Customer:</strong> {delivery.customerId.name}</p>
        <p><strong>Customer Address:</strong> {delivery.deliveryLocation.address}</p>
        <p><strong>Estimated Delivery:</strong> {new Date(delivery.estimatedDeliveryTime).toLocaleTimeString()}</p>
      </div>
      
      <DeliveryMap 
        deliveryId={delivery._id}
        pickupLocation={delivery.pickupLocation}
        deliveryLocation={delivery.deliveryLocation}
        initialCurrentLocation={delivery.currentLocation}
      />
    </div>
  );
};

export default RestaurantTrackDelivery;
