import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import adminTokenMiddleware from '../middlewares/adminTokenMiddleware.js'
import User from "../models/userSchema.js"; // Replace with the correct path to your User model
import Product from '../models/productSchema.js';  // Your Product schema
import Order from '../models/orderSchema.js';  // Your Order schema
import multer from 'multer';
import path from 'path';
import fs from 'fs';


const router = express.Router();

// POST request to login an admin
router.post(
  "/login",
  [
    // Validation middleware
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Find the admin by email
      const admin = await User.findOne({ email, role: "admin" }).select("+password");
      if (!admin) {
        return res.status(403).json({ message: "Invalid email or password", success: false });
      }

      // Compare provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(403).json({ message: "Invalid email or password", success: false });
      }

      // Generate JWT token
      const jwtToken = jwt.sign(
        { email: admin.email, name: admin.name, id: admin._id,role:"admin" },
        "secret-123", // Replace with your secret key
        { expiresIn: "24h" }
      );

      // Respond with success and token
      res.status(200).json({
        message: "Admin login successful",
        success: true,
        jwtToken,
        adminDetails: {
          email: admin.email,
          name: admin.name,
          id: admin._id,
          role: "admin",
        },
      });
    } catch (error) {
      // Handle server errors
      console.error("Error during admin login:", error);
      res.status(500).json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
    }
  }
);



// Get all users
router.get('/users', adminTokenMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Delete user by ID
router.delete('/users/:id', adminTokenMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    // console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin user' });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});



router.get('/dashboard',adminTokenMiddleware, async (req, res) => {
  try {
    // Total Products 
    const totalProducts = await Product.countDocuments();

    // Total Users
    const totalUsers = await User.countDocuments();

    // Total Orders
    const totalOrders = await Order.countDocuments();

    // Total Products Ordered Count
    const totalProductsOrderedCount = await Order.aggregate([
      { $unwind: '$orderItems' }, // Assuming products is an array of ordered items
      {
        $group: {
          _id: null,
          totalCount: { $sum: '$orderItems.quantity' },
        },  
      },
    ]);

    // Total Revenue
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' }, // Assuming totalPrice is a field in the Order schema
        },
      },
    ]);

    // Average Order Value
    const avgOrderValue =
      totalOrders > 0 ? totalRevenue[0]?.totalRevenue / totalOrders : 0;

    // Average Product Value
    const avgProductValue =
      totalProductsOrderedCount.length > 0
        ? totalRevenue[0]?.totalRevenue / totalProductsOrderedCount[0]?.totalCount
        : 0;

    // Average Products per Checkout
    const avgProductperCheckout =
      totalOrders > 0
        ? totalProductsOrderedCount[0]?.totalCount / totalOrders
        : 0;

    // Orders by Category Data (for Bar Chart)
    const ordersByCategory = await Order.aggregate([
      { $unwind: '$products' },
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.category', // Assuming 'category' is a field in Product
          totalOrders: { $sum: '$products.quantity' },
        },
      },
      { $sort: { totalOrders: -1 } },
    ]);

    const ordersByCategoryData = {
      labels: ordersByCategory.map((cat) => cat._id),
      datasets: [
        {
          label: 'Orders by Category',
          data: ordersByCategory.map((cat) => cat.totalOrders),
          backgroundColor: ['#f97316', '#22c55e', '#3b82f6', '#ef4444'], // Custom colors
        },
      ],
    };

    // Revenue Over Time Data (for Line Chart)
    const revenueOverTime = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' }, // Assuming createdAt is the timestamp
            month: { $month: '$createdAt' },
          },
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const revenueOverTimeData = {
      labels: revenueOverTime.map(
        (item) => `${item._id.month}-${item._id.year}`
      ),
      datasets: [
        {
          label: 'Revenue Over Time',
          data: revenueOverTime.map((item) => item.totalRevenue),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
        },
      ],
    };

    // User Growth Data (for Line Chart)
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalUsers: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const userGrowthData = {
      labels: userGrowth.map((item) => `${item._id.month}-${item._id.year}`),
      datasets: [
        {
          label: 'User Growth',
          data: userGrowth.map((item) => item.totalUsers),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
        },
      ],
    };

    

    // Final Response
    res.status(200).json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalProductsOrderedCount: totalProductsOrderedCount[0]?.totalCount || 0,
      totalRevenue: totalRevenue[0]?.totalRevenue || 0,
      avgOrderValue: avgOrderValue.toFixed(2),
      avgProductValue: avgProductValue.toFixed(2),
      avgProductperCheckout: avgProductperCheckout.toFixed(2),
      ordersByCategoryData,
      revenueOverTimeData,
      userGrowthData,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});






// Setup for multer file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/images';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


// Get all products for admin
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Create a new product
router.post('/products', upload.array('images'), async (req, res) => {
  const { name, description, MRP, discount, stock, category } = req.body;
  const images = req.files.map((file) => file.filename);

  if (!name || !description || !MRP || !discount || !stock || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      MRP,
      discount,
      stock,
      category,
      imageUrl: images,
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product' });
  }
});

// Update a product
router.put('/product/:id', upload.array('images'), async (req, res) => {
  const { name, description, MRP, discount, stock, category } = req.body;
  const images = req.files ? req.files.map((file) => file.filename) : []; // Safely access req.files

  if (!name || !description || !MRP || !discount || !stock || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        MRP,
        discount,
        stock,
        category,
        imageUrl: images.length > 0 ? images : undefined,   
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// Delete a product
router.delete('/product/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    // console.log(product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// Fetch all orders (Admin only)
router.get('/orders', adminTokenMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')  // Explicitly mention the fields to populate
      .exec(); // Ensures the population is properly executed
      // console.log(orders);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});


// Update order status (Admin only)
router.put('/order/:id', adminTokenMiddleware, async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'processing', 'shipped', 'delivered', 'canceled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
});









export default router;



