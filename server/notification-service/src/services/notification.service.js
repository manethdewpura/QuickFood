import Notification from "../models/notification.model.js";

// Create new notification
export const createNotification = async (data) => {
  const notification = new Notification(data);
  return await notification.save();
};

// Create driver notification with duplicate check
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

// Get user notifications sorted by date
export const getNotifications = async (userId) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
};

// Update notification by id
export const updateNotification = async (id, data) => {
  return await Notification.findByIdAndUpdate(id, data, { new: true });
};

// Mark notification as read
export const markAsRead = async (id) => {
  return await Notification.findByIdAndUpdate(
    id,
    { read: true },
    { new: true }
  );
};

// Delete notification by id
export const deleteNotification = async (id) => {
  return await Notification.findByIdAndDelete(id);
};
