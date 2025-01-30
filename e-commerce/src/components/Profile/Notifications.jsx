import React from "react";
import { useSelector } from "react-redux";

const Notifications = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "offer",
      title: "Exclusive 50% off on your next order!",
      message: "Hurry! Offer valid for a limited time.",
      time: "1h ago",
      icon: "🛍️"
    },
    {
      id: 2,
      type: "product",
      title: "New product launch - Check it out!",
      message: "We have new arrivals. Don't miss out!",
      time: "2h ago",
      icon: "🎁"
    },
    {
      id: 3,
      type: "shipping",
      title: "Your order #1234 has been shipped",
      message: "Track your order now for real-time updates.",
      time: "1d ago",
      icon: "🚚"
    }
  ];

  if (!isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Notifications</h2>
          <p className="text-gray-400">
            Please log in to view your notifications
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">
        Notifications
      </h2>

      {notifications.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-6 text-center text-gray-400">
          No new notifications
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="group bg-gray-800 rounded-xl p-4 md:p-6 flex items-start gap-4 transition-all hover:bg-gray-750"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-lg text-xl">
                {notification.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="text-white font-semibold truncate">
                    {notification.title}
                  </h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {notification.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {/* {loading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-6 h-20" />
          ))}
        </div>
      )} */}
    </div>
  );
};

export default Notifications;