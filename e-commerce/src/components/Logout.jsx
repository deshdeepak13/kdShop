// LogoutButton.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from './SnackbarProvider';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const handleLogout = () => {
    dispatch(logout()); // Reset the Redux store
    localStorage.removeItem('token'); // Clear JWT or token
    navigate("/");
    showSnackbar({message:`Logged Out successfully!`,type:"logout"});
    // window.location.href = '/login'; // Optionally redirect to login or home page
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
