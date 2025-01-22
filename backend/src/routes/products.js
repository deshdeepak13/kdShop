import express from 'express';
import Product from '../models/productSchema.js'; // Adjust the path as per your directory structure

const router = express.Router();

// GET /api/products
// Fetch all products or filter products based on query parameters
router.get('/', async (req, res) => {
  try {
    // Query parameters for filtering products
    const { category, minStock, minPrice, maxPrice } = req.query;

    // Construct the query object based on provided parameters
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (minStock) {
      query.stock = { $gte: Number(minStock) };
    }
    
    if (minPrice || maxPrice) {
      query.MRP = {};
      if (minPrice) query.MRP.$gte = Number(minPrice);
      if (maxPrice) query.MRP.$lte = Number(maxPrice);
    }

    // Fetch products from the database
    const products = await Product.find(query);

    // Check if products were found
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error: error.message });
  }
});

export default router;
