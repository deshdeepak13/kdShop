import mongoose from 'mongoose';

// Define the Order Schema
/**
 * Schema for Customer Orders.
 * @typedef {Object} Order
 * @property {ObjectId} user - Reference to the User who placed the order.
 * @property {Array} orderItems - List of products in the order.
 * @property {Object} shippingAddress - Shipping details.
 * @property {Object} paymentInfo - Payment methods and status.
 * @property {number} totalPrice - Total cost of the order.
 * @property {string} status - Current status of the order (e.g., Pending, Shipped).
 * @property {Date} createdAt - Timestamp of creation.
 * @property {Date} updatedAt - Timestamp of last update.
 */
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  shippingAddress: {
    name: { type: String, required: true },
    mobile: { type: String, },
    address: { type: String},
    city: { type: String,},
    postalCode: { type: String, },
    country: { type: String, },
  },
  paymentInfo: {
    method: { type: String, required: true }, // e.g., "Credit Card", "PayPal", etc.
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'Pending', // Default status when the order is created
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
  },
}, {
  timestamps: true, // Automatically creates createdAt and updatedAt fields
});

// Indexes
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });

// Create and export the Order model using ES6 syntax
const Order = mongoose.model('Order', orderSchema);
export default Order;
