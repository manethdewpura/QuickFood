import React, { useState, useEffect } from "react";
import { FaBell, FaCircle, FaTrash } from "react-icons/fa";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../services/notificationService";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      setError("Failed to load notifications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
      >
        <FaBell className="text-2xl hover:scale-110 transition-transform duration-200" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl z-50 transform transition-all duration-200 ease-out border border-gray-100">
          <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-white">
            <h3 className="text-lg font-semibold text-gray-800">
              Notifications
            </h3>
          </div>
          <div className="max-h-[32rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {loading ? (
              <div className="p-8 text-center text-gray-500 animate-pulse">
                <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-2"></div>
                <p>Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500 bg-red-50">
                <p className="font-medium">{error}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FaBell className="text-4xl mx-auto mb-2 opacity-30" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b transition-colors duration-200 flex items-start justify-between ${
                    !notification.read
                      ? "bg-blue-50 hover:bg-blue-100"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start space-x-3 flex-grow">
                    {!notification.read && (
                      <FaCircle className="text-blue-500 text-xs mt-2 animate-pulse" />
                    )}
                    <div className="flex-grow">
                      <p className="text-sm text-gray-800 font-medium leading-snug">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 font-medium">
                        {notification.time}
                      </p>
                      {!notification.read && (
                        <div className="mt-2">
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors duration-200"
                          >
                            Mark as Read
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification._id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 hover:bg-red-50 rounded-full ml-2"
                  >
                    <FaTrash className="text-base" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
