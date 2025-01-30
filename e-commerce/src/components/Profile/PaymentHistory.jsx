import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FiAlertCircle, FiCheckCircle, FiXCircle, FiClock, FiInfo } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const [expandedPaymentId, setExpandedPaymentId] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/v1/user/transactions", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(data);
      } catch (err) {
        setError("Failed to load payment history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [token]);

  const getStatusDetails = (status) => {
    const statusConfig = {
      pending: { color: "text-yellow-500", icon: <FiClock />, label: "Pending" },
      failed: { color: "text-red-500", icon: <FiXCircle />, label: "Failed" },
      success: { color: "text-green-600", icon: <FiCheckCircle />, label: "Success" },
      processing: { color: "text-blue-500", icon: <FiInfo />, label: "Processing" },
      shipped: { color: "text-indigo-500", icon: <FiInfo />, label: "Shipped" },
      delivered: { color: "text-teal-500", icon: <FiCheckCircle />, label: "Delivered" },
      canceled: { color: "text-gray-500", icon: <FiXCircle />, label: "Canceled" }
    };
    return statusConfig[status] || { color: "text-gray-400", icon: <FiInfo />, label: "Unknown" };
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-900/20 rounded-xl text-red-400 flex items-center gap-3">
        <FiAlertCircle className="flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Payment History</h2>
      
      <div className="space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-800 rounded-xl">
              <Skeleton height={80} baseColor="#1f2937" highlightColor="#374151" />
            </div>
          ))
        ) : payments.length === 0 ? (
          <div className="p-6 bg-gray-800 rounded-xl text-gray-400 text-center">
            No payment history found
          </div>
        ) : (
          payments.map((payment) => (
            <div
              key={payment._id}
              className="bg-gray-800 rounded-xl p-4 shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-gray-400">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                      #{payment._id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-semibold text-green-400">
                      ₹{payment.totalPrice}
                    </span>
                    <div className={`flex items-center gap-1 ${getStatusDetails(payment.status).color}`}>
                      {getStatusDetails(payment.status).icon}
                      <span className="text-sm">{getStatusDetails(payment.status).label}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedPaymentId(p => p === payment._id ? null : payment._id)}
                  className="w-full md:w-auto px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiInfo />
                  {expandedPaymentId === payment._id ? "Less Details" : "More Details"}
                </button>
              </div>

              {expandedPaymentId === payment._id && (
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                  <DetailItem label="Payment Method" value={payment.paymentMethod} />
                  <DetailItem label="Transaction ID" value={payment.transactionId || "N/A"} />
                  <DetailItem label="Items" value={payment.items?.length || 0} />
                  <DetailItem 
                    label="Payment Status" 
                    value={
                      <span className={getStatusDetails(payment.status).color}>
                        {getStatusDetails(payment.status).label}
                      </span>
                    } 
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row justify-between gap-2 p-3 bg-gray-700/30 rounded-lg">
    <span className="text-sm text-gray-400">{label}</span>
    <span className="text-sm text-white font-medium">{value}</span>
  </div>
);

export default PaymentHistory;