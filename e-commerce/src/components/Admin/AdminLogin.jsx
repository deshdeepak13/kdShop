import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Eye icons for toggling password visibility
import Admin from "./Admin";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admintoken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/admin/login`, {
        email,
        password,
      });

      const { jwtToken, adminDetails, message } = response.data;
      localStorage.setItem("admintoken", jwtToken);
      setIsLoggedIn(true);
      console.log(message);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to login. Please try again.";
      setError(errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admintoken");
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <Admin onLogout={handleLogout} />;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="w-full max-w-sm p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Admin Login</h2>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-700 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Password Field with Toggle */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                required
              />
              {/* Eye Icon for Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
