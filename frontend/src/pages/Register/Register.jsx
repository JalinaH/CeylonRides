import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!username.trim() || !email.trim()) {
      setError("Username and Email are required.");
      return;
    }

    const result = await register(username, email, password);

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-80 z-0"></div>

      <div className="relative z-10 bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-500">
          Register
        </h2>{" "}
        {error && (
          <p className="bg-red-700 text-center text-white p-3 rounded mb-4">
            {error}
          </p>
        )}{" "}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">
              <span className="flex items-center">
                <FaUser className="mr-2" />
                Username
              </span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none" // Added focus styles
              required
              placeholder="Choose a username"
            />
          </div>
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
              placeholder="Create a password (min 6 chars)"
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          {" "}
          Already have an account?
          <Link to="/login" className="text-yellow-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
