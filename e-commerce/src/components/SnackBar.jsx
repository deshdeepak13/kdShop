import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiX,
  FiShoppingCart,
  FiHeart,
  FiTrash,
  FiCreditCard,
  FiUser,
  FiSmile,
} from "react-icons/fi";

const Snackbar = ({
  type = "success",
  message = "This is a notification!",
  duration = 5000,
  position = "top-right",
  onClose,
}) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setVisible(true);
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - 100 / (duration / 50), 0));
    }, 50);

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const typeStyles = {
    success: {
      bg: "bg-gradient-to-r from-green-600 to-green-700",
      icon: <FiCheckCircle className="w-5 h-5" />,
    },
    error: {
      bg: "bg-gradient-to-r from-red-600 to-red-700",
      icon: <FiAlertCircle className="w-5 h-5" />,
    },
    alert: {
      bg: "bg-gradient-to-r from-yellow-600 to-yellow-700",
      icon: <FiAlertCircle className="w-5 h-5" />,
    },
    notify: {
      bg: "bg-gradient-to-r from-blue-600 to-blue-700",
      icon: <FiInfo className="w-5 h-5" />,
    },
    "added-to-cart": {
      bg: "bg-gradient-to-r from-purple-600 to-purple-700",
      icon: <FiShoppingCart className="w-5 h-5" />,
    },
    "added-to-wishlist": {
      bg: "bg-gradient-to-r from-pink-600 to-pink-700",
      icon: <FiHeart className="w-5 h-5" />,
    },
    deleted: {
      bg: "bg-gradient-to-r from-gray-700 to-gray-800",
      icon: <FiTrash className="w-5 h-5" />,
    },
    "payment-successful": {
      bg: "bg-gradient-to-r from-teal-600 to-teal-700",
      icon: <FiCreditCard className="w-5 h-5" />,
    },
    celebration: {
      bg: "bg-gradient-to-r from-orange-600 to-orange-700",
      icon: <FiSmile className="w-5 h-5 animate-pulse" />,
    },
    login: {
      bg: "bg-gradient-to-r from-green-700 to-green-800",
      icon: <FiUser className="w-5 h-5" />,
    },
    logout: {
      bg: "bg-gradient-to-r from-red-700 to-red-800",
      icon: <FiUser className="w-5 h-5" />,
    },
  };

  const positionStyles = {
    "top-right": "top-6 right-6 animate-slide-in-right",
    "top-left": "top-6 left-6 animate-slide-in-left",
    "bottom-right": "bottom-6 right-6 animate-slide-in-right",
    "bottom-left": "bottom-6 left-6 animate-slide-in-left",
    "top-center": "top-6 left-1/2 -translate-x-1/2 animate-slide-in-top",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2 animate-slide-in-bottom",
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed z-50 ${positionStyles[position]} ${
        visible ? "visible" : "invisible opacity-0 scale-95"
      } transition-all duration-300 ease-out`}
    >
      <div
        className={`${typeStyles[type].bg} rounded-xl shadow-2xl p-4 min-w-[280px] max-w-[90vw] relative overflow-hidden`}
      >
        {/* Progress Bar */}
        <div
          className="absolute top-0 left-0 h-1 bg-white/20 transition-all duration-50 ease-linear"
          style={{ width: `${progress}%` }}
        />

        <div className="flex items-start gap-3">
          <div className="shrink-0 pt-0.5">{typeStyles[type].icon}</div>
          
          <div className="flex-1 text-white">
            <p className="text-sm font-medium leading-tight pr-6">{message}</p>
          </div>

          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close notification"
          >
            <FiX className="w-4 h-4 text-white/80" />
          </button>
        </div>
      </div>
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