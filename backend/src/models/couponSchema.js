// models/Coupon.js

import mongoose from 'mongoose';

/**
 * Schema for Discount Coupons.
 * @typedef {Object} Coupon
 * @property {string} couponCode - The unique code for the coupon.
 * @property {number} discountPercentage - The percentage discount offered.
 * @property {boolean} isValid - Whether the coupon is currently valid.
 * @property {Date} expiryDate - The expiration date of the coupon.
 */
const couponSchema = new mongoose.Schema({
  couponCode: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  isValid: { type: Boolean, default: true },
  expiryDate: { type: Date, required: true },
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
