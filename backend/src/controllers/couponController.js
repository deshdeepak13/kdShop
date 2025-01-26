import Coupon from '../models/couponSchema.js';

// Validate a coupon
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
