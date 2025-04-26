import React from "react";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const { restaurantId, items, total } = location.state || {};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment</h1>
      <p className="text-gray-700 mb-4">
        <span className="font-semibold">Restaurant ID:</span> {restaurantId}
      </p>
      <p className="text-gray-700 mb-4">
        <span className="font-semibold">Total Amount:</span> Rs.{total}.00
      </p>
      <button className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Proceed to Payment
      </button>
    </div>
  );
};

export default Payment;
