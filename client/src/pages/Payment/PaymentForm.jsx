import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "0771234567",
    address: "123 Main Street",
    city: "Colombo",
    country: "Sri Lanka",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPayhereLoaded, setIsPayhereLoaded] = useState(false);

  useEffect(() => {
    const loadPayhere = () => {
      const script = document.createElement("script");
      script.src = "https://www.payhere.lk/lib/payhere.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        setIsPayhereLoaded(true);
        // Configure PayHere
        window.payhere.onCompleted = function onCompleted(orderId) {
          console.log("Payment completed. OrderID:" + orderId);
          // Handle successful payment
        };
        window.payhere.onDismissed = function onDismissed() {
          console.log("Payment dismissed");
          setError("Payment was cancelled");
        };
        window.payhere.onError = function onError(error) {
          console.log("Error:" + error);
          setError("Payment error: " + error);
        };
      };
      script.onerror = () => setError("Failed to load payment gateway");
      document.body.appendChild(script);
    };
    loadPayhere();

    return () => {
      // Cleanup PayHere script on unmount
      const script = document.querySelector('script[src="https://www.payhere.lk/lib/payhere.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!isPayhereLoaded) {
      setError("Payment gateway is not ready. Please try again.");
      setIsLoading(false);
      return;
    }

    const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'address', 'city', 'country'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://grumpy-chairs-sniff.loca.lt/payment", {
        ...formData,
        amount: "1000.00",
        currency: "LKR"
      });

      // Initialize PayHere payment with proper configuration
      const payment = {
        sandbox: true,
        merchant_id: response.data.merchant_id,
        return_url: window.location.origin + "/success",
        cancel_url: window.location.origin + "/cancel",
        notify_url: "https://grumpy-chairs-sniff.loca.lt/payment/notify",
        order_id: response.data.order_id,
        items: "Food Order",
        amount: "1000.00",
        currency: "LKR",
        hash: response.data.hash,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
      };

      if (window.payhere) {
        try {
          window.payhere.startPayment(payment);
        } catch (payhereError) {
          throw new Error(`PayHere initialization failed: ${payhereError.message}`);
        }
      } else {
        throw new Error("Payment gateway not initialized");
      }
    } catch (error) {
      setError(error.message || "Payment initiation failed");
      console.error("Payment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header isLoggedIn={true} location="Colombo" />
      <div className="min-h-screen bg-cover bg-center relative"
           style={{ backgroundImage: "url('/Checkout.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative flex items-start justify-start min-h-screen">
          <div className="max-w-md mt-10 ml-10 p-6 bg-white shadow-md rounded-md w-full md:w-1/2">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {isLoading ? "Processing..." : "Pay with PayHere"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentForm;
