import React, { useState } from "react";
import ProductManagement from "./ProductManagement";
import UserManagement from "./UserManagement";
import OrderManagement from "./OrderManagement";
import Dashboard from "./Dashboard";
import CouponGenerator from "./CouponGenerator";
import {
  FiGrid,
  FiBox,
  FiUsers,
  FiShoppingBag,
  FiTag,
  FiLogOut,
} from "react-icons/fi";

const Admin = ({ onLogout }) => {
  const [selectedSection, setSelectedSection] = useState("dashboard");

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  // const handleLogout = () => {
  //   // Clear admin token and redirect to login page
  //   localStorage.removeItem("admintoken");
  //   window.location.href = "/login"; // Redirect to login
  // };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      {/* Left Section: Navigation */}
      <div className="w-64 bg-gray-800 text-white flex flex-col border-r border-gray-700 shadow-xl fixed h-full z-10">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            {"<ddShop"}
            <span className="text-purple-500">{"/>"}</span>
          </h2>
          <span className="text-xs text-gray-400 uppercase tracking-widest mt-1 block">
            Admin Panel
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            <li>
              <button
                className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 transition-colors ${
                  selectedSection === "dashboard"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => handleSectionChange("dashboard")}
              >
                <FiGrid size={20} />
                <span className="font-medium">Dashboard</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 transition-colors ${
                  selectedSection === "product-management"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => handleSectionChange("product-management")}
              >
                <FiBox size={20} />
                <span className="font-medium">Products</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 transition-colors ${
                  selectedSection === "user-management"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => handleSectionChange("user-management")}
              >
                <FiUsers size={20} />
                <span className="font-medium">Users</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 transition-colors ${
                  selectedSection === "order-management"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => handleSectionChange("order-management")}
              >
                <FiShoppingBag size={20} />
                <span className="font-medium">Orders</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 transition-colors ${
                  selectedSection === "generate-coupon"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => handleSectionChange("generate-coupon")}
              >
                <FiTag size={20} />
                <span className="font-medium">Coupons</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            className="w-full py-2 px-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg flex items-center justify-center gap-2 transition-colors border border-red-600/20 hover:border-red-600"
            onClick={onLogout}
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Right Section: Content based on selected option */}
      <div className="flex-1 p-8 ml-64 bg-gray-900 min-h-screen">
        {selectedSection === "dashboard" && <Dashboard />}
        {selectedSection === "product-management" && <ProductManagement />}
        {selectedSection === "user-management" && <UserManagement />}
        {selectedSection === "order-management" && <OrderManagement />}
        {selectedSection === "generate-coupon" && <CouponGenerator />}
      </div>
    </div>
  );
};

export default Admin;
