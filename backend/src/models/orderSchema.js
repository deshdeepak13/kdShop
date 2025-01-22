import mongoose from 'mongoose';

// Define the Order Schema
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

// Create and export the Order model using ES6 syntax
const Order = mongoose.model('Order', orderSchema);
export default Order;
