import React, { useEffect } from "react";
import axios from "axios";

const PaymentForm = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!window.payhere) {
      console.error("PayHere SDK not loaded");
      return;
    }

    axios.post("http://localhost:5000/payment")
      .then((response) => {
        const data = response.data;
        console.log("Payment data:", data);
        const payment = {
          sandbox: true,
          merchant_id: data.merchant_id,
          return_url: "http://localhost:3000/success",
          cancel_url: "http://localhost:3000/cancel",
          notify_url: "http://localhost:5000/api/payment/notify",
          order_id: data.order_id,
          items: "Sample Item",
          amount: "1000.00",
          currency: "LKR",
          hash: data.hash,
          first_name: "John",
          last_name: "Doe",
          email: "johndoe@example.com",
          phone: "0771234567",
          address: "123 Main Street",
          city: "Colombo",
          country: "Sri Lanka",
        };

        window.payhere.startPayment(payment);
      })
      .catch((error) => {
        console.error("Payment error:", error);
      });
  };

  return <button onClick={handlePayment}>Pay with PayHere</button>;
};

export default PaymentForm;
