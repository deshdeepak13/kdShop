import express from 'express';
import Product from '../models/productSchema.js'; // Adjust the path as per your directory structure

const router = express.Router();

// GET /api/products
/**
 * @route GET /api/v1/products
 * @desc Fetch all products with optional filtering (category, price, stock)
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    // Query parameters for filtering products
    const { category, minStock, minPrice, maxPrice, keyword, page = 1, limit = 9 } = req.query;

    // Construct the query object based on provided parameters
    const query = {};
    
    if (keyword) {
      query.$text = { $search: keyword };
    }

    if (category && category !== 'all') {
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

    // Pagination logic
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    // Fetch products from the database
    const products = await Product.find(query)
      .skip(skip)
      .limit(parsedLimit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / parsedLimit);

    // Check if products were found (only if page 1 and no results, or handle specifically)
    // if (products.length === 0 && parsedPage === 1) {
    //   return res.status(404).json({ message: 'No products found' });
    // }

    res.status(200).json({
      products,
      totalProducts,
      totalPages,
      currentPage: parsedPage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error: error.message });
  }
});

export default router;
