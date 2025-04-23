import express from "express";
import {
  createNewOrder,
  updateOrderStatus,
  getReadyOrders,
  getCustomerOrders,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", createNewOrder); // Route to create a new order
router.put("/status/:orderId", updateOrderStatus); // Route to update order status
router.get("/ready", getReadyOrders); // Route to get all ready orders
router.get("/customer/:customerId", getCustomerOrders); // Route to get all orders for a customer

export default router;
