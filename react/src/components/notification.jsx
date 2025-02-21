import { useEffect, useState } from "react";
import axios from "axios";
import echo from "../config/echo";
import { useAuth } from "../context/authContext";
import axiosPrivate from "../api/axiosPrivate";
import { toast } from "sonner";
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const [auth] = useAuth();
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    fetchNotifications();

    const channel = echo.private(`App.Models.User.${user.id}`);

    channel.listen('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', (e) => {
      console.log("Raw Notification Event:", e);

      // Parse the event data (it's a stringified JSON)
      //const eventData = JSON.parse(e.data);

      // Display the toast notification
      toast.message(e.message, {
        description: `Post ID: ${e.post_id}, Comment ID: ${e.comment_id}`,
        duration: 5000, // 5 seconds
      });
    });

    // Cleanup: Remove event listener when component unmounts
    return () => {
      channel.stopListening('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated');
      echo.leave(`App.Models.User.${user.id}`);
    };
  }, [user]); // Only run when `user` changes


  const fetchNotifications = async () => {
    try {
      const res = await axiosPrivate.get('notification ')

      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div className="fixed top-5 right-5 w-80 bg-white shadow-lg rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Notifications</h3>
      <ul className="space-y-2">
        {notifications?.length === 0 ? (
          <li className="text-gray-500 text-sm">No new notifications</li>
        ) : (
          notifications?.map((notification) => (
            <li
              key={notification.id}
              className="bg-gray-100 p-3 rounded-md shadow-sm flex justify-between items-center hover:bg-gray-200 transition"
            >
              <span className="text-sm text-gray-700">{notification.message}</span>
              <button
                onClick={() => markAsRead(notification.id)}
                className="text-xs text-blue-500 hover:underline"
              >
                Mark as Read
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Notifications;
