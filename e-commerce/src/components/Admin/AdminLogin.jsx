import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Admin from "./Admin";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the admin is already logged in (token exists)
    const token = localStorage.getItem("admintoken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // API call to authenticate admin
      const response = await axios.post("http://localhost:3000/api/v1/admin/login", {
        email,
        password,
      });

      // Destructure the response data
      const { jwtToken, adminDetails, message } = response.data;

      // Save token to localStorage
      localStorage.setItem("admintoken", jwtToken);

      // Log the admin details (optional, for debugging)
      console.log("Admin Details:", adminDetails);

      // Update the login state
      setIsLoggedIn(true);

      // Optionally, display a success message (if using a toast notification system)
      console.log(message); // "Admin login successful"
    } catch (err) {
      // Handle errors from the API
      const errorMessage = err.response?.data?.message || "Failed to login. Please try again.";
      setError(errorMessage);
    }
  };

  const handleLogout = () => {
    // Clear token from localStorage and update login state
    localStorage.removeItem("admintoken");
    setIsLoggedIn(false);
    // window.location.href = "/login"; // Redirect to login
  };

  if (isLoggedIn) {
    // Render the Admin component if logged in
    return <Admin onLogout={handleLogout} />;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Admin Login</h2>
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
