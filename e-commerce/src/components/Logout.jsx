// LogoutButton.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice'; // Adjust the import path as needed

const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // Reset the Redux store
    localStorage.removeItem('token'); // Clear JWT or token
    window.location.href = '/login'; // Optionally redirect to login or home page
  };

  return (
    <button
      onClick={handleLogout}
      className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default Logout;
