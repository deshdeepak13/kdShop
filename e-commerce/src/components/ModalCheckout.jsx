import React, { useState } from "react";
import { useSelector } from "react-redux";
import PaymentModal from "./PaymentForm"; // Stripe payment form component

const Modal = ({ onClose, address }) => {
  const [isPayment, setIsPayment] = useState(false); // Tracks whether to show payment form
  const { cartItems } = useSelector((state) => state.cart);
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.product?.currentPrice * item.quantity,
    0
  );

  // Render order summary or payment gateway
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 ">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-11/12 sm:w-1/2 md:w-1/3">
        {!isPayment ? (
          // Order Summary View
          <>
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4 bg-gray-800">
              {cartItems.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center justify-between bg-gray-800"
                >
                  <img
                    src={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/public/images/${
                      item.product.imageUrl?.[0] || "default-product.jpg"
                    }`} //product.imageUrl
                    alt={item.product.name}
                    className="w-16 h-16 object-contain rounded"
                  />
                  <span className="text-lg">{item.product.name} x {item.quantity}</span>
                  <span className="text-lg">₹{item.product.currentPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 ">
              <p className="text-lg font-semibold flex justify-between">
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </p>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
              <button
                onClick={() => setIsPayment(true)} // Switch to payment view
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Pay Now
              </button>
            </div>
          </>
        ) : (
          // Payment Gateway View
          <PaymentModal totalAmount={totalAmount} onClose={onClose} address={address} />
        )}
      </div>
    </div>
  );
};

export default Modal;
