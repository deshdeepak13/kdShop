import React from "react";
import { useSelector } from "react-redux";

const Notifications = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6 text-white">Notifications</h2>
      <div className="space-y-4">
        <div className="p-4 bg-blue-800 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <p className="font-semibold text-white">Exclusive 50% off on your next order!</p>
            <p className="text-sm text-gray-300">Hurry! Offer valid for a limited time.</p>
          </div>
          <div className="text-xs text-gray-400">1 hour ago</div>
        </div>

        <div className="p-4 bg-green-800 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <p className="font-semibold text-white">New product launch - Check it out!</p>
            <p className="text-sm text-gray-300">We have new arrivals. Don't miss out!</p>
          </div>
          <div className="text-xs text-gray-400">2 hours ago</div>
        </div>

        <div className="p-4 bg-yellow-800 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <p className="font-semibold text-white">Your order #1234 has been shipped.</p>
            <p className="text-sm text-gray-300">Track your order now for real-time updates.</p>
          </div>
          <div className="text-xs text-gray-400">1 day ago</div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
