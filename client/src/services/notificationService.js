import axios from "axios";

const API_URL = "http://localhost:5000/notifications";

export const getNotifications = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const markAsRead = async (notificationId) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch(
    `${API_URL}/${notificationId}/read`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteNotification = async (notificationId) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}/${notificationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
