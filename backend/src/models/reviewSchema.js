import mongoose from 'mongoose';

// Define the Review Schema
const reviewSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Please provide a review message'],
    trim: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
    default: 'default-review.jpg', // Default image if not provided
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
  },
}, {
  timestamps: true, // Automatically creates createdAt and updatedAt fields
});

// Create and export the Review model using ES6 syntax
const Review = mongoose.model('Review', reviewSchema);
export default Review;
