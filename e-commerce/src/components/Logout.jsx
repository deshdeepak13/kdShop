// LogoutButton.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from './SnackbarProvider';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addSnackbar = useSnackbar();

  const handleLogout = () => {
    dispatch(logout()); // Reset the Redux store
    localStorage.removeItem('token'); // Clear JWT or token
    navigate("/");
    addSnackbar({message:`Logged Out successfully!`,type:"logout"});
    // window.location.href = '/login'; // Optionally redirect to login or home page
  };

  return (
    <span
      onClick={handleLogout}
      className="hover:text-white transition-colors"
    >
      Logout
    </span>
  );
};

export default Logout;
