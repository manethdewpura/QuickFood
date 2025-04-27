import express from "express";
import {
  createNewOrder,
  updateOrderStatus,
  getReadyOrders,
  getAllOrders,
  getCustomerOrders,
  getRestaurantOrders,
  getOrderById,
  updateOrderAccept,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", createNewOrder); // Route to create a new order
router.put("/status/:orderId", updateOrderStatus); // Route to update order status
router.get("/ready", getReadyOrders); // Route to get all ready orders
router.get("/allorders", getAllOrders); // Route to get all orders
router.get("/customer", getCustomerOrders); // Route to get all orders for a customer
router.get("/restaurant/:restaurantId", getRestaurantOrders); // Route to get all orders for a restaurant
router.get("/:orderId", getOrderById); // Route to get a specific order by ID
router.put("/update/accept/:orderId", updateOrderAccept); // Route to accept an order

export default router;
