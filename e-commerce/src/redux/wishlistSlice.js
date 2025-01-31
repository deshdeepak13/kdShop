// src/redux/wishlistSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  wishlistItems: [], // Items in the wishlist
  loading: false, // Loading state
  error: null, // Error state
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlistItems: (state, action) => {
      state.wishlistItems = action.payload;
    },
    addWishlistItem: (state, action) => {
      state.wishlistItems.push(action.payload);
    },
    removeWishlistItem: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item.id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setWishlistItems,
  addWishlistItem,
  removeWishlistItem,
  setLoading,
  setError,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

// Thunks
export const fetchWishlistItems = (token, userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/wishlist/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // console.log(response.data);
    dispatch(setWishlistItems(response.data.wishlist));
    
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to fetch wishlist"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const addToWishlist = (token, userId, product) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/wishlist/${userId}/add`,
      { productId: product.id },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch(addWishlistItem(response.data.product)); // Add to Redux state
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to add to wishlist"));
  }
};

export const removeFromWishlist = (token, userId, productId) => async (dispatch) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/wishlist/${userId}/remove/${productId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch(removeWishlistItem(productId)); // Remove from Redux state
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to remove from wishlist"));
  }
};
