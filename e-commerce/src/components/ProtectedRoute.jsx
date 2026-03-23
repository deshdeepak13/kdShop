import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Higher-order component for protecting routes.
 * Redirects unauthenticated users to login.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
const ProtectedRoute = ({ children }) => {
  const admintoken = localStorage.getItem("admintoken");

  if (!admintoken) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedRoute;
