import express from "express";
import {
  createStripeSessionController,
  handlePaymentSuccessController,
} from "../controllers/payment.controller.js";

const router = express.Router();
// Route to initialize payment process with Stripe
router.post("/create-payment-intent", createStripeSessionController);
// Route to handle successful payment callback
router.post("/success-payment", handlePaymentSuccessController);

export default router;
