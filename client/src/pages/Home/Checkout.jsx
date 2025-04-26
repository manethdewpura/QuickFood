import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurantId } = location.state || {};
  const [restaurantName, setRestaurantName] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const shippingFee = 50; // Example shipping fee
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage

  useEffect(() => {
    if (!restaurantId) return;

    // Fetch restaurant and cart details
    axios
      .get(`http://localhost:5000/cart/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const { restaurant, items } = response.data || {};
        if (restaurant && items) {
          setRestaurantName(restaurant.restaurantName);
          setItems(items);
        } else {
          console.error("Invalid response data:", response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching checkout details:", error);
        setLoading(false);
      });
  }, [restaurantId, token]);

  const calculateSubtotal = () =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePayment = () => {
    navigate("/payment", {
      state: { restaurantId, items, total: calculateSubtotal() + shippingFee },
    });
  };

  if (loading) {
    return <p>Loading checkout details...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <h2 className="text-xl font-semibold mb-4">
        Restaurant: {restaurantName}
      </h2>
      <div className="mb-6">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Item Name</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.menuItemId}>
                <td className="border border-gray-300 px-4 py-2">
                  {item.menuItemName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Rs.{item.price}.00
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Rs.{item.price * item.quantity}.00
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-6">
        <p className="text-gray-700">
          <span className="font-semibold">Subtotal:</span> Rs.
          {calculateSubtotal()}.00
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Shipping Fee:</span> Rs.{shippingFee}
          .00
        </p>
        <p className="text-gray-700 font-bold">
          <span className="font-semibold">Total:</span> Rs.
          {calculateSubtotal() + shippingFee}.00
        </p>
      </div>
      <button
        onClick={handlePayment}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Pay
      </button>
    </div>
  );
};

export default Checkout;
