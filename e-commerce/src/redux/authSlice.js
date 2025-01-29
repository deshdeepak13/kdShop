import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null, // Can store username/email/id here
  token: null, // JWT or session token (if using tokens)
  // id: null, // JWT or session token (if using tokens)
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user; // Store user info (username or email)
      state.token = action.payload.token; // Store JWT token if needed
      // state.id = action.payload.id; // Store JWT token if needed
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
