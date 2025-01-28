import React, { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react"; // Icons from lucide-react
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from "axios";
import { useSelector } from "react-redux";

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  // Fetch coupons from the backend API
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/coupon", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoupons(response.data.coupons);
        setLoading(false);
        console.log(response.data.coupons)
      } catch (err) {
        console.error(err);
        setError("Failed to fetch coupons. Please try again later.");
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [token]);

  // Handle copying coupon codes
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-500 to-gray-200 text-white">
        <p>Loading coupons...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-500 to-gray-200 text-white">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-500 to-gray-200 p-6">
      <div className="max-w-4xl mx-auto text-white">
        <h1 className="text-4xl font-bold text-center mb-8">Available Coupons</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {coupons.map((coupon, index) => (
            <div
              key={index}
              className="relative bg-white text-gray-800 rounded-3xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow border-l-8 border-purple-500"
            >
              <div>
                <h2 className="text-2xl font-bold text-purple-600 mb-2">
                  {coupon.discountPercentage}% OFF
                </h2>
                <p className="text-gray-600 mb-4">{coupon.description}</p>
                <div className="text-sm text-gray-500 mb-2">
                <strong>Validity:</strong> {new Date(coupon.expiryDate).toLocaleDateString('en-GB')}

                </div>
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-center font-mono tracking-wide text-lg">
                  {coupon.couponCode}
                </div>
              </div>

              <button
                onClick={() => handleCopy(coupon.couponCode)}
                className="mt-4 flex items-center justify-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 focus:ring focus:ring-purple-300 transition-all"
                data-tip={copiedCode === coupon.couponCode ? "Copied!" : "Copy Code"}
              >
                {copiedCode === coupon.couponCode ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
                <span>{copiedCode === coupon.couponCode ? "Copied" : "Copy"}</span>
              </button>
              <ReactTooltip />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouponsPage;
