import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice'; // Adjust path
import axios from 'axios'; // Import axios for sending HTTP requests
import { IoClose } from "react-icons/io5";
import { useSnackbar } from './SnackbarProvider';
import { useNavigate } from 'react-router-dom';



const Signup = ({ onClose , openLogin }) => {
  const addSnackbar = useSnackbar();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const [photo, setPhoto] = useState(null);
  const password = watch('password', '');
  const dispatch = useDispatch();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Create a FormData object to handle file upload (photo)
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('gender', data.gender);
      formData.append('email', data.email);
      formData.append('dob', data.dob);
      formData.append('password', data.password);

      if (photo) {
        formData.append('photo', photo); // Append the photo if it's selected
      }

      // Send a POST request to the backend (adjust URL as per your API route)
      const response = await axios.post('http://localhost:3000/api/v1/user/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for file upload
        },
      });

      // Handle successful response
      console.log('Signup successful:', response.data);

      // Dispatch login action with user info and JWT token
      const { jwtToken, email, name } = response.data;
      dispatch(login({ user: { email, name,id }, token: jwtToken }));

      // Store JWT in localStorage for persistence
      localStorage.setItem('token', jwtToken);

      // Reset the form and clear photo input
      reset();
      setPhoto(null);
      onClose();
      addSnackbar({message:`Welcome, ${name}!`,type:"login"})
      navigate("/");

      // Optionally, redirect to a different page or show success message
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error('Signup failed:', error.response ? error.response.data : error.message);
    }
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  return (
    <div>
    <div className="flex justify-center items-center rounded-lg shadow-lg bg-gray-800 overflow-hidden mt-32 relative">
      <button
        className="text-red absolute top-4 right-4 font-3xl p-2 rounded-full hover:bg-gray-800 transition"
        onClick={onClose}
      >
        <IoClose className=' text-3xl text-red-500' />
      </button>
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Gender</label>
            <div className="space-x-4">
              <label>
                <input
                  type="radio"
                  value="male"
                  {...register('gender', { required: 'Gender is required' })}
                />
                <span className="ml-2 text-white">Male</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="female"
                  {...register('gender', { required: 'Gender is required' })}
                />
                <span className="ml-2 text-white">Female</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="other"
                  {...register('gender', { required: 'Gender is required' })}
                />
                <span className="ml-2 text-white">Other</span>
              </label>
            </div>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Date of Birth</label>
            <input
              type="date"
              {...register('dob', { required: 'Date of Birth is required' })}
              className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none"
            />
            {photo && <p className="text-green-500 text-sm">Photo uploaded: {photo.name}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />  
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', {
                validate: (value) => value === password || 'Passwords do not match',
              })}
              className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            {/* <Link to="/login" className="text-blue-500 hover:underline"> */}
            <span className="text-blue-500 hover:underline cursor-pointer" onClick={openLogin}>Login</span>
              
            {/* </Link> */}
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Signup;
