import axios from "axios";
import { API_URL } from '../config/api.config';

const NOTIFICATION_ENDPOINT = `${API_URL}notifications`;

export const getNotifications = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${NOTIFICATION_ENDPOINT}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const markAsRead = async (notificationId) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch(
    `${NOTIFICATION_ENDPOINT}/${notificationId}/read`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteNotification = async (notificationId) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${NOTIFICATION_ENDPOINT}/${notificationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
