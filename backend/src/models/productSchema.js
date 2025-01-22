import mongoose from 'mongoose';

// Define the Product Schema
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

// Virtual attribute: currentPrice
productSchema.virtual('currentPrice').get(function () {
  return this.MRP - (this.MRP * this.discount / 100);
});

// Create and export the Product model using ES6 syntax
const Product = mongoose.model('Product', productSchema);
export default Product;
