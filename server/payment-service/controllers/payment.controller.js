import { generateHash, handleNotification } from "../services/payment.service.js";

export const generateHashController = async (req, res) => {
  try {
    console.log("Payment Controller - Generating hash...");
    
    // Validate merchant ID
    const merchant_id = process.env.MERCHANT_ID_PAYHERE;
    if (!merchant_id) {
      throw new Error("Unauthorized payment request - Invalid merchant configuration");
    }

    const items = req.body.items || "Sample Item";
    const order_id = req.body.order_id || "Order123";
    const amount = req.body.amount || "1000.00";
    const currency = req.body.currency || "LKR";

    // Validate required fields
    if (!amount || !order_id) {
      throw new Error("Missing required payment information");
    }

    const hash = await generateHash(order_id, amount, currency, items);
    
    res.json({ merchant_id, order_id, hash });
    console.log("Controller - Hash returned successfully");
  } catch (error) {
    console.error("Error generating hash:", error);
    res.status(401).json({ 
      error: "Payment authorization failed",
      message: error.message || "This is a merchant's error. Please contact support."
    });
  }
};

export const handleNotificationController = async (req, res) => {
  try {
    console.log("Payment Controller - Handling notification...");
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = req.body;

    if (!merchant_id || !order_id || !payhere_amount || !payhere_currency || !status_code || !md5sig) {
      throw new Error("Missing required notification parameters");
    }

    await handleNotification(
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Error handling notification:", error);
    res.status(400).json({ 
      error: "Notification handling failed",
      message: error.message || "Invalid notification data. Please contact support."
    });
  }
};

export const testController = (req, res) => {
  console.log("Payment Controller - Test endpoint hit");
  res.json({ message: "Test endpoint hit" });
}