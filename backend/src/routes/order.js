import express from "express";
import Order from "../models/orderSchema.js"; // Import Order model
import User from "../models/userSchema.js"; // Import Order model
import verifyTokenMiddleware from '../middlewares/verifyTokenMiddleware.js'
import mongoose from "mongoose";

// import { authenticateUser } from "../middleware/authMiddleware.js"; // Middleware to protect routes

const router = express.Router();

// -------------------
// Create New Order
// -------------------
router.post("/", verifyTokenMiddleware, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, paymentId } = req.body;
    // console.log(req.user);

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No order items provided." });
    }

    // Create new order
    const order = new Order({
      user: req.user.id, // Retrieved from auth middleware
      // transactionId: paymentId,
      orderItems: items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: totalAmount,
      shippingAddress,
      paymentInfo: {
        method:'card',
        id: paymentId,
        status:'processing',
      }
    });

    const createdOrder = await order.save();

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.orders.push(createdOrder._id);
    await user.save();


    res.status(201).json({ message: "Order created successfully.", order: createdOrder });
  } catch (error) {
    console.error("Order Creation Error:", error.message);
    res.status(500).json({ error: "Failed to create order." });
  }
});

// -------------------
// Get All Orders for Admin
// -------------------
router.get("/", verifyTokenMiddleware, async (req, res) => {
  try {
    // Fetch all orders (admin use case)
    const orders = await Order.find({}).populate("userId", "name email").sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error.message);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

// -------------------
// Get User-Specific Orders
// -------------------
router.get("/my-orders", verifyTokenMiddleware, async (req, res) => {
  try {
    const userOrders = await Order.aggregate([
      // Match orders for the logged-in user
      { $match: { user:new mongoose.Types.ObjectId(req.user.id) } },

      // Unwind the orderItems array
      { $unwind: "$orderItems" },

      // Lookup product details from the Product collection
      {
        $lookup: {
          from: "products", // Collection name for products
          localField: "orderItems.product", // Field in Order collection
          foreignField: "_id", // Field in Product collection
          as: "productDetails", // Output array
        },
      },

      // Flatten productDetails array
      { $unwind: "$productDetails" },

      // Group by order to reassemble orderItems with product details
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          paymentInfo: { $first: "$paymentInfo" },
          totalPrice: { $first: "$totalPrice" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          shippingAddress: { $first: "$shippingAddress" },
          orderItems: {
            $push: {
              productId: "$orderItems.product",
              quantity: "$orderItems.quantity",
              price: "$orderItems.price",
              productName: "$productDetails.name",
              imageUrl: "$productDetails.imageUrl", // Entire array of images
            },
          },
        },
      },

      // Sort orders by creation date (latest first)
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json(userOrders);
  } catch (error) {
    console.error("Fetch User Orders Error:", error.message);
    res.status(500).json({ error: "Failed to fetch user orders." });
  }
});

  

// -------------------
// Update Order Status (Admin Only)
// -------------------
router.put("/:_id", verifyTokenMiddleware, async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Update status
    order.status = status || order.status;
    await order.save();

    res.status(200).json({ message: "Order status updated successfully.", order });
  } catch (error) {
    console.error("Update Order Status Error:", error.message);
    res.status(500).json({ error: "Failed to update order status." });
  }
});

// -------------------
// Delete an Order (Admin Only)
// -------------------
router.delete("/:_id", verifyTokenMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    await order.deleteOne();
    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error("Delete Order Error:", error.message);
    res.status(500).json({ error: "Failed to delete order." });
  }
});

export default router;
