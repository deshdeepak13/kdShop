import React, { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react"; // Icons from lucide-react
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from "axios"; // For making API requests
import { useSelector, useDispatch } from "react-redux";

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]); // State to hold fetched coupons
  const [copiedCode, setCopiedCode] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { token, user, isLoggedIn } = useSelector((state) => state.auth);

  // Fetch coupons from the backend API
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/coupon",{ headers: { Authorization: `Bearer ${token}` } }); // Replace with your actual API endpoint
        setCoupons(response.data.coupons); // Assuming the response has a `coupons` array
        setLoading(false);
      } catch (err) {
        console.error(err); 
        setError("Failed to fetch coupons. Please try again later.");
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // Handle copying coupon codes
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000); // Reset after 2 seconds
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-purple-500 to-purple-900 text-white">
        <p>Loading coupons...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-purple-500 to-purple-900 text-white">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-500 to-purple-900 p-6">
      <div className="max-w-2xl mx-auto text-white">
        <h1 className="text-3xl font-bold text-center mb-8">Available Coupons</h1>
        <div className="grid gap-6">
          {coupons.map((coupon, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white text-gray-800 rounded-2xl shadow-md p-4 hover:shadow-xl transition-shadow"
            >
              <div>
                <h2 className="text-lg font-semibold">{coupon.description}</h2>
                <p className="text-sm text-gray-500">Code: {coupon.couponCode}</p>
              </div>
              <div>
                <button
                  onClick={() => handleCopy(coupon.couponCode)}
                  className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 focus:ring focus:ring-purple-300"
                  data-tip={copiedCode === coupon.couponCode ? "Copied!" : "Copy Code"} // Tooltip data
                >
                  {copiedCode === coupon.couponCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  <span>{copiedCode === coupon.couponCode ? "Copied" : "Copy"}</span>
                </button>
                <ReactTooltip />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouponsPage;
