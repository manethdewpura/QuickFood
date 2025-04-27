import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DeliveryMap from '../DeliveryComponents/DeliveryMap';
import DeliveryStatus from '../DeliveryComponents/DeliveryStatus';
import DriverHeader from '../../components/Driver/DriverHeader';

const DeliveryPage = () => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/delivery/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ); setDelivery(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load delivery details');
        setLoading(false);
      }
    };

    fetchDelivery();

    // Set up interval to refresh data
    const interval = setInterval(fetchDelivery, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [id]);


  // Function to update location
  const updateLocation = useCallback(async (position) => {
    try {
      const token = localStorage.getItem('token');
      const currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      await axios.patch(
        `http://localhost:5000/delivery/${id}/location`,
        { currentLocation },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to update location', err);
    }
  }, [id]);

  // Start location tracking
  useEffect(() => {
    if (!isTracking || !delivery) return;

    // Request permission for location tracking
    if (navigator.geolocation) {
      // Get initial location
      navigator.geolocation.getCurrentPosition(
        updateLocation,
        (err) => {
          setError('Unable to get location: ' + err.message);
          setIsTracking(false);
        }
      );

      // Set up continuous tracking
      const watchId = navigator.geolocation.watchPosition(
        updateLocation,
        (err) => {
          setError('Location tracking error: ' + err.message);
          setIsTracking(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );

      // Cleanup function to stop tracking
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      setError('Geolocation is not supported by this browser.');
      setIsTracking(false);
    }
  }, [isTracking, delivery, updateLocation]);

  const updateDeliveryStatus = async (status) => {
    try {
      // Get current location from browser
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const token = localStorage.getItem('token');
          const currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          const response = await axios.patch(
            `http://localhost:5000/delivery/${id}/status`,
            { status, currentLocation },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setDelivery(response.data);

          // Start tracking when status is updated to "picked_up" or "in_transit"
          if (status === 'picked_up' || status === 'in_transit') {
            setIsTracking(true);
          } else if (status === 'delivered') {
            setIsTracking(false);
          }
        },
        (err) => {
          setError('Unable to get current location. Please enable location services.');
        }
      );
    } catch (err) {
      setError('Failed to update delivery status');
    }
  };

  // Toggle tracking function
  const toggleTracking = () => {
    setIsTracking(prev => !prev);
  };

  if (loading) return <div>Loading delivery details...</div>;
  if (error) return <div>{error}</div>;
  if (!delivery) return <div>Delivery not found</div>;

  return (
    <div>
      <DriverHeader />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 mt-10 rounded shadow-md w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">
            Delivery #{delivery._id.substring(0, 8)}
          </h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">Order Details</h2>
            <div className="space-y-1">
              <p><span className="font-semibold">Restaurant:</span> {delivery.restaurantId.name}</p>
              <p><span className="font-semibold">Restaurant Address:</span> {delivery.pickupLocation.address}</p>
              <p><span className="font-semibold">Customer Address:</span> {delivery.deliveryLocation.address}</p>
              <p><span className="font-semibold">Verification Code:</span> {delivery.verificationCode}</p>
              <p><span className="font-semibold">Estimated Delivery Time:</span> {new Date(delivery.estimatedDeliveryTime).toLocaleTimeString()}</p>
            </div>
          </div>

          <DeliveryStatus
            currentStatus={delivery.status}
            onUpdateStatus={updateDeliveryStatus}
          />

          <div className="tracking-controls my-4">
            <button
              className={`tracking-btn w-full py-2 rounded font-semibold ${isTracking ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              onClick={toggleTracking}
            >
              {isTracking ? 'Stop Location Sharing' : 'Start Location Sharing'}
            </button>
            <p className="tracking-status text-center mt-2 text-sm text-gray-500">
              {isTracking ? 'Your location is being shared in real-time' : 'Location sharing is paused'}
            </p>
          </div>

          <DeliveryMap
            deliveryId={delivery._id}
            pickupLocation={delivery.pickupLocation}
            deliveryLocation={delivery.deliveryLocation}
            initialCurrentLocation={delivery.currentLocation}
          />
        </div>
      </div>
    </div>

  );
};

export default DeliveryPage;
