import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import CouponForm from "./CouponForm";
import { fetchCartItems, setError } from "../redux/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qtyArr, setQtyArr] = useState({});
  const [couponCode, setCouponCode] = useState(""); // State to hold the coupon code input
  const { token, user, isLoggedIn } = useSelector((state) => state.auth);
  const { cartItems, loading, error, coupon, discount } = useSelector((state) => state.cart);
  
  // Fetch cart items on component mount or when token/user changes
  useEffect(() => {
    if (token && user?.id) {
      dispatch(setError(null)); // Clear errors before fetching
      dispatch(fetchCartItems(token, user.id));
    }
  }, [dispatch, token, user]);

  // Initialize the quantity state when cartItems change
  useEffect(() => {
    if (cartItems.length > 0) {
      const initialQty = {};
      cartItems.forEach((item) => {
        initialQty[item.product._id] = item.quantity;
      });
      setQtyArr(initialQty);
    }
  }, [cartItems]);

  // Handle quantity changes from CartItem
  const handleQuantityChange = (productId, newQuantity) => {
    setQtyArr((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  // Calculate total amount
  const totalAmount = cartItems.reduce((total, item) => {
    const price = item.product?.currentPrice ? Number(item.product.currentPrice) : 0;
    const quantity = qtyArr[item.product._id] || item.quantity;
    return total + price * quantity;
  }, 0);

  const totalItems = cartItems.reduce((total, item) => total + (qtyArr[item.product._id] || item.quantity), 0);

  const discountAmount = discount ? (totalAmount * discount) / 100 : 0;
  const finalAmountAfterDiscount = totalAmount - discountAmount;

  let deliveryCharge = 0;
  if (finalAmountAfterDiscount < 500) {
    deliveryCharge = 80;
  } else if (finalAmountAfterDiscount >= 500 && finalAmountAfterDiscount < 1000) {
    deliveryCharge = 50;
  } else {
    deliveryCharge = 10;
  }

  const platformFee = 10;
  const totalAmountAfterCharges = finalAmountAfterDiscount + deliveryCharge + platformFee;

  const handlePlaceOrder = () => {
    navigate("/checkout");
  };

  return isLoggedIn ? (
    <div className="flex h-[calc(100vh-5rem)] bg-gray-900 text-white">
      {/* Aside: Price Details */}
      <aside className="w-1/4 p-6 bg-gray-800 shadow-lg rounded-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-blue-400 mb-6">Price Details</h2>

        {cartItems && cartItems.length > 0 ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-700 rounded-lg shadow-md">
              <p className="flex justify-between">
                <span>Total Items</span>
                <span className="font-medium text-white">{totalItems}</span>
              </p>
            </div>

            <div className="p-4 bg-gray-700 rounded-lg shadow-md">
              <p className="flex justify-between">
                <span>Total Amount</span>
                <span className="font-medium text-white">₹{totalAmount}</span>
              </p>
            </div>

            {discountAmount > 0 && (
              <div className="p-4 bg-green-800 border border-green-700 rounded-lg">
                <p className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-₹{discountAmount}</span>
                </p>
              </div>
            )}

            <div className="p-4 bg-gray-700 rounded-lg shadow-md">
              <p className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-medium text-white">₹{deliveryCharge}</span>
              </p>
            </div>

            <div className="p-4 bg-gray-700 rounded-lg shadow-md">
              <p className="flex justify-between">
                <span>Platform Fees</span>
                <span className="font-medium text-white">₹{platformFee}</span>
              </p>
            </div>

            <div className="p-4 bg-blue-800 border border-blue-700 rounded-lg">
              <p className="flex justify-between font-semibold text-blue-400">
                <span>Total Amount</span>
                <span>₹{totalAmountAfterCharges}</span>
              </p>
            </div>

            {/* Coupon Input Section */}
            <div className="mt-6">
              <CouponForm disabled={false} />
              {coupon && (
                <p className="mt-2 text-sm text-green-400">
                  Applied Coupon: {coupon} - {discount}% off
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-500 mb-4">Your cart is empty. Start shopping now!</p>
            <p className="p-4 bg-gray-800 rounded-lg">Total Amount: ₹0</p>
            <div className="mt-6">
              <CouponForm disabled={true} />
            </div>
          </div>
        )}
      </aside>

      {/* Main: Cart Items */}
      <main className="w-3/4 p-8 bg-gray-800 shadow-xl rounded-lg relative border border-gray-700 overflow-y-auto">
        <h2 className="text-3xl font-bold text-white mb-4 border-b border-gray-600 pb-2">
          Your Shopping Cart
        </h2>

        {loading && <p className="text-center text-lg text-gray-400">Loading cart items...</p>}
        {error && <p className="text-center text-red-400 text-lg">{error}</p>}

        <div className="space-y-6 mb-20">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItem
                key={item.product._id}
                quantity={qtyArr[item.product._id] || item.quantity}
                product={item.product}
                onQuantityChange={handleQuantityChange}
              />
            ))
          ) : (
            <div className="text-center text-gray-400 mt-10">
              <p className="text-xl">Your cart is empty.</p>
            </div>
          )}
        </div>

        {cartItems && cartItems.length > 0 && (
          <div className="sticky bottom-0 bg-transparent py-4 flex justify-end border-gray-700">
            <button
              onClick={handlePlaceOrder}
              className="bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition-all"
            >
              Place Order
            </button>
          </div>
        )}
      </main>
    </div>
  ) : (
    <div className="text-center p-20">
      <p className="text-gray-400">Please log in to view your cart.</p>
    </div>
  );
};

export default Cart;
