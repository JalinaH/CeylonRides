// src/pages/Auth/LoginPage.jsx (Rename file for clarity)
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // *** USE AUTH CONTEXT ***
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
// Assuming Navbar/Footer are separate components if you want them on this page
// import Navbar from '../../components/Navbar';
// import Footer from '../../components/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false); // *** Get loading from context ***
  const { login, loading } = useAuth(); // *** USE AUTH HOOK ***
  const navigate = useNavigate();
  const location = useLocation();

  // Get the 'from' location if redirected from a protected route
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // setLoading(true); // Context handles loading

    const result = await login(email, password); // *** CALL CONTEXT LOGIN ***

    // setLoading(false); // Context handles loading

    if (result.success) {
      // No need for setTimeout, navigate directly
      // The context update triggers re-renders where needed
      navigate(from, { replace: true });
    } else {
      setError(result.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center"
      style={
        {
          /* ... background styles ... */
        }
      }
    >
      <div className="absolute inset-0 bg-black opacity-80 z-0"></div>

      {/* Optional: Add Navbar/Footer if desired on this standalone page */}
      {/* <Navbar /> */}

      <div className="relative z-10 bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-500">
          Login
        </h2>{" "}
        {/* Increased size */}
        {error && (
          <p className="bg-red-700 text-center text-white p-3 rounded mb-4">
            {error}
          </p>
        )}{" "}
        {/* Use error state */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">
              <span className="flex items-center">
                <FaEnvelope className="mr-2" />
                Email
              </span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none" // Added focus styles
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2">
              <span className="flex items-center">
                <FaLock className="mr-2" />
                Password
              </span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none" // Added focus styles
              required
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading} // *** Use context loading state ***
            className={`w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          {" "}
          {/* Increased margin */}
          Don't have an account? {/* *** Use Link component *** */}
          <Link to="/register" className="text-yellow-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
      {/* <Footer /> */}

      {/* Remove NotificationBanner or adapt if needed */}
      {/* {notification.message && ( ... )} */}
    </div>
  );
};

export default LoginPage;
