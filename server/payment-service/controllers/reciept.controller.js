import e from 'express';
import { createReceipt, getReceiptById} from '../services/reciept.service.js';

export const createReceiptController = async (req, res) => {
    try {
        const { orderId, amount, currency, status, transactionId } = req.body;
        if (!orderId || !amount || !currency || !status || !transactionId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const receipt = await createReceipt(orderId, amount, currency, status, transactionId);
        res.status(201).json(receipt);
    } catch (error) {
        console.error("Error creating receipt:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getReceiptController = async (req, res) => {
    try {
        const { receiptId } = req.params;
        const receipt = await getReceiptById(receiptId);
        res.status(200).json(receipt);
    } catch (error) {
        console.error("Error fetching receipt:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}