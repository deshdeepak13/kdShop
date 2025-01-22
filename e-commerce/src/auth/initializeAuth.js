// src/auth/initializeAuth.js
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';

const initializeAuth = (dispatch) => {
//   const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  
  if (token) {
    fetch('http://localhost:3000/api/v1/user/verifyToken', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        dispatch(login({ user: data.user, token })); // Log in user
      } else {
        localStorage.removeItem('token'); // Invalid token, remove it
      }
    })
    .catch(error => {
      console.error('Error verifying token:', error);
      localStorage.removeItem('token'); // Remove token on error
    });
  }
};

export default initializeAuth;
