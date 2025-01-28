import React from "react";
import { useDispatch } from "react-redux";
import { updateCartItemQuantity, removeItemFromCart } from "../redux/cartSlice"; // Import your actions
import { useSelector } from 'react-redux';
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi"; // Import icons

const CartItem = ({ product, quantity, onQuantityChange }) => {
  const dispatch = useDispatch();
  const { _id, name, imageUrl, stock, discount, description, currentPrice } = product;
  const { user, token } = useSelector((state) => state.auth);

  const handleAddChange = () => {
    if (quantity < stock) {
      const newQuantity = quantity + 1;
      // Notify the parent component to update the state
      onQuantityChange(_id, newQuantity);
      dispatch(updateCartItemQuantity(token, user.id, _id, newQuantity));
      window.location.reload();
    }
  };

  const handleMinusChange = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      // Notify the parent component to update the state
      onQuantityChange(_id, newQuantity);
      dispatch(updateCartItemQuantity(token, user.id, _id, newQuantity));
      window.location.reload();
    }
  };

  const handleRemove = () => {
    dispatch(removeItemFromCart(token, user.id, _id));
    window.location.reload();
  };

  return (
    <div className="flex items-center bg-gray-800 shadow-lg rounded-lg p-4 mb-6 transition-transform hover:scale-105 border border-gray-700">
      {/* Product Image */}
      <div className="w-24 h-24 mr-6 flex-shrink-0">
        <img
          src={`http://localhost:3000/public/images/${imageUrl?.[0] || "default-product.jpg"}`}
          alt={name}
          className="w-full h-full object-contain rounded-lg border border-gray-700"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-1 truncate">{name}</h3>
        <p className="text-sm text-gray-400 mb-2 truncate">{description}</p>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-blue-400">₹{currentPrice}</span>
          {discount && (
            <span className="text-sm bg-green-700 text-green-300 px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
        </div>
      </div>

      {/* Quantity and Actions */}
      <div className="flex items-center space-x-4">
        {/* Quantity Controls */}
        <div className="flex items-center space-x-2 bg-gray-700 p-2 rounded-md shadow">
          <button
            onClick={handleMinusChange}
            disabled={quantity === 1}
            className={`p-2 text-gray-300 rounded-full bg-gray-800 hover:bg-gray-700 shadow transition duration-150 ${quantity === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Decrease quantity"
          >
            <FiMinus size={18} />
          </button>
          <span className="text-lg font-medium text-white">{quantity}</span>
          <button
            onClick={handleAddChange}
            disabled={quantity === stock}
            className={`p-2 text-gray-300 rounded-full bg-gray-800 hover:bg-gray-700 shadow transition duration-150 ${quantity === stock ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Increase quantity"
          >
            <FiPlus size={18} />
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="flex items-center space-x-1 text-red-400 font-medium hover:text-red-600 transition"
          aria-label="Remove item"
        >
          <FiTrash2 size={18} />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
