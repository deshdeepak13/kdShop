import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { addToCart, updateCartItem, removeFromCart } from '../services/cartService';
// import { useSnackbar } from '../components/SnackbarProvider';

const initialState = {
  cartItems: [],
  coupon: null, // Store coupon information (if any)
  discount: 0,  // Discount percentage (if coupon is applied)
  loading: false,
  error: null,
  couponError:null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Set the entire cart items array
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },

    // Add a new item (Optimistic UI)
    optimisticAddItem: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) => item.product._id === action.payload.product._id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cartItems.push(action.payload); // Add new item
      }
    },

    // Update quantity of a cart item (Optimistic UI)
    optimisticUpdateItem: (state, action) => {
      const item = state.cartItems.find(item => item.product._id === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    // Remove an item (Optimistic UI)
    optimisticRemoveItem: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.product._id !== action.payload);
    },

    // Rollback add item in case of API failure
    rollbackAddItem: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.product._id !== action.payload);
    },

    // Rollback quantity update in case of failure
    rollbackUpdateItem: (state, action) => {
      const item = state.cartItems.find(item => item.product._id === action.payload.productId);
      if (item) {
        item.quantity = action.payload.previousQuantity;
      }
    },

    // Rollback item removal in case of failure
    rollbackRemoveItem: (state, action) => {
      state.cartItems.push(action.payload);
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    applyCoupon: (state, action) => {
      const { coupon, discount } = action.payload;
      state.coupon = coupon;
      state.discount = discount;
      state.couponError = null;  // Clear any previous errors
    },

    // Remove applied coupon and discount
    removeCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
      // addSnackbar({message:`Coupon removed!`,type:"notify"})
    },
    // Clear the cart
    clearCart: (state) => {
      state.cartItems = [];
      state.coupon = null;
      state.discount = 0;
      state.error = null; // Optionally clear errors
    },
  },
});

export const { 
  setCartItems, optimisticAddItem, optimisticUpdateItem, optimisticRemoveItem, 
  rollbackAddItem, rollbackUpdateItem, rollbackRemoveItem, setLoading, setError, applyCoupon, removeCoupon, clearCart 
} = cartSlice.actions;

// Thunks
export const fetchCartItems = (token, userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/user/${userId}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setCartItems(response.data.cart));
    
  } catch (error) {
    dispatch(setError(error.message));
  } finally { 
    dispatch(setLoading(false));
  }
};

export const addItemToCart = ({ token, userId, productId, quantity }) => async (dispatch) => {
  const optimisticItem = {
    product: { _id: productId }, // Minimal product structure
    quantity,
  };

  try {
    dispatch(optimisticAddItem(optimisticItem));
    const updatedCart = await addToCart(token, userId, productId, quantity);
    dispatch(setCartItems(updatedCart));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(rollbackAddItem(productId)); // Rollback on failure
  }
};

export const updateCartItemQuantity = (token, userId, productId, quantity) => async (dispatch, getState) => {
  const cartItems = getState().cart.cartItems;
  const previousItem = cartItems.find(item => item.product._id === productId);
  const previousQuantity = previousItem ? previousItem.quantity : 0;

  const optimisticPayload = { productId, quantity };

  try {
    dispatch(optimisticUpdateItem(optimisticPayload));
    const updatedCart = await updateCartItem(token, userId, productId, quantity);
    dispatch(setCartItems(updatedCart));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(rollbackUpdateItem({ productId, previousQuantity })); // Rollback on failure
  }
};

export const removeItemFromCart = (token, userId, productId) => async (dispatch, getState) => {
  const cartItems = getState().cart.cartItems;
  const itemToRemove = cartItems.find(item => item.product._id === productId);

  try {
    dispatch(optimisticRemoveItem(productId));
    const updatedCart = await removeFromCart(token, userId, productId);
    dispatch(setCartItems(updatedCart));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(rollbackRemoveItem(itemToRemove)); // Rollback on failure
  }
};// Apply coupon by dispatching applyCoupon with coupon details
export const applyCouponToCart = (token, userId, couponCode,addSnackbar) => async (dispatch) => {
  // const addSnackbar = useSnackbar();
  try {
    // Example API call to validate coupon and get discount
    const response = await axios.post(
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/coupon/validate`,
      { couponCode },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // console.log(response.data);
    
    if (response.data.isValid) {
      dispatch(applyCoupon({
        coupon: response.data.couponCode,
        discount: response.data.discountPercentage,  // Example: 10% discount
      }));
      addSnackbar({message:`Coupon "${couponCode}" applied successfully!`,type:"celebration"})
    } else {
      // dispatch(setError('Invalid coupon'));
      addSnackbar({message:`"${couponCode} is invalid Coupon" `,type:"error"})
    }
  } catch (error) {
    // console.log(error)
    addSnackbar({message:`"${couponCode} is invalid Coupon" `,type:"error"})
    // console.log(error.toJSON());

    // dispatch(setError(error.message));  
  }
};

export const removeCouponFromCart = (addSnackbar) => async (dispatch) => {
  dispatch(removeCoupon());
  addSnackbar({ message: "Coupon removed!", type: "notify" });
};

export const clearCartFromBackend = (token, userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    // API call to clear cart in backend
    await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/user/${userId}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log(userId);

    // Clear cart from Redux state after successful API call
    dispatch(clearCart());
  } catch (error) {
    dispatch(setError("Failed to clear cart from backend. Please try again."));
    console.error("Error clearing cart from backend:", error.message);
  } finally {
    dispatch(setLoading(false));
  }
};


export default cartSlice.reducer;