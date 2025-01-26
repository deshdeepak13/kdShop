import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from "url";

// Define __dirname in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize environment variables
dotenv.config();

// console.log(process.env.MONGO_URI)
import userRoute from "./src/routes/user.js";
import productRoute from "./src/routes/products.js";
import wishlistRoute from "./src/routes/wishlist.js";
import paymentintentRoute from "./src/routes/paymentintent.js";
import orderRoute from "./src/routes/order.js";
import adminRoute from "./src/routes/admin.js";
// import paymentRoute from "./routes/payment.js";
// import dashboardRoute from "./routes/stats.js";


// Initialize Express
const app = express();

// Middleware to parse JSON
app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use('/uploads', express.static('uploads'));


// Connect to MongoDB
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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
// app.use("/api/v1/payment", paymentRoute);
// app.use("/api/v1/dashboard", dashboardRoute);



// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
