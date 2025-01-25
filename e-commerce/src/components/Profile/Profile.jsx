import React, { useState } from "react";
import ProfileInformation from "./ProfileInfo";
import PaymentHistory from "./PaymentHistory";
import SavedAddresses from "./SavedAddresses";
import ChangePassword from "./ChangePassword";
import Notifications from "./Notifications";
import { useSelector } from 'react-redux';

const Profile = () => {
  const [selectedOption, setSelectedOption] = useState("profileInformation");
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const handleMenuClick = (option) => {
    setSelectedOption(option);
  };

  const renderRightSection = () => {
    switch (selectedOption) {
      case "paymentHistory":
        return <PaymentHistory />;
      case "savedAddresses":
        return <SavedAddresses />;
      case "changePassword":
        return <ChangePassword />;
      case "notifications":
        return <Notifications />;
      case "profileInformation":
      default:
        return <ProfileInformation />;
    }
  };

  return isLoggedIn ? (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Left Sidebar */}
      <aside className="w-1/4 bg-gray-800 shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-300">
            Hello, {user.name} 👋
          </h1>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => handleMenuClick("paymentHistory")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              selectedOption === "paymentHistory"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700"
            }`}
          >
            Payment History
          </button>
          <button
            onClick={() => handleMenuClick("profileInformation")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              selectedOption === "profileInformation"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => handleMenuClick("savedAddresses")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              selectedOption === "savedAddresses"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700"
            }`}
          >
            Saved Addresses
          </button>
          <button
            onClick={() => handleMenuClick("changePassword")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              selectedOption === "changePassword"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700"
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => handleMenuClick("notifications")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              selectedOption === "notifications"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700"
            }`}
          >
            Notifications
          </button>
          <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700 rounded-lg">
            LOG OUT
          </button>
        </div>
      </aside>

      {/* Right Section */}
      <main className="w-3/4 bg-gray-800 shadow-lg p-8">
        {renderRightSection()}
        {/* Delete Account */}
        <div className="mt-8">
          <button
            className="text-red-500 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete your account?")) {
                alert("Account deleted successfully.");
                // Add your account deletion logic here
              }
            }}
          >
            Delete Account
          </button>
        </div>
      </main>
    </div>
  ) : (
    <div className="text-center p-20 bg-gray-800 text-white">
      <p>Please log in to view your profile.</p>
      {/* <button
        onClick={switchAuth}
        className="bg-blue-600 text-white py-2 px-4 rounded"
      >
        Log In
      </button> */}
    </div>
  );
};

export default Profile;
