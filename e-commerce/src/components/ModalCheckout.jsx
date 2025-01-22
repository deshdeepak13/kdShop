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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        {!isPayment ? (
          // Order Summary View
          <>
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center justify-between"
                >
                  <img
                    src={`http://localhost:3000/public/images/${
                      item.product.imageUrl?.[0] || "default-product.jpg"
                    }`} //product.imageUrl
                    alt={item.product.name}
                    className="w-16 h-16 object-contain rounded"
                  />
                  <span className="text-lg">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="text-lg">
                    ₹{item.product.currentPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-lg font-semibold flex justify-between">
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </p>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={onClose}
                className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
              >
                Close
              </button>
              <button
                onClick={() => setIsPayment(true)} // Switch to payment view
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Pay Now
                {console.log(address)}
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
