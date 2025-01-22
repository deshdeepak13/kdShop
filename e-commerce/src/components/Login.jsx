import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice'; // Adjust path

const Login = ({ onClose}) => {
  // const navigate = use
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },reset
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/user/login', data);

      console.log(response.data);

      // Store JWT token and user details in localStorage
      const { jwtToken, email, name } = response.data;
      dispatch(login({ user: { email, name}, token: jwtToken }));

      // Store JWT in localStorage for persistence
      localStorage.setItem('token', jwtToken);
      // localStorage.setItem('token', response.data.jwtToken);
      // Optionally, redirect to another page or show a success message
      // navigate('/dashboard'); // Redirect to a dashboard or home page

      // Reset the form and clear photo input
      reset();
      // setPhoto(null);
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      // Handle login errors (display an error message)
    }
  };

  return (
    <div className="flex justify-center items-center rounded-lg shadow-lg overflow-auto my-32 relative">
      <button className='text-white absolute top-1 right-1 bg-red-700 p-2 py-4 rounded-full' onClick={onClose}>Close</button>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full p-2 border rounded-md"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters long' },
              })}
              className="w-full p-2 border rounded-md"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
