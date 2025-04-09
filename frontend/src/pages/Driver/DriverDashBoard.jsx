import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaSpinner,
  FaExclamationCircle,
  FaCalendarAlt,
  FaUserCircle,
  FaInfoCircle,
} from "react-icons/fa";

const DriverDashboard = () => {
  const { user, token } = useAuth();
  const [summary, setSummary] = useState({ activeBookings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_TARGET_URL;

  useEffect(() => {
    const fetchBookingSummary = async () => {
      if (!token) {
        setLoading(false);
        setError("Not authenticated");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/drivers/my-bookings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to fetch booking summary");
        }
        const bookingsData = await response.json();
        const activeCount = bookingsData.filter((b) =>
          ["confirmed", "picked_up", "en_route"].includes(
            b.bookingStatus?.toLowerCase()
          )
        ).length;

        setSummary({ activeBookings: activeCount });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingSummary();
  }, [token]);

  const renderSummary = () => {
    if (loading) {
      return <FaSpinner className="animate-spin text-xl text-yellow-500" />;
    }
    if (error) {
      return (
        <span className="text-red-400 text-sm">
          <FaExclamationCircle className="inline mr-1" /> Error loading summary
        </span>
      );
    }
    return (
      <p className="text-lg">
        You have{" "}
        <strong className="text-yellow-400">{summary.activeBookings}</strong>{" "}
        active or upcoming booking(s).
      </p>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">
        Driver Dashboard
      </h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Welcome, {user?.username || "Driver"}!
        </h2>
        <p className="text-gray-400">
          Here's a quick overview of your current activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <FaCalendarAlt className="mr-2 text-yellow-500" /> Active Schedule
            </h3>
            <div className="min-h-[40px]">{renderSummary()}</div>
          </div>
          <div className="mt-4 text-right">
            <Link
              to="/driver/bookings"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded transition text-sm"
            >
              View Full Schedule
            </Link>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <FaUserCircle className="mr-2 text-yellow-500" /> Your Profile
            </h3>
            <p className="text-gray-400 text-sm">
              Keep your contact and license information up to date.
            </p>
          </div>
          <div className="mt-4 text-right">
            <Link
              to="/driver/profile"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition text-sm"
            >
              View/Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
