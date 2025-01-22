// src/routes/wishlist.js
import express from "express";
import User from "../models/userSchema.js";
import Product from "../models/productSchema.js";
import authMiddleware from "../middlewares/verifyTokenMiddleware.js";

const router = express.Router();

/**
 * @route GET /api/v1/user/:userId/wishlist
 * @desc Fetch all items in the user's wishlist
 * @access Private (Requires authentication)
 */
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure the user is accessing their own wishlist
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch the user's wishlist
    const user = await User.findById(userId).populate("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch product details for items in the wishlist
    const wishlistItems = await Product.find({
      _id: { $in: user.wishlist },
    });

    res.status(200).json({ wishlist: wishlistItems });
  } catch (error) {
    console.error("Error fetching wishlist:", error.message);
    res.status(500).json({ message: "Error fetching wishlist", error: error.message });
  }
});


/**
 * @route POST /api/v1/wishlist/:userId/add
 * @desc Add an item to the user's wishlist
 * @access Private (Requires authentication)
 */
router.post("/:userId/add", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    // Ensure the user is accessing their own wishlist
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add the product to the user's wishlist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      message: "Product added to wishlist",
      product: {
        id: product._id,
        name: product.name,
        currentPrice: product.currentPrice,
        imageUrl: product.imageUrl,
        discount: product.discount,
        MRP: product.MRP,
      },
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error.message);
    res.status(500).json({ message: "Error adding to wishlist", error: error.message });
  }
});

/**
 * @route DELETE /api/v1/wishlist/:userId/remove/:productId
 * @desc Remove an item from the user's wishlist
 * @access Private (Requires authentication)
 */
router.delete("/:userId/remove/:productId", authMiddleware, async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Ensure the user is accessing their own wishlist
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Remove the product from the user's wishlist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product not in wishlist" });
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error.message);
    res.status(500).json({ message: "Error removing from wishlist", error: error.message });
  }
});

export default router;
