import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/userSchema.js'; // Import the User model
import Order from '../models/orderSchema.js'; // Import the User model
// import Product from '../models/productSchema.js'; // Import the Product model
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import mongoose from 'mongoose';
import verifyTokenMiddleware from '../middlewares/verifyTokenMiddleware.js'; // Import the middleware

const router = express.Router();


// Configure multer for file uploads (e.g., photo)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file naming
  },
});

const upload = multer({ storage: storage });



// POST request to add a new user
// Signup route
router.post('/signup', upload.single('photo'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('email').isEmail().withMessage('Invalid email'),
  body('dob').isDate().withMessage('Invalid date of birth'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  // Handle validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Destructure the user data from the request body
    const { name, gender, email, dob, password } = req.body;
    const photo = req.file ? req.file.filename : "default.jpg"; 

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists, please login', success: false });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user using the User model
    const newUser = new User({
      name,
      gender,
      email,
      dob,
      photo,
      password: hashedPassword, // Save hashed password
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    const jwtToken = jwt.sign(
      { email: email,name:name,id: savedUser._id},
      "secret-123",
      { expiresIn: '24h' }
  )

    // Send a success response
    res.status(201).json({
      message: 'User created successfully',
      success: true,
      jwtToken,
      email: email,
      name: name,
      id: savedUser._id // Fixed this line
    });
  } catch (error) {
    // Send an error response
    res.status(500).json({
      message: 'Error creating User',
      error: error.message,
      success: false
    });
  }
});



// POST request to login a user
// Login route
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
  // Handle validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    const errorMsg = 'Auth failed, email or password is incorrect';
    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    // Create a JWT token
    const jwtToken = jwt.sign(
      { email: user.email,name:user.name, id: user._id},
      "secret-123",
      { expiresIn: '24h' }
    );

    // Send the response with the token and user details
    res.status(200).json({
      message: "Login successful",
      success: true,
      jwtToken,
      email: user.email,
      name: user.name,
      id: user._id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: err.message,
    });
  }
});

// export default router;


// route for token verification
router.post('/verifyToken', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'secret-123'); // Replace with your secret key
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
        // Include other user details as needed
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});







/**
 * @route   GET /api/v1/user/:id
 * @desc    Fetch user profile by ID
 * @access  Private
 */
router.get("/", verifyTokenMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user by ID
    const user = await User.findById(userId).select("-password"); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Respond with user data
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      dob: user.dob || null, // Optional field
      photo: user.photo || "default-profile.jpg", // Provide default image if none exists
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error." });
  }
});



// GET /api/v1/orders/transactions
// Fetch transactions for a specific user
router.get("/transactions", verifyTokenMiddleware, async (req, res) => {
  // console.log(req.user);
  // console.log(2);
  try {
    console.log("User ID in transaction-history route:", req.user?.id);
    const transactions = await Order.find({ user: req.user.id }) // Filter by the authenticated user
    .populate("orderItems.product", "name price image") // Populate product details
    .sort({ createdAt: -1 }); // Sort by latest orders
    
    res.status(200).json(transactions);
  } catch (error) {
    console.log("User ID in transaction-history route:", req.user?.id);
    // console.log(error)
    // console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Failed to fetch transactions." });
  }
});





// Route to get user's cart with product details  
router.get('/:userId/cart',verifyTokenMiddleware, async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Fetch the user from the database, including cartItems
      const user = await User.findById(userId).populate({
        path: 'cartItems.product',
        select: 'name description MRP discount stock imageUrl',
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Extract the cart items and format the response
      const cartDetails = user.cartItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
      }));
  
      res.json({ cart: cartDetails });
      // console.log({ cart: cartDetails });
    } catch (error) {
      console.error('Error fetching cart details:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });




// Add an item to the cart
router.post('/:userId/cart/add', verifyTokenMiddleware, async (req, res) => {
  const userId = req.user.id; // Extracted from verifyTokenMiddleware
  const { productId, quantity } = req.body;

  try {
    // Validate the product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check for existing product in cart
    const existingCartItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity; // Update quantity
    } else {
      user.cartItems.push({ product: productId, quantity });
    }

    // console.log("Updated cart items:", user.cartItems); // Debugging cart
    await user.save();

    res.status(200).json({
      message: 'Item added to cart successfully',
      cart: user.cartItems,
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart', error });
  }
});




// Update the quantity of an item in the cart
router.put('/:userId/cart/update', async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  try {
    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the product in the cart
    const cartItem = user.cartItems.find(item => item.product.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Update the quantity
    cartItem.quantity = quantity;

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Cart updated successfully', cart: user.cartItems });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Error updating cart' });
  }
});



// Remove an item from the cart
router.delete('/:userId/cart/remove/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out the product from the cart
    user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Item removed from cart', cart: user.cartItems });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
});


router.delete("/:userId/cart",verifyTokenMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    // Assuming you have a User model with a cart field
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(user);

    // Clear the cart
    user.cartItems = [];
    await user.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




















export default router;
