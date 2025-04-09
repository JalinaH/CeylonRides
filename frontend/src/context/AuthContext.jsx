import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

const API_URL = "/api";
const API_BASE_URL = import.meta.env.VITE_API_TARGET_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        console.log("Auth restored from localStorage for:", parsedUser.role);
      } catch (e) {
        console.error("Failed to parse stored user or token invalid", e);
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        setToken(null);
        setUser(null);
      }
    } else {
      setToken(null);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, fromPath = "/") => {
    setLoading(true);
    try {
      const loginUrl = `${API_BASE_URL}/api/users/login`;
      console.log("Attempting to login via:", loginUrl);
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      const loggedInUser = data.user;
      const receivedToken = data.token;

      setUser(loggedInUser);
      setToken(receivedToken);
      localStorage.setItem("authToken", receivedToken);
      localStorage.setItem("authUser", JSON.stringify(loggedInUser));
      console.log("Login successful for:", loggedInUser.role);

      let targetPath = fromPath;

      if (loggedInUser.role === "admin") {
        targetPath = "/admin/dashboard";
        console.log("Redirecting admin to:", targetPath);
      } else if (loggedInUser.role === "driver") {
        targetPath = "/driver/dashboard";
        console.log("Redirecting driver to:", targetPath);
      } else {
        if (targetPath === "/login") {
          targetPath = "/";
        }
        console.log("Redirecting tourist to:", targetPath);
      }

      navigate(targetPath, { replace: true });

      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      setUser(null);
      setToken(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const register = async (registrationData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.details) {
          throw new Error(`Validation failed: ${data.details.join(", ")}`);
        }
        throw new Error(data.error || "Registration failed");
      }

      console.log("Registration successful", data);
      setLoading(false);
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
    navigate("/");
  };

  const authContextValue = {
    user,
    token,
    loading,
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

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
