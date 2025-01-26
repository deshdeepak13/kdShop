import React, { useState } from "react";
import ProductManagement from "./ProductManagement";
import UserManagement from "./UserManagement";
import OrderManagement from "./OrderManagement";
import Dashboard from "./Dashboard";
import CouponGenerator from "./CouponGenerator";

const Admin = ({onLogout}) => {
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
      <div className="w-1/5 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-semibold mb-6 text-white">{"<ddShop"}<span className="text-purple-600">{"/>"}</span>          
        </h2>
        <h3 className="text-lg font-semibold mb-2 ">ADMIN PANEL</h3>
        <ul>
          <li>
            <button
              className={`w-full text-left py-2 px-4 hover:bg-gray-700 rounded ${
                selectedSection === "dashboard" ? "bg-gray-700" : ""
              }`}
              onClick={() => handleSectionChange("dashboard")}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left py-2 px-4 hover:bg-gray-700 rounded ${
                selectedSection === "product-management" ? "bg-gray-700" : ""
              }`}
              onClick={() => handleSectionChange("product-management")}
            >
              Product Management
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left py-2 px-4 hover:bg-gray-700 rounded ${
                selectedSection === "user-management" ? "bg-gray-700" : ""
              }`}
              onClick={() => handleSectionChange("user-management")}
            >
              User Management
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left py-2 px-4 hover:bg-gray-700 rounded ${
                selectedSection === "order-management" ? "bg-gray-700" : ""
              }`}
              onClick={() => handleSectionChange("order-management")}
            >
              Order Management
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left py-2 px-4 hover:bg-gray-700 rounded ${
                selectedSection === "order-management" ? "bg-gray-700" : ""
              }`}
              onClick={() => handleSectionChange("generate-coupon")}
            >
              Generate Coupon
            </button>
          </li>
        </ul>

        {/* Logout Button */}
        <button
          className=" mt-6 py-2 px-4 bg-red-600 hover:bg-red-700 rounded text-white text-left"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {/* Right Section: Content based on selected option */}
      <div className="flex-1 p-6">
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
