import {
  createNotification as createNotificationService,
  getNotifications as getNotificationsService,
  updateNotification as updateNotificationService,
  markAsRead as markAsReadService,
} from "../services/notification.service.js";
import { sendOrderConfirmationEmail, sendDeliveryUpdateEmail } from '../services/email.service.js';

// Create new notification
export const createNotification = async (req, res) => {
  try {
    const notification = await createNotificationService(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error });
  }
};

// Get all notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await getNotificationsService(userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

// Update notification by ID
export const updateNotification = async (req, res) => {
  try {
    const notification = await updateNotificationService(
      req.params.id,
      req.body
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await markAsReadService(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking notification as read", error });
  }
};

export const sendOrderConfirmation = async (req, res) => {
    try {
        const { name, email, orderId } = req.body;
        await sendOrderConfirmationEmail(email, name, orderId);
        res.status(200).json({ message: 'Order confirmation email sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const sendDeliveryUpdate = async (req, res) => {
    try {
        const { name, email, orderId, status } = req.body;
        await sendDeliveryUpdateEmail(email, name, orderId, status);
        res.status(200).json({ message: 'Delivery update email sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
