import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import CouponForm from "./CouponForm";
import { fetchCartItems, setError } from "../redux/cartSlice";
import { FiAlertTriangle, FiInfo, FiShoppingBag, FiLock } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qtyArr, setQtyArr] = useState({});
  const { token, user, isLoggedIn } = useSelector((state) => state.auth);
  const { cartItems, loading, error, coupon, discount } = useSelector((state) => state.cart);

  // Fetch cart items on component mount or when token/user changes
  useEffect(() => {
    if (token && user?.id) {
      dispatch(setError(null));
      dispatch(fetchCartItems(token, user.id));
      
    }
  }, [dispatch, token, user]);

  // Initialize quantity state
  useEffect(() => {
    if (cartItems.length > 0) {
      const initialQty = {};
      cartItems.forEach((item) => {
        initialQty[item.product._id] = item.quantity;
      });
      setQtyArr(initialQty);
    }
  }, [cartItems]);

  // Calculate prices
  const totalAmount = cartItems.reduce((total, item) => {
    const price = item.product?.currentPrice || 0;
    const quantity = qtyArr[item.product._id] || item.quantity;
    return total + price * quantity;
  }, 0);

  const totalItems = cartItems.reduce((total, item) => total + (qtyArr[item.product._id] || item.quantity), 0);
  const discountAmount = discount ? (totalAmount * discount) / 100 : 0;
  const finalAmountAfterDiscount = totalAmount - discountAmount;

  const getDeliveryCharge = () => {
    if (finalAmountAfterDiscount < 500) return 80;
    if (finalAmountAfterDiscount < 1000) return 50;
    return 10;
  };

  const deliveryCharge = cartItems.length > 0 ? getDeliveryCharge() : 0;
  const platformFee = cartItems.length > 0 ? 10 : 0;
  const totalAmountAfterCharges = finalAmountAfterDiscount + deliveryCharge + platformFee;

  const handlePlaceOrder = () => navigate("/checkout");

  if (!isLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
        <FiLock className="text-4xl text-blue-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-300 mb-2">Authentication Required</h2>
        <p className="text-gray-400 mb-6 max-w-md">
          Please log in to view your cart and manage your shopping items.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all"
        >
          Login Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-900 text-white lg:flex lg:flex-nowrap">
      {/* Main Cart Items Section */}
      <main className="lg:w-3/4 xl:w-4/5 p-4 md:p-6 lg:pr-2 xl:pr-6">
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
            <FiShoppingBag className="text-2xl text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-100">Your Shopping Cart</h2>
            <span className="ml-2 bg-gray-700 text-blue-400 px-3 py-1 rounded-full text-sm">
              {cartItems.length} items
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 bg-gray-700 rounded-lg">
                  <Skeleton height={120} baseColor="#1f2937" highlightColor="#374151" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <FiAlertTriangle className="text-4xl text-red-400 mx-auto mb-4" />
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <button
                onClick={() => dispatch(fetchCartItems(token, user.id))}
                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-md"
              >
                Retry
              </button>
            </div>
          ) : cartItems.length > 0 ? (
            <>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.product._id}
                    quantity={qtyArr[item.product._id] || item.quantity}
                    product={item.product}
                    onQuantityChange={(id, qty) => setQtyArr(prev => ({ ...prev, [id]: qty }))}
                  />
                ))}
              </div>
              
            </>
          ) : (
            <div className="text-center py-12">
              <FiInfo className="text-4xl text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Your Cart is Empty</h3>
              <p className="text-gray-400 mb-6">Explore our products and add items to your cart!</p>
              <button
                onClick={() => navigate("/products")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Price Summary Section */}
      <aside className="lg:w-1/3 xl:w-1/4 p-4 md:p-6 lg:pl-2 xl:pl-6">
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg border border-gray-700 sticky top-4">
          <h2 className="text-xl font-bold text-blue-400 mb-6">Price Details</h2>
          
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between text-gray-300">
                <span>Items ({totalItems})</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-300">
                <span>Delivery</span>
                <span>₹{deliveryCharge.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-300">
                <span>Platform Fee</span>
                <span>₹{platformFee.toFixed(2)}</span>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between font-semibold text-lg text-blue-400">
                  <span>Total Amount</span>
                  <span>₹{totalAmountAfterCharges.toFixed(2)}</span>
                </div>
              </div>

              <CouponForm disabled={!cartItems.length} />
              {coupon && (
                <div className="mt-3 text-sm text-green-400 flex items-center gap-2">
                  <FiInfo className="flex-shrink-0" />
                  Applied: {coupon} ({discount}% off)
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400">
              <p className="text-center py-4">Add items to see price details</p>
              <CouponForm disabled={true} />
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FiLock className="flex-shrink-0" />
              <span>Secure SSL encrypted payment processing</span>
            </div>
          </div>
          <div className="sticky bottom-0 bg-gray-800 py-4 mt-6 border-t border-gray-700">
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg transition-all  flex-col items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout </span>
                  <span className="text-white/80">₹{totalAmountAfterCharges.toFixed(2)}</span>
                </button>
              </div>
        </div>
        
      </aside>
    </div>
  );
};

export default Cart;