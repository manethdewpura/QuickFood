import express from "express";
import {
  createStripeSessionController,
  handlePaymentSuccessController,
} from "../controllers/payment.controller.js";

const router = express.Router();
router.post("/create-payment-intent", createStripeSessionController);
router.post("/success-payment", handlePaymentSuccessController);

export default router;
