// Import required services and dependencies
import { createPaymentIntent } from "../services/stripe.service.js";
import { createReceipt } from "../services/reciept.service.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Controller to create a new Stripe payment session
export const createStripeSessionController = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate the presence of amount in the request
    if (!amount) {
      throw new Error("Amount is required");
    }

    // Create a payment intent using Stripe service
    const paymentIntent = await createPaymentIntent(amount);

    // Respond with the created payment intent
    res.status(200).json(paymentIntent);
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      error: "Payment intent creation failed",
      message: error.message,
    });
  }
};

// Controller to handle successful payment and create order
export const handlePaymentSuccessController = async (req, res) => {
  try {
    // Extract payment and order details from request
    const { amount, currency, paymentIntentId, orderData } = req.body;
    const { customerDetails, items } = orderData;
    let restaurantAdminId = null;

    // Extract user ID from request headers
    const userId = req.headers["x-user-id"];

    // Create new order in the order service
    const orderResponse = await axios.post(
      `${process.env.ORDER_SERVICE_URL}order`,
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

    // Generate receipt for the order
    const receipt = await createReceipt(
      order.data._id,
      amount,
      currency,
      2,
      paymentIntentId
    );

    // Fetch restaurant admin information for notifications
    await axios
      .get(`${process.env.RESTAURANT_SERVICE_URL}restaurantAll/admin/${order.data.restaurantId}`)
      .then((response) => {
        restaurantAdminId = response.data.data;
      })
      .catch((error) => {
        console.error("Error fetching restaurant name:", error);
      });

    // Send notifications and confirmation emails
    await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}notifications`, {
      userId,
      name: customerDetails.firstName,
      message: `Your order #${order.data._id} has been confirmed`,
      type: "order",
    });

    // Send order confirmation email to customer
    await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}notifications/order-confirmation`, {
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

    // Notify restaurant about new order
    await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}notifications`, {
      userId: restaurantAdminId,
      name: "Restaurant Staff",
      message: `New order #${order.data._id} received to ${orderData.restaurantName}`,
      type: "order",
    });

    // Respond with success status, order, and receipt details
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
