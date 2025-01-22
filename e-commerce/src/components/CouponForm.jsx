import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { applyCouponToCart } from '../redux/cartSlice';

const CouponForm = () => {
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    if (couponCode) {
      dispatch(applyCouponToCart('userTokenHere', 'userIdHere', couponCode));
    }
  };

  return (
    <div>
      <input
        type="text"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        placeholder="Enter coupon code"
      />
      <button onClick={handleApplyCoupon}>Apply Coupon</button>
    </div>
  );
};

export default CouponForm;
