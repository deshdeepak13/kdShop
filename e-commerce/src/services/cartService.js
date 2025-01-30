// src/services/cartService.js

import axios from 'axios';
import {
  optimisticAddItem,
  optimisticUpdateItem,
  optimisticRemoveItem,
  setCartItems,
  setError,
  fetchCartItems,
  // updateItemSuccess,
  // removeItemSuccess,
} from '../redux/cartSlice'; // Import Redux actions

// Add item to cart
export const addToCart = async (token, userId, productId, quantity) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/user/${userId}/cart/add/`,
      { productId, quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.cart; // Ensure the backend returns updated cart
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add item to cart');
  }
};




// Thunks with Optimistic UI
export const addItemToCart = ({ token, userId, productId, quantity }) => async (dispatch) => {
  try {
    dispatch(optimisticAddItem({ product: { _id: productId }, quantity }));
    const updatedCart = await addToCart(token, userId, productId, quantity); // Perform API call
    dispatch(setCartItems(updatedCart)); // Replace cart with updated data from the backend
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(fetchCartItems(token, userId)); // Fetch the cart again if there's an error
  }
};


export const updateCartItemQuantity = (token, userId, productId, quantity) => async (dispatch) => {
  const optimisticQuantity = { productId, quantity };
  try {
    dispatch(optimisticUpdateItem(optimisticQuantity));  // Optimistic UI update
    await updateCartItem(token, userId, productId, quantity);
    dispatch(updateItemSuccess(optimisticQuantity));
    dispatch(fetchCartItems(token, userId));
  } catch (error) {
    dispatch(setError(error.message));
    // Optionally, revert UI changes if needed
  }
};

export const removeItemFromCart = (token, userId, productId) => async (dispatch) => {
  try {
    dispatch(optimisticRemoveItem(productId));  // Optimistic UI removal
    await removeFromCart(token, userId, productId);
    dispatch(removeItemSuccess(productId));
  } catch (error) {
    dispatch(setError(error.message));
    // Optionally, re-add item if error occurs
  }
};





// Update cart item quantity
export const updateCartItem = async (token, userId, productId, quantity) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/user/${userId}/cart/update`,
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.cart;
  } catch (error) {
    console.error('Error updating cart item:', error.response.data);
    throw new Error('Error updating cart item');
  }
};

// Remove item from cart
export const removeFromCart = async (token, userId, productId) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/user/${userId}/cart/remove/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } 
    );
    return response.data.cart;
  } catch (error) {
    throw new Error('Error removing item from cart:', error.response.data);
  }
};
