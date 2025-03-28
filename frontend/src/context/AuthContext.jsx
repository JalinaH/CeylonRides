import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

// Define API base URL (adjust if needed)
const API_URL = "/api"; // Use relative path if proxy is configured
// const API_URL = 'http://localhost:5001/api'; // Use full path otherwise

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [loading, setLoading] = useState(true); // Check initial auth status
  const navigate = useNavigate();

  // Effect to load user data if token exists on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        console.log("Auth restored from localStorage");
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      }
    }
    setLoading(false); // Finished initial loading
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // IMPORTANT: Backend sends back { token, user }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user)); // Store user object
      console.log("Login successful", data.user);
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`, {
        // Assuming POST /api/users is for registration
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      console.log("Registration successful", data);
      setLoading(false);
      // Optionally log the user in directly after registration
      // await login(email, password);
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    console.log("User logged out");
    navigate("/"); // Navigate to home page after logout
  };

  const authContextValue = {
    user,
    token,
    loading, // Provide loading state
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy context consumption
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
