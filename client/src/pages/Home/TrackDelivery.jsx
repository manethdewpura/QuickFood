import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DeliveryMap from "../DeliveryComponents/DeliveryMap";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const TrackDelivery = () => {
  const [delivery, setDelivery] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/delivery/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDelivery(response.data);
        const driverId = response.data.driverId?._id || response.data.driverId;
        if (driverId) {
          console.log(driverId);
          const driverResponse = await axios.get(
            `http://localhost:5000/driver/${driverId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDriver(driverResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching delivery details:", error);
        setError("Failed to load delivery details");
        setLoading(false);
      }
    };

    fetchDeliveryDetails();
    const interval = setInterval(fetchDeliveryDetails, 60000);

    return () => clearInterval(interval);
  }, [id]);

  const getEstimatedArrivalTime = () => {
    if (!delivery) return "Calculating...";

    const now = new Date();
    const eta = new Date(delivery.estimatedDeliveryTime);

    if (eta < now) return "Arriving soon";

    const diffMs = eta - now;
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 1) return "Less than a minute";
    if (diffMins === 1) return "1 minute";
    return `${diffMins} minutes`;
  };

  const getStatusText = (status) => {
    switch (status) {
      case "assigned":
        return "Driver assigned";
      case "picked_up":
        return "Food picked up";
      case "in_transit":
        return "On the way";
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  if (loading) return <div>Loading delivery details...</div>;
  if (error) return <div>{error}</div>;
  if (!delivery) return <div>Delivery not found</div>;
  return (
    <div className="min-h-screen bg-gray-100">
      <Header isLoggedIn={localStorage.getItem("token") !== null} />
      <div className="flex flex-col items-center justify-center p-6">
        <div className="bg-white my-8 p-8 rounded shadow-md w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-6 text-black">
            Track Your Delivery
          </h1>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-blue-600">
                Order #
                {typeof delivery.orderId === "object"
                  ? delivery.orderId._id.substring(0, 8)
                  : (delivery.orderId || "").substring(0, 8)}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  delivery.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : delivery.status === "in_transit"
                    ? "bg-blue-100 text-blue-700"
                    : delivery.status === "picked_up"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {getStatusText(delivery.status)}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-600">
                Estimated Arrival
              </h3>
              <p className="text-gray-700 text-lg">
                {getEstimatedArrivalTime()}
              </p>
            </div>

            {driver && (
              <div className="mb-4 bg-gray-50 p-4 rounded shadow">
                <h3 className="font-semibold text-blue-600 mb-2">
                  Your Driver
                </h3>
                <p>
                  <span className="font-semibold">Name:</span> {driver.name}
                </p>
                <p>
                  <span className="font-semibold">Vehicle:</span>{" "}
                  {driver.vehicleType} ({driver.vehicleNumber})
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {driver.phoneNumber}
                </p>
                <p>
                  <span className="font-semibold">Rating:</span>{" "}
                  {driver.rating?.toFixed(1) || "N/A"} ⭐
                </p>
              </div>
            )}

            <div className="mb-4 bg-gray-50 p-4 rounded shadow">
              <h3 className="font-semibold text-blue-600 mb-2">
                Verification Code
              </h3>
              <p className="text-2xl font-bold text-blue-700">
                {delivery.verificationCode}
              </p>
              <p className="text-sm text-gray-500">
                Show this code to your driver upon delivery
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded shadow my-6">
            <h2 className="text-lg font-semibold mb-2 text-blue-600">
              Live Tracking
            </h2>
            <DeliveryMap
              deliveryId={delivery._id}
              pickupLocation={delivery.pickupLocation}
              deliveryLocation={delivery.deliveryLocation}
              initialCurrentLocation={delivery.currentLocation}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrackDelivery;
