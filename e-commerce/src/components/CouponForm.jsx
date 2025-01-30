import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyCouponToCart, removeCouponFromCart } from '../redux/cartSlice';
import { useSnackbar } from './SnackbarProvider';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiTag,FiInfo } from 'react-icons/fi';

const CouponForm = ({ disabled }) => {
  const showSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const { coupon, couponError } = useSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState('');
  const { token, user } = useSelector((state) => state.auth);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      dispatch(applyCouponToCart(token, user.id, couponCode.trim(), showSnackbar));
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCouponFromCart(showSnackbar));
    setCouponCode('');
  };

  return (
    <div className="space-y-3 w-full">
      <form onSubmit={handleApplyCoupon} className="space-y-2">
        <div className="flex flex-col md:flex-row gap-2 w-full">
          <div className="relative flex-grow">
            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="w-full pl-10 pr-3 py-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-all"
              disabled={disabled || !!coupon}
              aria-label="Coupon code"
            />
          </div>
          <div className="flex gap-2 md:w-auto w-full">
            <button
              type="submit"
              className="w-full md:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              disabled={disabled || !couponCode.trim() || !!coupon}
            >
              <FiCheckCircle className="flex-shrink-0" />
              <span>Apply</span>
            </button>
            {coupon && (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FiXCircle className="flex-shrink-0" />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-400 flex items-center gap-1">
          <FiInfo className="flex-shrink-0" />
          Coupons are case-sensitive. Enter exactly as received.
        </p>
      </form>

      {coupon && (
        <div className="p-3 bg-green-900/50 border border-green-800 rounded-lg flex items-center gap-2 text-green-400">
          <FiCheckCircle className="flex-shrink-0" />
          <span>Coupon <strong>{coupon}</strong> applied successfully!</span>
        </div>
      )}

      {couponError && (
        <div className="p-3 bg-red-900/50 border border-red-800 rounded-lg flex items-center gap-2 text-red-400">
          <FiAlertCircle className="flex-shrink-0" />
          <span>{couponError}</span>
        </div>
      )}
    </div>
  );
};

export default CouponForm;