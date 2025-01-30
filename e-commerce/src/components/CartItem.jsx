import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateCartItemQuantity, removeItemFromCart } from "../redux/cartSlice";
import { useSelector } from 'react-redux';
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CartItem = ({ product, quantity, onQuantityChange }) => {
  const dispatch = useDispatch();
  const { _id, name, imageUrl, stock, discount, MRP, currentPrice } = product;
  const { user, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity === quantity || newQuantity < 1 || newQuantity > stock) return;
    
    setLoading(true);
    try {
      await dispatch(updateCartItemQuantity(token, user.id, _id, newQuantity))//.unwrap();
      onQuantityChange(_id, newQuantity);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await dispatch(removeItemFromCart(token, user.id, _id))//.unwrap();
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-IN').format(price);

  return (
    <div className="flex flex-col md:flex-row items-center bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700 hover:bg-gray-750 transition-colors group relative">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Product Image */}
      <div className="w-20 h-20 md:w-24 md:h-24 mr-4 flex-shrink-0 relative">
        {imageError ? (
          <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        ) : (
          <img
            src={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/public/images/${imageUrl?.[0] || "default-product.jpg"}`}
            alt={name}
            className="w-full h-full object-cover rounded-lg border border-gray-700"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 w-full md:w-auto min-w-0 mr-4 mt-4 md:mt-0">
        <h3 className="text-lg font-semibold text-white truncate">{name}</h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-bold text-blue-400">
            ₹{formatPrice(currentPrice)}
          </span>
          {discount > 0 && (
            <>
              <span className="text-sm text-gray-400 line-through">
                ₹{formatPrice(MRP)}
              </span>
              <span className="text-sm bg-green-800 text-green-300 px-2 py-1 rounded">
                {discount}% off
              </span>
            </>
          )}
        </div>
        <p className="text-sm text-gray-400 mt-2 line-clamp-2">{product.description}</p>
      </div>

      {/* Quantity and Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full md:w-auto mt-4 md:mt-0">
        {/* Quantity Controls */}
        <div className="flex items-center gap-3 bg-gray-700 px-4 py-2 rounded-lg">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || loading}
            className={`p-1.5 rounded-lg hover:bg-gray-600 transition-colors ${
              quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Decrease quantity"
          >
            <FiMinus size={18} className="text-gray-300" />
          </button>
          
          <span className="text-lg font-medium text-white w-8 text-center">
            {loading ? <Skeleton width={24} /> : quantity}
          </span>
          
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= stock || loading}
            className={`p-1.5 rounded-lg hover:bg-gray-600 transition-colors ${
              quantity >= stock ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Increase quantity"
          >
            <FiPlus size={18} className="text-gray-300" />
          </button>
        </div>

        {/* Stock Status */}
        <div className="text-sm text-gray-400 mt-2 sm:mt-0 sm:ml-4">
          {stock > 0 ? (
            <span className="text-green-400">{stock} in stock</span>
          ) : (
            <span className="text-red-400">Out of stock</span>
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={loading}
          className="mt-4 sm:mt-0 sm:ml-6 flex items-center gap-2 text-red-400 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <FiTrash2 size={18} />
          <span className="hidden md:inline">Remove</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;