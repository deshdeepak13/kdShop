import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyCouponToCart, removeCoupon } from '../redux/cartSlice';
// import { useSelector, useDispatch } from "react-redux";

const CouponForm = ({ disabled }) => {
  const dispatch = useDispatch();
  const { coupon, couponError } = useSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState('');
  const { token, user, isLoggedIn } = useSelector((state) => state.auth);

  const handleApplyCoupon = () => {
    if (couponCode) {
      dispatch(applyCouponToCart(token, user.id, couponCode)); // Pass token and userId if needed
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponCode('');
  };

  return (
    <div className="space-y-4">
      <div className="flex">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          className="p-2 bg-gray-700 text-white rounded-lg flex-grow"
          disabled={disabled || coupon}
        />
        <button
          onClick={handleApplyCoupon}
          className="ml-2 p-2 bg-blue-600 text-white rounded-lg"
          disabled={disabled || couponCode === '' || coupon}
        >
          Apply Coupon
        </button>
      </div>

      {coupon && (
        <div className="mt-2 text-green-400">
          <p>Coupon Applied: {coupon}</p>
          <button
            onClick={handleRemoveCoupon}
            className="text-sm text-red-500 hover:underline"
          >
            Remove Coupon
          </button>
        </div>
      )}

      {couponError && (
        <p className="text-red-500 text-sm">{couponError}</p>
      )}
    </div>
  );
};

export default CouponForm;
