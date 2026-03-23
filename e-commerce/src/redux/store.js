// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import wishlistReducer from "./wishlistSlice";

/**
 * Redux Store configuration.
 * Combines cart, auth, and wishlist reducers.
 */
const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
  },
});

export default store;
