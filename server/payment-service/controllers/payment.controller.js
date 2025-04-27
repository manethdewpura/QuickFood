import { createPaymentIntent } from "../services/stripe.service.js";
import { createReceipt } from "../services/reciept.service.js";
import axios from "axios";

export const createStripeSessionController = async (req, res) => {
  try {
    const { amount } = req.body;

    console.log("Received amount:", amount);
    if (!amount) {
      throw new Error("Amount is required");
    }

    const paymentIntent = await createPaymentIntent(amount);

    res.status(200).json(paymentIntent);
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      error: "Payment intent creation failed",
      message: error.message,
    });
  }
};

export const handlePaymentSuccessController = async (req, res) => {
  try {
    const { amount, currency, paymentIntentId, orderData } = req.body;

    const userId = req.headers["x-user-id"];
    console.log("User ID from headers:", userId);
    const orderResponse = await axios.post(
      "http://localhost:5005/order",
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
      }
    );
    const order = orderResponse.data;
    console.log("Order created:", order);

    const receipt = await createReceipt(
      order.data._id,
      amount,
      currency,
      2,
      paymentIntentId
    );

    res.status(200).json({
      success: true,
      order,
      receipt,
    });
  } catch (error) {
    console.error("Error handling payment success:", error);
    res.status(500).json({
      error: "Payment success handling failed",
      message: error.message,
    });
  }
};
