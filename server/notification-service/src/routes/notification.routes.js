import { Router } from "express";
import {
  createNotification,
  getNotifications,
  updateNotification,
  markAsRead,
  sendOrderConfirmation,
  deleteNotification,
  createDriverNotification,
} from "../controllers/notification.controller.js";

const router = Router();

// Create a new notification
router.post("/", createNotification);

// Get all notifications for a specific user
router.get("/user", getNotifications);

// Update an existing notification
router.put("/:id", updateNotification);

// Mark a notification as read
router.patch("/:id/read", markAsRead);

// Delete a notification
router.delete("/:id", deleteNotification);

// Send order confirmation email
router.post("/order-confirmation", sendOrderConfirmation);

// Create notification for drivers with duplicate check
router.post("/driver", createDriverNotification);

export default router;
