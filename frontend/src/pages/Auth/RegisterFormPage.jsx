import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaCar,
  FaCalendarAlt,
  FaIdCard,
} from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import { IoLanguage } from "react-icons/io5";

const RegisterFormPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const selectedRole = location.state?.selectedRole;

  useEffect(() => {
    if (!selectedRole) {
      console.warn("No role selected, redirecting to role selection.");
      navigate("/register");
    }
  }, [selectedRole, navigate]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
    experienceYears: 0,
    languages: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!formData.username.trim() || !formData.email.trim()) {
      setError("Username and Email are required.");
      return;
    }
    if (selectedRole === "driver") {
      if (!formData.licenseNumber.trim()) {
        setError("License number is required for drivers.");
        return;
      }
      if (!formData.phone.trim()) {
        setError("Phone number is required for drivers.");
        return;
      }
    }

    const registrationData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: selectedRole,
      phone: formData.phone,
      ...(selectedRole === "driver" && {
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formData.licenseExpiry || null,
        experienceYears: parseInt(formData.experienceYears, 10) || 0,
        languages: formData.languages
          .split(",")
          .map((lang) => lang.trim())
          .filter((lang) => lang),
      }),
    };

    const result = await register(registrationData);

    if (result.success) {
      alert(`Registration as ${selectedRole} successful! Please login.`);
      navigate("/login");
    } else {
      setError(result.error || "Registration failed. Please try again.");
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center py-12 px-4"
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

      <div className="relative z-10 bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-lg">
        {" "}
        <h2 className="text-3xl font-bold mb-6 text-center">
          Register as{" "}
          <span className="text-yellow-500 capitalize">{selectedRole}</span>
        </h2>
        {error && (
          <p className="bg-red-700 text-center text-white p-3 rounded mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {" "}
          <div>
            <label className="block mb-1">
              <span className="flex items-center">
                <FaUser className="mr-2" />
                Username*
              </span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label className="block mb-1">
              <span className="flex items-center">
                <FaEnvelope className="mr-2" />
                Email*
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label className="block mb-1">
              <span className="flex items-center">
                <FaPhone className="mr-2" />
                Phone {selectedRole === "driver" ? "*" : "(Optional)"}
              </span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required={selectedRole === "driver"}
              className="form-input"
              placeholder="Your contact number"
            />
          </div>
          <div>
            <label className="block mb-1">
              <span className="flex items-center">
                <FaLock className="mr-2" />
                Password*
              </span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
              className="form-input"
              placeholder="Create a secure password (min 6 chars)"
            />
          </div>
          {selectedRole === "driver" && (
            <>
              <hr className="border-gray-600 my-4" />
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">
                Driver Details
              </h3>
              <div>
                <label className="block mb-1">
                  <span className="flex items-center">
                    <FaIdCard className="mr-2" />
                    License Number*
                  </span>
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Your driving license number"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      License Expiry
                    </span>
                  </label>
                  <input
                    type="date"
                    name="licenseExpiry"
                    value={formData.licenseExpiry}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block mb-1">
                    <span className="flex items-center">
                      <MdWorkHistory className="mr-2" />
                      Years of Experience
                    </span>
                  </label>
                  <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                    min="0"
                    className="form-input"
                    placeholder="e.g., 5"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1">
                  <span className="flex items-center">
                    <IoLanguage className="mr-2" />
                    Languages Spoken
                  </span>
                </label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., English, Sinhala, Tamil (comma-separated)"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : `Register as ${selectedRole}`}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          <Link to="/register" className="text-yellow-500 hover:underline">
            Choose a different role
          </Link>
          {" | "}
          <Link to="/login" className="text-yellow-500 hover:underline">
            Already have an account? Login
          </Link>
        </p>
      </div>
      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 0.75rem;
          background-color: #4a5568; /* gray-700 */
          border-radius: 0.375rem; /* rounded-lg */
          color: white;
          border: 1px solid #718096; /* gray-600 */
          transition: border-color 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #f59e0b; /* yellow-500 */
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.5); /* ring-yellow-500 */
        }
      `}</style>
    </div>
  );
};

export default RegisterFormPage;
