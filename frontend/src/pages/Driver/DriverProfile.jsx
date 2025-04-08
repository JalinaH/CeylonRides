import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import {
  FaSpinner,
  FaExclamationCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaCalendarAlt,
  FaSave,
} from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import { IoLanguage } from "react-icons/io5";

const DriverProfilePage = () => {
  const { user, token, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
    experienceYears: 0,
    languages: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setError("Authentication required.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/drivers/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to fetch profile");
      }
      const data = await response.json();
      setFormData({
        username: data.username || "",
        email: data.email || "",
        phone: data.phone || "",
        licenseNumber: data.licenseNumber || "",
        licenseExpiry: data.licenseExpiry
          ? moment(data.licenseExpiry).format("YYYY-MM-DD")
          : "",
        experienceYears: data.experienceYears || 0,
        languages: (data.languages || []).join(", "),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    const updateData = {
      username: formData.username,
      phone: formData.phone,
      licenseNumber: formData.licenseNumber,
      licenseExpiry: formData.licenseExpiry || null,
      experienceYears: Number(formData.experienceYears) || 0,
      languages: formData.languages
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l),
    };

    try {
      const response = await fetch("/api/drivers/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile");
      }

      setUpdateSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center p-10">
        <FaSpinner className="animate-spin text-4xl text-yellow-500 mx-auto" />
      </div>
    );
  if (error)
    return (
      <div className="text-center p-6 bg-red-900 bg-opacity-50 rounded">
        <FaExclamationCircle className="inline mr-2 text-red-400" />
        Error: {error}
      </div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-500">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setUpdateSuccess(null);
              setUpdateError(null);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Edit Profile
          </button>
        )}
      </div>

      {updateSuccess && (
        <div
          className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-300"
          role="alert"
        >
          {updateSuccess}
        </div>
      )}
      {updateError && (
        <div
          className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300"
          role="alert"
        >
          Error: {updateError}
        </div>
      )}

      <form
        onSubmit={handleUpdateProfile}
        className="bg-gray-800 p-6 rounded-lg shadow space-y-4"
      >
        <fieldset disabled={!isEditing}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="profile-label">
                <FaUser className="profile-icon" />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="profile-input"
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="profile-label">
                <FaEnvelope className="profile-icon" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="profile-input bg-gray-600 cursor-not-allowed"
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="profile-label">
              <FaPhone className="profile-icon" />
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="profile-input"
              readOnly={!isEditing}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="profile-label">
                <FaIdCard className="profile-icon" />
                License Number
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                required={isEditing}
                className="profile-input"
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="profile-label">
                <FaCalendarAlt className="profile-icon" />
                License Expiry
              </label>
              <input
                type="date"
                name="licenseExpiry"
                value={formData.licenseExpiry}
                onChange={handleInputChange}
                className="profile-input"
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="profile-label">
                <MdWorkHistory className="profile-icon" />
                Experience (Years)
              </label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleInputChange}
                min="0"
                className="profile-input"
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="profile-label">
                <IoLanguage className="profile-icon" />
                Languages
              </label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleInputChange}
                className="profile-input"
                placeholder="e.g., English, Sinhala"
                readOnly={!isEditing}
              />
            </div>
          </div>
        </fieldset>

        {isEditing && (
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-700">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                fetchProfile();
              }}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateLoading}
              className={`inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition ${
                updateLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {updateLoading && (
                <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
              )}
              <FaSave className="mr-2" /> Save Changes
            </button>
          </div>
        )}
      </form>
      <style jsx>{`
        .profile-label {
          display: block;
          margin-bottom: 0.25rem;
          color: #d1d5db;
          font-size: 0.875rem;
        }
        .profile-icon {
          display: inline;
          margin-right: 0.5rem;
          color: #f59e0b;
        }
        .profile-input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.375rem;
          color: white;
          border: 1px solid #4b5563;
          background-color: #374151;
          transition: border-color 0.2s;
        }
        .profile-input:read-only {
          background-color: #4b5563;
          cursor: default;
        }
        .profile-input:not(:read-only):focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.5);
        }
        fieldset:disabled .profile-input {
          background-color: #4b5563;
          cursor: default;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default DriverProfilePage;
