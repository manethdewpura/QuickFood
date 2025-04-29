import Notification from "../models/notification.model.js";

// Create and store a new notification
export const createNotification = async (data) => {
  const notification = new Notification(data);
  return await notification.save();
};

// Create or retrieve existing driver notification
export const createDriverNotification = async (userId, name, message) => {
  const existingNotification = await Notification.findOne({ userId, name });
  
  if (existingNotification) {
    return existingNotification;
  }

  const notification = new Notification({
    userId,
    name,
    message,
    type: 'order',
    isRead: false
  });

  return await notification.save();
};

// Fetch all notifications for a user
export const getNotifications = async (userId) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
};

// Update notification content
export const updateNotification = async (id, data) => {
  return await Notification.findByIdAndUpdate(id, data, { new: true });
};

// Update notification read status
export const markAsRead = async (id) => {
  return await Notification.findByIdAndUpdate(
    id,
    { read: true },
    { new: true }
  );
};

// Remove notification from database
export const deleteNotification = async (id) => {
  return await Notification.findByIdAndDelete(id);
};
