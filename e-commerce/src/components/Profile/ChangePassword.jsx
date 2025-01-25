import React, { useState } from "react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
    } else {
      alert("Password changed successfully!");
    }
  };

  return (
    <div className="mt-8 mx-0 bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-left mb-6 text-white">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            placeholder="Enter your current password"
            className="border border-gray-600 bg-gray-700 text-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="Enter your new password"
            className="border border-gray-600 bg-gray-700 text-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm New Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            className="border border-gray-600 bg-gray-700 text-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex">
          <button
            type="submit"
            className="m-auto w-fit p-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
