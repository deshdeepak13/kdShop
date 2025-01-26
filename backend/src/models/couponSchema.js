// models/Coupon.js

import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  couponCode: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  isValid: { type: Boolean, default: true },
  expiryDate: { type: Date, required: true },
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
