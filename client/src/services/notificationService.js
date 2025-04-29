import axios from "axios";
import { API_URL } from '../config/api.config';

// Base endpoint for notification-related API calls
const NOTIFICATION_ENDPOINT = `${API_URL}notifications`;

// Fetch all notifications for the current user
export const getNotifications = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${NOTIFICATION_ENDPOINT}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Mark a specific notification as read
export const markAsRead = async (notificationId) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch(
    `${NOTIFICATION_ENDPOINT}/${notificationId}/read`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Remove a notification from the system
export const deleteNotification = async (notificationId) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${NOTIFICATION_ENDPOINT}/${notificationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
