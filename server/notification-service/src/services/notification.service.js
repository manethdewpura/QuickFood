import Notification from '../models/notification.model.js';

// Create new notification
export const createNotification = async (data) => {
    const notification = new Notification(data);
    return await notification.save();
}

// Get user notifications sorted by date
export const getNotifications = async (userId) => {
    return await Notification.find({ userId }).sort({ createdAt: -1 });
}

// Update notification by id
export const updateNotification = async (id, data) => {
    return await Notification.findByIdAndUpdate(id, data, { new: true });
}

// Mark notification as read
export const markAsRead = async (id) => {
    return await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
}
