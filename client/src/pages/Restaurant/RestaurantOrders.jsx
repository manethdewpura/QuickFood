import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import RestaurantAdminHeader from "./RestaurantHeader.jsx";
import Footer from "../../components/Footer.jsx";

const RestaurantOrders = ({ restaurantId }) => {
  const { id: restaurantIdFromParams } = useParams();
  restaurantId = restaurantId || restaurantIdFromParams;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/order/restaurant/${restaurantIdFromParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [restaurantId]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/order/status/${orderId}`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const verifyOrderCode = async (orderId, verificationCode) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/restaurant/verify/${orderId}/${verificationCode}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Verification successful", res.data);
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  if (loading)
    return <div className="text-center mt-10">Loading Orders...</div>;

  return (
    <>
      <RestaurantAdminHeader />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Restaurant Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border p-4 rounded shadow bg-white"
              >
                <h2 className="text-lg font-semibold mb-2">
                  Order ID :{order._id}
                </h2>
                <p>
                  <strong>Customer:</strong>{" "}
                  {order.customer.customerData.user.name}
                </p>
                <p>
                  <strong>Items:</strong>{" "}
                  {order.items
                    .map(
                      (i) => `${i.menuItem.data.menuItemName} x ${i.quantity}`
                    )
                    .join(", ")}
                </p>
                <p>
                  <strong>Total:</strong> Rs. {order.totalAmount}
                </p>
                <div className="space-x-2">
                  {!order.isOrderAccepted ? (
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("token");
                          await axios.put(
                            `http://localhost:5000/order/update/accept/${order._id}`,
                            {},
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          setOrders((prevOrders) =>
                            prevOrders.map((o) =>
                              o._id === order._id
                                ? { ...o, isOrderAccepted: true }
                                : o
                            )
                          );
                        } catch (err) {
                          console.error("Failed to accept order", err);
                        }
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Accept Order
                    </button>
                  ) : (
                    <p className="text-green-600 font-semibold">
                      Order Accepted
                    </p>
                  )}
                </div>
                {order.isOrderAccepted && (
                  <div className="space-x-2">
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="text-blue-600">
                        {" "}
                        {order.orderStatus}
                      </span>
                    </p>
                    <select
                      value={order.orderStatus}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        await updateOrderStatus(order._id, newStatus);
                        setOrders((prevOrders) =>
                          prevOrders.map((o) =>
                            o._id === order._id
                              ? { ...o, status: newStatus }
                              : o
                          )
                        );
                      }}
                      className="border p-2 rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Ready">Ready</option>
                      <option value="Accepted" disabled>
                        Accepted
                      </option>
                      <option value="Picked Up" disabled>
                        Picked Up
                      </option>
                      <option value="In Transit" disabled>
                        In Transit
                      </option>
                      <option value="Delivered" disabled>
                        Delivered
                      </option>
                      <option value="Cancelled" disabled>
                        Cancelled
                      </option>
                    </select>
                  </div>
                )}
                {order.orderStatus === "Ready" && (
                  <div className="relative">
                    <p>
                      <strong>Verification Code :</strong>
                    </p>
                    <textarea
                      id={`verificationCode-${order._id}`}
                      className="mt-1 block w-1/2 border p-2 rounded"
                      rows="1"
                      value={order.verificationCode || ""}
                      onChange={async (e) => {
                        const newCode = e.target.value;
                        setOrders((prevOrders) =>
                          prevOrders.map((o) =>
                            o._id === order._id
                              ? { ...o, verificationCode: newCode }
                              : o
                          )
                        );
                        if (newCode.length === 6) {
                          await verifyOrderCode(order._id, newCode);
                          window.location.reload();
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default RestaurantOrders;
