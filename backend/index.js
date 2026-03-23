import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from "url";
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Define __dirname in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize environment variables (already done via import 'dotenv/config')

// console.log(process.env.MONGO_URI)
import userRoute from "./src/routes/user.js";
import productRoute from "./src/routes/products.js";
import wishlistRoute from "./src/routes/wishlist.js";
import paymentintentRoute from "./src/routes/paymentintent.js";
import orderRoute from "./src/routes/order.js";
import adminRoute from "./src/routes/admin.js";
import couponRoute from "./src/routes/coupons.js"
import categoryRoute from "./src/routes/categories.js"
import chatRoute from "./src/routes/chat.js";
// import paymentRoute from "./routes/payment.js";
// import dashboardRoute from "./routes/stats.js";

app.set('trust proxy', 1);

// Initialize Express
const app = express();

// Apply CORS before other middlewares, especially rate limiting
app.use(cors({
  origin: [
    "https://kdshop13.netlify.app",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Security Middleware
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Performance Middleware
// app.use(compression());

// Rate Limiting (100 requests per 15 mins)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false, 
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

// Middleware to parse JSON
app.use(express.json());
app.use('/public', express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use('/uploads', express.static('uploads'));


// Connect to MongoDB
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('Welcome to the Express app');
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/payments", paymentintentRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/coupon", couponRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/chat", chatRoute);
// app.use("/api/v1/payment", paymentRoute);
// app.use("/api/v1/dashboard", dashboardRoute);


// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
