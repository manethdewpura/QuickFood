import e from "express";
import { createReceipt, getReceiptById } from "../services/reciept.service.js";

// Controller to create a new receipt for an order
export const createReceiptController = async (req, res) => {
  try {
    // Extract receipt details from request body
    const { orderId, amount, currency, status, transactionId } = req.body;
    // Validate required fields
    if (!orderId || !amount || !currency || !status || !transactionId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Create receipt using receipt service
    const receipt = await createReceipt(
      orderId,
      amount,
      currency,
      status,
      transactionId
    );
    res.status(201).json(receipt);
  } catch (error) {
    // Log error and send internal server error response
    console.error("Error creating receipt:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to fetch receipt details by ID
export const getReceiptController = async (req, res) => {
  try {
    // Extract receipt ID from request parameters
    const { receiptId } = req.params;
    // Fetch receipt using receipt service
    const receipt = await getReceiptById(receiptId);
    res.status(200).json(receipt);
  } catch (error) {
    // Log error and send internal server error response
    console.error("Error fetching receipt:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
