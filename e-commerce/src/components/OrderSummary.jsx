import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems, setError } from "../redux/cartSlice"; // Import the actions
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi"; // Import icons

const OrderSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, user, isLoggedIn } = useSelector((state) => state.auth);
  const { cartItems, discount, coupon, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (token && user?.id && !cartItems?.length) {
      // Fetch the cart items if they are not already available
      dispatch(fetchCartItems(token, user.id));
    }
  }, [dispatch, token, user, cartItems?.length]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // If cart is empty, show a message
  if (cartItems.length === 0) {
    return <div className="text-center text-gray-600">Your cart is empty. Add some items first.</div>;
  }

  // Calculate total items, total price, and other charges
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.product?.currentPrice ? Number(item.product.currentPrice) : 0;
    return total + price * item.quantity;
  }, 0);

  const discountAmount = discount ? (totalPrice * discount) / 100 : 0;
  const finalAmountAfterDiscount = totalPrice - discountAmount;

  // Calculate delivery charge based on final amount
  let deliveryCharge = 0;
  if (finalAmountAfterDiscount < 500) {
    deliveryCharge = 80;
  } else if (finalAmountAfterDiscount >= 500 && finalAmountAfterDiscount < 1000) {
    deliveryCharge = 50;
  } else {
    deliveryCharge = 10;
  }

  const platformFee = 10; // Fixed platform fee
  const finalAmount = finalAmountAfterDiscount + deliveryCharge + platformFee;

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-3">
        <p className="flex justify-between">
          <strong>Total Items:</strong> <span>{totalItems}</span>
        </p>
        <p className="flex justify-between">
          <strong>Total Cost:</strong> <span>₹{totalPrice.toFixed(2)}</span>
        </p>
        {discountAmount > 0 && (
          <p className="flex justify-between text-green-500">
            <strong>Discount:</strong> <span>-₹{discountAmount.toFixed(2)}</span>
          </p>
        )}
        <p className="flex justify-between">
          <strong>Delivery Charge:</strong> <span>₹{deliveryCharge}</span>
        </p>
        <p className="flex justify-between">
          <strong>Platform Fee:</strong> <span>₹{platformFee}</span>
        </p>
        <hr className="my-2 border-gray-600" />
        <p className="flex justify-between font-semibold text-blue-400">
          <strong>Total Amount:</strong> <span>₹{finalAmount.toFixed(2)}</span>
        </p>
      </div>

      <hr className="my-4 border-gray-600" />

      {/* Cart Items Summary */}
      <h3 className="text-lg font-semibold mb-3">Cart Items</h3>
      <ul className="space-y-2">
        {cartItems.map((item) => (
          <li key={item.product._id} className="flex justify-between">
            <span>{item.product.name} x {item.quantity}</span>
            <span>₹{(item.product.currentPrice * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      {/* Coupon Info */}
      {coupon && (
        <div className="mt-4 text-sm text-green-500 flex items-center">
          <FiCheckCircle size={18} className="mr-2" />
          <p>
            Applied Coupon: <strong>{coupon}</strong> - {discount}% off
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-4 text-sm text-red-500 flex items-center">
          <FiXCircle size={18} className="mr-2" />
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
