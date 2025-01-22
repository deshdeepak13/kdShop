import mongoose from 'mongoose';
import validator from 'validator';

// Define the User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  dob: {
    type: Date,
    required: [true, 'Please provide your date of birth'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // This will prevent the password from being returned in queries by default
  },
  // Orders: Array of Order ObjectIds
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
  // Wishlist: Array of Product ObjectIds
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  // CartItems: Array of Product ObjectIds
  cartItems: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true  ,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
}],
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Virtual attribute: age
userSchema.virtual('age').get(function () {
  const today = new Date();
  const birthDate = new Date(this.dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
});

// Create and export the User model using ES6 syntax
const User = mongoose.model('User', userSchema);
export default User;
