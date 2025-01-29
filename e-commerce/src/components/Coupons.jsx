import React, { useState, useEffect } from "react";
import { Check, Copy,Sparkles } from "lucide-react"; // Icons from lucide-react
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from "axios";
import { useSelector } from "react-redux";
import { useSnackbar } from "./SnackbarProvider";
import { motion } from "framer-motion";

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const showSnackbar = useSnackbar();

  // Fetch coupons from the backend API
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/coupon", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoupons(response.data.coupons);
        setLoading(false);
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
    showSnackbar({ message: `${code} copied to clipboard`, type: "success" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading coupons...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-500 rounded-full"
            animate={{
              x: [0, 1000, 0],
              y: Math.random() * 1000,
              scale: [0.5, 2, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h1 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_5px_5px_rgba(255,255,255,0.25)]">
          🔥 HOT COUPONS 🔥
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {coupons.map((coupon, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotate: Math.random() * 10 - 5 }}
              className="relative bg-gradient-to-br from-purple-600/30 to-cyan-400/30 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10 hover:border-cyan-400/50 transition-all group">
              
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity bg-[conic-gradient(from_90deg_at_50%_50%,#F472B6_0%,#60A5FA_50%,#F472B6_100%)] animate-spin [animation-duration:5s]" />
              
              <div className="relative space-y-6">
                <div className="flex justify-between items-start">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                    {coupon.discountPercentage}% OFF
                  </motion.div>
                  <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
                </div>

                <p className="text-gray-200 text-lg leading-relaxed font-medium">
                  {coupon.description}
                </p>

                <div className="space-y-4">
                  <div className="text-sm font-bold text-cyan-300">
                    VALID UNTIL: {new Date(coupon.expiryDate).toLocaleDateString('en-GB')}
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 bg-cyan-400/10 blur-xl" />
                    <div className="relative bg-black/40 px-6 py-4 rounded-xl border border-cyan-400/30">
                      <code className="font-mono text-2xl tracking-widest text-cyan-400">
                        {coupon.couponCode}
                      </code>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopy(coupon.couponCode)}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-4 rounded-xl font-bold text-white hover:shadow-[0_0_25px_-5px_rgba(96,165,250,0.5)] transition-all">
                  {copiedCode === coupon.couponCode ? (
                    <Check className="w-6 h-6 text-green-400" />
                  ) : (
                    <Copy className="w-6 h-6" />
                  )}
                  <span className="text-xl">
                    {copiedCode === coupon.couponCode ? "COPIED!" : "GRAB CODE"}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ReactTooltip 
        effect="solid"
        place="top"
        className="!bg-black/80 !backdrop-blur-lg !border !border-white/10 !rounded-xl !text-lg !px-3 !py-2"
      />
    </div>
  );
};

export default CouponsPage;