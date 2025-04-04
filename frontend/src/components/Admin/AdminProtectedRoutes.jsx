// src/components/Admin/AdminProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
        <FaSpinner className="animate-spin text-4xl text-yellow-500 mb-4" />
        <span>Checking authentication...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "admin") {
    console.warn("Access Denied: User is not an admin.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
