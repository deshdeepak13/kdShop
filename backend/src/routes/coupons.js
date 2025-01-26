// routes/couponRoutes.js

import express from 'express';
import { validateCoupon, getCoupons, addCoupon } from '../controllers/couponController.js';
import verifyTokenMiddleware from '../middlewares/verifyTokenMiddleware.js';

const router = express.Router();

// Validate coupon
router.post('/validate', verifyTokenMiddleware, validateCoupon);

// Get all coupons
router.get('/', verifyTokenMiddleware, getCoupons);

// Add a new coupon
router.post('/add', verifyTokenMiddleware, addCoupon);

export default router;
