import React, { useState } from "react";
import ProfileInformation from "./ProfileInfo";
import PaymentHistory from "./PaymentHistory";
import SavedAddresses from "./SavedAddresses";
import ChangePassword from "./ChangePassword";
import Notifications from "./Notifications";
import { useSelector } from 'react-redux';
import { 
  FiUser, FiCreditCard, FiHome, FiLock, FiBell, 
  FiLogOut, FiTrash2, FiMenu, FiX 
} from "react-icons/fi";

const Profile = () => {
  const [selectedOption, setSelectedOption] = useState("profileInformation");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const menuItems = [
    { id: "profileInformation", label: "Profile", icon: <FiUser /> },
    { id: "paymentHistory", label: "Payments", icon: <FiCreditCard /> },
    { id: "savedAddresses", label: "Addresses", icon: <FiHome /> },
    { id: "changePassword", label: "Security", icon: <FiLock /> },
    { id: "notifications", label: "Notifications", icon: <FiBell /> },
  ];

  const renderRightSection = () => {
    switch (selectedOption) {
      case "paymentHistory": return <PaymentHistory />;
      case "savedAddresses": return <SavedAddresses />;
      case "changePassword": return <ChangePassword />;
      case "notifications": return <Notifications />;
      default: return <ProfileInformation />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-xl text-center max-w-md">
          <p className="text-gray-300 mb-6">Please log in to view your profile</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-all">
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Hello, {user.name}</h1>
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="text-gray-400 hover:text-white"
        >
          {showMobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar/Navigation */}
        <aside className={`md:w-64 md:block bg-gray-800 border-r border-gray-700 md:min-h-screen
          ${showMobileMenu ? "absolute inset-0 z-50 md:static" : "hidden"}`}
        >
          <div className="p-4 md:p-6">
            <div className="hidden md:block mb-8">
              <h1 className="text-xl font-semibold text-gray-300">Hello, {user.name} 👋</h1>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedOption(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${selectedOption === item.id 
                      ? "bg-blue-600 text-white" 
                      : "hover:bg-gray-700 text-gray-300"}`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 border-t border-gray-700 pt-6">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-xl">
                <FiLogOut />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 bg-gray-800 md:bg-transparent md:min-h-screen">
          <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg">
            {renderRightSection()}

            {/* Account Actions */}
            <div className="mt-12 pt-8 border-t border-gray-700">
              <h2 className="text-lg font-semibold mb-4">Danger Zone</h2>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete your account?")) {
                    // Handle account deletion
                  }
                }}
                className="w-full flex items-center justify-between p-4 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/30 transition-all"
              >
                <span>Delete Account</span>
                <FiTrash2 className="ml-2" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;