import Coupon from '../models/couponSchema.js';

// Validate a coupon
/**
 * Validates a coupon code.
 * 
 * @async
 * @function validateCoupon
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.couponCode - The coupon code to validate
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response indicating validity and discount details.
 */
export const validateCoupon = async (req, res) => {
  const { couponCode } = req.body;
//   console.log("fk u")

  try {
    const coupon = await Coupon.findOne({ couponCode });
    

    if (!coupon) {
        
      return res.status(400).json({ isValid: false, message: 'Coupon not found' });
      
    }

    if (!coupon.isValid) {
        // console.log(coupon)
      return res.status(400).json({ isValid: false, message: 'Coupon is no longer active' });
    }

    if (!coupon.expiryDate && coupon.expiryDate < new Date()) {
      return res.status(400).json({ isValid: false, message: 'Coupon has expired' });
    }

    return res.status(200).json({
      isValid: true,
      couponCode: coupon.couponCode,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ isValid: false, message: 'Server error' });
  }
};

// Get all coupons
/**
 * Retrieves all coupons.
 * 
 * @async
 * @function getCoupons
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response containing a list of all coupons.
 */
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find(); // Retrieve all coupons
    return res.status(200).json({ success: true, coupons });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
};

// Add a new coupon
/**
 * Adds a new coupon.
 * 
 * @async
 * @function addCoupon
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.couponCode - The code for the new coupon
 * @param {number} req.body.discount - Discount percentage
 * @param {Date} req.body.expiryDate - Expiration date of the coupon
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response confirming creation or reporting error.
 */
export const addCoupon = async (req, res) => {
  const { couponCode, discount, expiryDate } = req.body;
  
//   if(!discountPercentage)console.log(discountPercentage);

  if (!couponCode || !discount || !expiryDate) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const existingCoupon = await Coupon.findOne({ couponCode });

    if (existingCoupon) {
      return res.status(400).json({ success: false, message: 'Coupon already exists' });
    }

    const newCoupon = new Coupon({
      couponCode,
      discountPercentage:discount,
      expiryDate,
      isActive: true,
    });

    await newCoupon.save();
    return res.status(201).json({ success: true, message: 'Coupon added successfully', coupon: newCoupon });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to add coupon' });
  }
};
