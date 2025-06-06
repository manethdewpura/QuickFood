import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API_URL } from "../../config/api.config";

// Component for displaying customer's order history
const CustomerOrders = () => {
  // State management and data fetching
  const location = useLocation();
  const [orders, setOrders] = useState(location.state?.orders || []);
  const [loading, setLoading] = useState(!location.state?.orders);
  const token = localStorage.getItem("token");
  console.log(token);

  useEffect(() => {
    if (!location.state?.orders) {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`${API_URL}order/customer`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setOrders(
            Array.isArray(response.data.data) ? response.data.data : []
          );
        } catch (error) {
          console.error("Error fetching orders:", error);
          alert("Failed to fetch orders. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [location.state?.orders, token]);

  // Render orders list
  if (loading) {
    return <p>Loading your orders...</p>;
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header isLoggedIn={token !== null} />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-black mb-6">Your Orders</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Order ID: {order.orderId}
              </h2>
              <p className="text-gray-600 mb-1">
                <strong>Restaurant:</strong> {order.restaurant.name}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Total Amount:</strong> Rs.{order.totalAmount}.00
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Status:</strong> {order.orderStatus}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Order Date:</strong>{" "}
                {new Date(order.deliveryDetails.assignedAt).toLocaleString()}
              </p>
              <div className="mt-2">
                <h3 className="font-semibold text-gray-700 mb-2">Items:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.menuItemDetails.data.menuItemName} - {item.quantity}{" "}
                      x Rs.{item.menuItemDetails.data.price}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 mb-1">
                  <strong>Pickup Location:</strong>{" "}
                  {order.deliveryDetails?.pickupLocation?.address || "N/A"}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Delivery Location:</strong>{" "}
                  {order.deliveryDetails?.deliveryLocation?.address || "N/A"}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Verification Code:</strong>{" "}
                  {order.deliveryDetails?.verificationCode || "N/A"}
                </p>
                {order.deliveryDetails?.pickupLocation &&
                  order.deliveryDetails?.deliveryLocation &&
                  order.deliveryDetails?.verificationCode && (
                    <div className="mt-4">
                      <Link
                        to={`/track-delivery/${order.deliveryDetails._id}`}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        Track Delivery
                      </Link>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerOrders;
