import { generateHash, handleNotification } from "../services/payment.service.js";

export const generateHashController = async (req, res) => {
  try {
    console.log("Payment Contoller - Generating hash...");
    const items = "Sample Item";
    const order_id = "Order123";
    const amount = "1000.00";
    const currency = "LKR";
    const merchant_id = process.env.APP_ID_PAYHERE;

    const hash = await generateHash(order_id, amount, currency,items);

    res.json({ merchant_id, order_id, hash });
    console.log("Contoller - Hash returned successfully");
  } catch (error) {
    console.error("Error generating hash:", error);
    res.status(500).json({ error: "Failed to generate hash" });
  }
};

export const handleNotificationController = async (req, res) => {
  try {
    console.log("Payment Contoller - Handling notification...");
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = req.body;

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
    res.status(500).json({ error: "Failed to handle notification" });
  }
};

export const testController = (req, res) => {
  console.log("Payment Contoller - Test endpoint hit");
  res.json({ message: "Test endpoint hit" });
}