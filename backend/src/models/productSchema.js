import mongoose from 'mongoose';

// Define the Product Schema
// Define the Product Schema
/**
 * Schema for Products.
 * @typedef {Object} Product
 * @property {string} name - Name of the product.
 * @property {string} description - Detailed description.
 * @property {number} MRP - Maximum Retail Price.
 * @property {number} discount - Discount percentage (0-100).
 * @property {number} stock - Quantity available in stock.
 * @property {Array<string>} imageUrl - List of image URLs (max 20).
 * @property {number} ratings - Average rating (0-5).
 * @property {number} numReviews - Total number of reviews.
 * @property {string} category - Category of the product.
 * @property {number} currentPrice - Virtual field: calculated price after discount.
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description of the product'],
  },
  MRP: {
    type: Number,
    required: [true, 'Please provide the MRP of the product'],
    min: [0, 'MRP must be positive'],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100'],
  },
  stock: {
    type: Number,
    required: [true, 'Please provide the stock quantity'],
    min: [0, 'Stock quantity cannot be negative'],
  },
  imageUrl: {
    type: [String], // Array of image URLs
    validate: {
      validator: function (array) {
        return array.length <= 20; // Maximum 20 elements
      },
      message: 'Image URL array cannot have more than 20 elements',
    },
    default: ['default-product.jpg'],
  },
  ratings: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Please provide the product category'],
    trim: true,
  },
}, {
  timestamps: true, // Automatically creates createdAt and updatedAt fields
  toJSON: { virtuals: true }, // Include virtuals in JSON output
  toObject: { virtuals: true } // Include virtuals when converting to a plain object
});

// Indexes
productSchema.index({ category: 1 });
productSchema.index({ MRP: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual attribute: currentPrice
productSchema.virtual('currentPrice').get(function () {
  return this.MRP - (this.MRP * this.discount / 100);
});

// Create and export the Product model using ES6 syntax
const Product = mongoose.model('Product', productSchema);
export default Product;
