import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// Validate Stripe secret key existence
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
}

// Initialize Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Service to create a new payment intent with Stripe
export const createPaymentIntent = async (amount, currency = "lkr") => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error("Payment Intent creation error:", error);
    throw error;
  }
};
