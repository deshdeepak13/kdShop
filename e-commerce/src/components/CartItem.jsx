import React from "react";
import { useDispatch } from "react-redux";
import { updateCartItemQuantity, removeItemFromCart } from "../redux/cartSlice"; // Import your actions
import { useSelector } from 'react-redux';

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
      // dispatch(fetchCartItems(token, user.id));  // Fetch cart items again to reflect changes
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
    <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
      <img
        src={`http://localhost:3000/public/images/${product.imageUrl?.[0] || 'default-product.jpg'}`}
        alt={name}
        className="w-20 h-20 object-contain rounded-md mr-4"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">{description}</p>
        <p className="text-lg font-bold">₹{currentPrice}</p>
        {discount && <p className="text-sm text-green-600">-{discount}%</p>}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleMinusChange}
          disabled={quantity === 1}
          className="bg-gray-200 p-2 rounded-full"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="text-lg">{quantity}</span>
        <button
          onClick={handleAddChange}
          disabled={quantity === stock}
          className="bg-gray-200 p-2 rounded-full"
          aria-label="Increase quantity"
        >
          +
        </button>
        <button
          onClick={handleRemove}
          className="text-red-600 hover:underline"
          aria-label="Remove item"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
