import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaIdCard,
  FaCalendarAlt,
  FaSpinner,
  FaTimesCircle,
} from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import { IoLanguage } from "react-icons/io5";

const AdminDriverForm = () => {
  const { id: driverId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isEditing = Boolean(driverId);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
    experienceYears: 0,
    languages: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(isEditing);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (isEditing && token) {
      setLoadingDetails(true);
      setError(null);
      fetch(`${API_BASE_URL}/api/admin/drivers/${driverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch driver details");
          return res.json();
        })
        .then((data) => {
          setFormData({
            username: data.username || "",
            email: data.email || "",
            password: "",
            confirmPassword: "",
            phone: data.phone || "",
            licenseNumber: data.licenseNumber || "",
            licenseExpiry: data.licenseExpiry
              ? moment(data.licenseExpiry).format("YYYY-MM-DD")
              : "", // Format date for input
            experienceYears: data.experienceYears || 0,
            languages: (data.languages || []).join(", "),
          });
        })
        .catch((err) => setError(`Error loading driver: ${err.message}`))
        .finally(() => setLoadingDetails(false));
    }
  }, [driverId, isEditing, token]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.username || !formData.email) {
      setError("Username and Email are required.");
      setLoading(false);
      return;
    }
    if (!isEditing && !formData.password) {
      setError("Password is required for new drivers.");
      setLoading(false);
      return;
    }
    if (formData.password && formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (
      formData.password &&
      isEditing &&
      formData.password !== formData.confirmPassword
    ) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }
    if (!formData.licenseNumber) {
      setError("License number is required.");
      setLoading(false);
      return;
    }

    const apiData = {
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      licenseNumber: formData.licenseNumber,
      licenseExpiry: formData.licenseExpiry || null,
      experienceYears: Number(formData.experienceYears) || 0,
      languages: formData.languages
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l),
      role: "driver",
    };

    if (formData.password) {
      apiData.password = formData.password;
    }

    const url = isEditing
      ? `${API_BASE_URL}/api/admin/drivers/${driverId}`
      : `${API_BASE_URL}/api/admin/drivers`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Request failed");
      }

      alert(`Driver ${isEditing ? "updated" : "created"} successfully!`);
      navigate("/admin/drivers");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingDetails)
    return (
      <div className="text-center p-10">
        <FaSpinner className="animate-spin text-4xl text-yellow-500 mx-auto" />
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">
        {isEditing ? "Edit Driver Profile" : "Add New Driver"}
      </h1>
      {error && (
        <div
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300"
          role="alert"
        >
          <FaTimesCircle className="inline mr-2" /> Error: {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-gray-300">
              <FaUser className="inline mr-2" />
              Username*
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="form-input bg-gray-700"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">
              <FaEnvelope className="inline mr-2" />
              Email*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="form-input bg-gray-700"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">
              <FaPhone className="inline mr-2" />
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input bg-gray-700"
            />
          </div>
        </div>

        <fieldset className="border border-gray-700 p-3 rounded">
          <legend className="text-sm text-gray-400 px-2">
            {isEditing ? "Change Password (Optional)" : "Set Password*"}
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-300">
                <FaLock className="inline mr-2" />
                {isEditing ? "New Password" : "Password"}
                {!isEditing && "*"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!isEditing}
                minLength={6}
                className="form-input bg-gray-700"
                placeholder={
                  isEditing ? "Leave blank to keep current" : "Min 6 characters"
                }
              />
            </div>
            {(isEditing && formData.password) || !isEditing ? (
              <div>
                <label className="block mb-1 text-gray-300">
                  <FaLock className="inline mr-2" />
                  Confirm {!isEditing && "Password"}
                  {isEditing && "New Password"}*
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isEditing || !!formData.password}
                  minLength={6}
                  className="form-input bg-gray-700"
                  placeholder="Retype password"
                />
              </div>
            ) : null}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-gray-300">
              <FaIdCard className="inline mr-2" />
              License No.*
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              required
              className="form-input bg-gray-700"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">
              <FaCalendarAlt className="inline mr-2" />
              License Expiry
            </label>
            <input
              type="date"
              name="licenseExpiry"
              value={formData.licenseExpiry}
              onChange={handleInputChange}
              className="form-input bg-gray-700"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">
              <MdWorkHistory className="inline mr-2" />
              Experience (Yrs)
            </label>
            <input
              type="number"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleInputChange}
              min="0"
              className="form-input bg-gray-700"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 text-gray-300">
            <IoLanguage className="inline mr-2" />
            Languages
          </label>
          <input
            type="text"
            name="languages"
            value={formData.languages}
            onChange={handleInputChange}
            className="form-input bg-gray-700"
            placeholder="e.g., English, Sinhala"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/drivers")}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading && (
              <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
            )}
            {isEditing ? "Update Driver" : "Create Driver"}
          </button>
        </div>
      </form>
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

export default AdminDriverForm;
