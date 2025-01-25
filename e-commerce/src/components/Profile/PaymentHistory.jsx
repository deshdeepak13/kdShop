import React, { useState, useEffect } from "react";
import axios from "axios"; // You can use axios or fetch for API calls
import { useSelector } from "react-redux";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useSelector((state) => state.auth); // User data from Redux store
  const [expandedPaymentId, setExpandedPaymentId] = useState(null); // Track expanded payment

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token in the Authorization header
            },
          }
        );
        setPayments(response.data);
        // console.log(response.data);
      } catch (err) {
        setError("Failed to fetch transaction history.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user.id, token]);

  const handleToggleExpand = (paymentId) => {
    if (expandedPaymentId === paymentId) {
      setExpandedPaymentId(null); // Close if already expanded
    } else {
      setExpandedPaymentId(paymentId); // Expand the clicked payment
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500"; // Yellow for pending
      case "failed":
        return "text-red-500"; // Red for failed
      case "success":
        return "text-green-600"; // Green for success
      case "processing":
        return "text-blue-500"; // Blue for processing
      case "shipped":
        return "text-indigo-500"; // Indigo for shipped
      case "delivered":
        return "text-teal-500"; // Teal for delivered
      case "canceled":
        return "text-gray-500"; // Gray for canceled
      default:
        return "text-black"; // Default color
    }
  };

  if (loading) {
    return <div className="text-center text-white p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-6">{error}</div>;
  }

  return (
    <div className="p-6 mx-auto text-white">
      <h2 className="text-2xl font-semibold mb-6">Payment History</h2>
      <div className="space-y-4">
        {payments.map((payment) => (
          <div
            key={payment._id}
            className="flex flex-col p-4 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">
                Order #{payment._id}
              </span>
              <span className="text-sm text-gray-400">
                {new Date(payment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-green-400">
                ₹{payment.totalPrice}
              </span>
              <button
                className="px-4 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
                onClick={() => handleToggleExpand(payment._id)} // Toggle expand/collapse
              >
                {expandedPaymentId === payment._id ? "Hide Details" : "View Details"}
              </button>
            </div>

            {/* Payment Details Section (only visible when expanded) */}
            {expandedPaymentId === payment._id && (
              <div className="mt-4 p-4 bg-gray-600 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Payment Method:</span>
                  <span>{payment.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Payment Status:</span>
                  <span className={`${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;
