import React, { useState } from "react";
import { Check, Copy } from "lucide-react"; // Icons from lucide-react
// import {ReactTooltip} from 'react-tooltip'; // Import react-tooltip
import { Tooltip as ReactTooltip } from 'react-tooltip'
// import ReactTooltip from 'react-tooltip/dist/react-tooltip'; // Path to the module's correct location


const coupons = [
  { code: "WELCOME10", description: "Get 10% off on your first order!" },
  { code: "FREESHIP", description: "Enjoy free shipping on orders above $50." },
  { code: "SALE20", description: "Flat 20% off on all sale items." },
  { code: "HOLIDAY50", description: "Up to 50% off this holiday season!" },
];

const CouponsPage = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000); // Reset after 2 seconds
  };

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
                <p className="text-sm text-gray-500">Code: {coupon.code}</p>
              </div>
              <div>
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 focus:ring focus:ring-purple-300"
                  data-tip={copiedCode === coupon.code ? "Copied!" : "Copy Code"} // Tooltip data
                >
                  {copiedCode === coupon.code ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  <span>{copiedCode === coupon.code ? "Copied" : "Copy"}</span>
                </button>
                {/* ReactTooltip will show on hover */}
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
