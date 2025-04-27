import express from "express";
import {
  createReceiptController,
  getReceiptController,
} from "../controllers/reciept.controller.js";

const router = express.Router();

// Create a new receipt
router.post("/", createReceiptController);
// Get a receipt by ID
router.get("/:receiptId", getReceiptController);

export default router;
