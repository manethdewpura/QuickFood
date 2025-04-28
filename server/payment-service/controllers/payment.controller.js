import { createPaymentIntent } from "../services/stripe.service.js";
import { createReceipt } from "../services/reciept.service.js";
import axios from "axios";

export const createStripeSessionController = async (req, res) => {
  try {
    const { amount } = req.body;

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
    const { customerDetails, items } = orderData;
    let restaurantAdminId = null;

    const userId = req.headers["x-user-id"];

    const orderResponse = await axios.post(
      "http://localhost:5005/order",
      {
        ...orderData,
        userId,
        status: "confirmed",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
      }
    );
    const order = orderResponse.data;

    const receipt = await createReceipt(
      order.data._id,
      amount,
      currency,
      2,
      paymentIntentId
    );
    // Fetch restaurant admin ID
    await axios
      .get(`http://localhost:5007/restaurantAll/admin/${order.data.restaurantId}`)
      .then((response) => {
        restaurantAdminId = response.data.data;
      })
      .catch((error) => {
        console.error("Error fetching restaurant name:", error);
      });

    // Send notification
    await axios.post("http://localhost:5004/notifications", {
      userId,
      name: customerDetails.firstName,
      message: `Your order #${order.data._id} has been confirmed`,
      type: "order",
    });

    // Send email
    await axios.post("http://localhost:5004/notifications/order-confirmation", {
      email: customerDetails.email,
      name: `${customerDetails.firstName} ${customerDetails.lastName}`,
      orderId: order.data._id,
      orderDetails: {
        items: items,
        totalAmount: amount,
        currency,
        deliveryAddress: `${customerDetails.address}, ${customerDetails.city}`,
      },
    });

    // Send notification to restaurant
    await axios.post("http://localhost:5004/notifications", {
      userId: restaurantAdminId,
      name: "Restaurant Staff",
      message: `New order #${order.data._id} received to ${orderData.restaurantName}`,
      type: "order",
    });

    

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
