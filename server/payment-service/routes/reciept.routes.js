import express from 'express';
import { getReceiptController, updateReceiptController, deleteReceiptController } from '../controllers/reciept.controller.js';

const router = express.Router();

// Create a new receipt
// router.post('/', createReceiptController);
// Get a receipt by ID
router.get('/:receiptId', getReceiptController);
// Update a receipt by ID
router.put('/:receiptId', updateReceiptController);
// Delete a receipt by ID
router.delete('/:receiptId', deleteReceiptController);

export default router;