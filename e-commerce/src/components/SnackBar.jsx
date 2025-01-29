import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiXCircle,
  FiShoppingCart,
  FiHeart,
  FiTrash,
  FiCreditCard,
  FiUser,
  FiSmile,
} from "react-icons/fi";

const Snackbar = ({
  type = "success", // success, error, alert, notify, added-to-cart, added-to-wishlist, deleted, payment-successful, celebration, login, logout
  message = "This is a notification!",
  duration = 5000,
  position = "top-right", // top-left, top-right, bottom-left, bottom-right, bottom-center, top-center
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: {
      bg: "bg-green-500",
      text: "text-white",
      icon: <FiCheckCircle className="w-6 h-6 text-white" />,
    },
    error: {
      bg: "bg-red-500",
      text: "text-white",
      icon: <FiXCircle className="w-6 h-6 text-white" />,
    },
    alert: {
      bg: "bg-yellow-500",
      text: "text-black",
      icon: <FiAlertCircle className="w-6 h-6 text-black" />,
    },
    notify: {
      bg: "bg-blue-500",
      text: "text-white",
      icon: <FiInfo className="w-6 h-6 text-white" />,
    },
    "added-to-cart": {
      bg: "bg-purple-500",
      text: "text-white",
      icon: <FiShoppingCart className="w-6 h-6 text-white" />,
    },
    "added-to-wishlist": {
      bg: "bg-pink-500",
      text: "text-white",
      icon: <FiHeart className="w-6 h-6 text-white" />,
    },
    deleted: {
      bg: "bg-gray-700",
      text: "text-white",
      icon: <FiTrash className="w-6 h-6 text-white" />,
    },
    "payment-successful": {
      bg: "bg-teal-500",
      text: "text-white",
      icon: <FiCreditCard className="w-6 h-6 text-white" />,
    },
    celebration: {
      bg: "bg-orange-500",
      text: "text-white",
      icon: <FiSmile className="w-6 h-6 text-white animate-bounce" />,
    },
    login: {
      bg: "bg-green-700",
      text: "text-white",
      icon: <FiUser className="w-6 h-6 text-white" />,
    },
    logout: {
      bg: "bg-red-700",
      text: "text-white",
      icon: <FiUser className="w-6 h-6 text-white" />,
    },
  };

  const positionStyles = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-500 ease-in-out transform ${
        visible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-[-50%] opacity-0 scale-95"
      } ${positionStyles[position]} ${typeStyles[type].bg} px-8 py-5 rounded-lg shadow-lg flex items-center space-x-4`}
      style={{ minWidth: "320px", maxWidth: "420px" }}
    >
      {/* Icon */}
      <div>{typeStyles[type].icon}</div>

      {/* Message */}
      <div className={`flex-1 font-semibold ${typeStyles[type].text} text-lg`}>
        {message}
      </div>

      {/* Close Button */}
      <button
        className="text-white text-lg font-bold"
        onClick={() => {
          setVisible(false);
          onClose && onClose();
        }}
      >
        ✕
      </button>
    </div>
  );
};

Snackbar.propTypes = {
  type: PropTypes.oneOf([
    "success",
    "error",
    "alert",
    "notify",
    "added-to-cart",
    "added-to-wishlist",
    "deleted",
    "payment-successful",
    "celebration",
    "login",
    "logout",
  ]),
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
  position: PropTypes.oneOf([
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left",
    "top-center",
    "bottom-center",
  ]),
  onClose: PropTypes.func,
};

export default Snackbar;
