import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getNotifications = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const markAsRead = async (notificationId) => {
  const token = localStorage.getItem('token');
  const response = await axios.patch(
    `${API_URL}/notifications/${notificationId}/read`,
    {},
    { headers: { Authorization: `Bearer ${token}` }}
  );
  return response.data;
};

export const deleteNotification = async (notificationId) => {
  const token = localStorage.getItem('token');
  await axios.delete(
    `${API_URL}/notifications/${notificationId}`,
    { headers: { Authorization: `Bearer ${token}` }}
  );
};
