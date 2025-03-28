// src/components/ProtectedRoute.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation(); // Get current location

  if (loading) {
    // Show loading indicator while checking auth status
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        Loading Authentication...
      </div>
    );
  }

  if (!user) {
    // User not logged in, redirect to login page
    // Pass the current location in state so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is logged in, render the requested component
  return children;
};

export default ProtectedRoute;
