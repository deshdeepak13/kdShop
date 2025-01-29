import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { IoClose } from "react-icons/io5";
import { Eye, EyeOff } from "lucide-react"; // Import Eye Icons
import { useSnackbar } from "../components/SnackbarProvider";

const Login = ({ onClose }) => {
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State for password toggle

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/user/login', data);
      const { jwtToken, email, name,id } = response.data;

      localStorage.setItem('token', jwtToken); 
      dispatch(login({ user: { email, name,id }, token: jwtToken }));
      
      reset();
      onClose();
      navigate("/");
      showSnackbar({ message: `Welcome back, ${name}!`, type: "login" });
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="flex justify-center items-center overflow-auto my-32 relative p-8">
      {/* Close Button */}
      <button className="absolute top-9 right-9 p-2 rounded-full hover:bg-gray-800 transition" onClick={onClose}>
        <IoClose className='text-3xl text-red-500' />
      </button>

      <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password Field with Toggle */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters long' },
                })}
                className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10"
              />
              {/* Eye Icon for Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
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
