import {
  createNotification as createNotificationService,
  getNotifications as getNotificationsService,
  updateNotification as updateNotificationService,
  markAsRead as markAsReadService,
  deleteNotification as deleteNotificationService,
  createDriverNotification as createDriverNotificationService,
} from "../services/notification.service.js";
import {
  sendOrderConfirmationEmail,
} from "../services/email.service.js";

// Handle creation of new notifications
export const createNotification = async (req, res) => {
  try {
    const notification = await createNotificationService(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error });
  }
};

// Retrieve all notifications for a specific user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const notifications = await getNotificationsService(userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

// Update an existing notification
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

// Mark a notification as read
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

// Remove a notification from the system
export const deleteNotification = async (req, res) => {
  try {
    const notification = await deleteNotificationService(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error });
  }
};

// Process and send order confirmation emails
export const sendOrderConfirmation = async (req, res) => {
  try {
    const { name, email, orderId, orderDetails } = req.body;
    await sendOrderConfirmationEmail(email, name, orderId, orderDetails);
    res.status(200).json({ message: "Order confirmation email sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create notification for delivery drivers
export const createDriverNotification = async (req, res) => {
  try {
    const { userId, name, message } = req.body;
    const notification = await createDriverNotificationService(userId, name, message);
    res.status(201).json({
      success: true,
      data: notification,
      message: notification.isNew ? "New notification created" : "Existing notification returned"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing notification",
      error: error.message
    });
  }
};