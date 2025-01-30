import React, { useState } from "react";
import axios from "axios";

const CouponGenerator = () => {
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Generate a random coupon code
  const generateRandomCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setCouponCode(randomCode);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!couponCode || !discount || !expiryDate) {
      setMessage({ type: "error", text: "All fields are required!" });
      return;
    }
    if (discount < 0 || discount > 100) {
      setMessage({ type: "error", text: "Discount must be between 0 and 100!" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/coupon/add`,
        {
          couponCode,
          discount: parseFloat(discount),
          expiryDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`, // Replace with actual token
          },
        }
      );

      if (response.status === 201) {
        setMessage({ type: "success", text: "Coupon created successfully!" });
        setCouponCode("");
        setDiscount("");
        setExpiryDate("");
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to create the coupon. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-800 text-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Generate Coupon</h2>

      {message && (
        <div
          className={`mb-4 p-2 rounded text-sm ${
            message.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Coupon Code */}
        <div>
          <label htmlFor="couponCode" className="block text-sm font-medium">
            Coupon Code
          </label>
          <div className="flex">
            <input
              type="text"
              id="couponCode"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter or generate a code"
              className="border rounded-l w-full p-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={generateRandomCode}
              className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Discount */}
        <div>
          <label htmlFor="discount" className="block text-sm font-medium">
            Discount Percentage
          </label>
          <input
            type="number"
            id="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Enter discount (e.g., 10 for 10%)"
            className="border rounded w-full p-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium">
            Expiry Date
          </label>
          <input
            type="date"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="border rounded w-full p-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-bold rounded ${
            loading ? "bg-gray-600" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Generating..." : "Create Coupon"}
        </button>
      </form>
    </div>
  );
};

export default CouponGenerator;
