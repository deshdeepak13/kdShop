import express from "express";
import Category from "../models/categorySchema.js"; // Import Category model

const router = express.Router();

// Fetch all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find(); // Retrieve categories from DB
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching categories", error: error.message });
  }
});

export default router;
