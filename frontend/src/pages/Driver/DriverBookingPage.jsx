import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import {
  FaSpinner,
  FaExclamationCircle,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaCar,
} from "react-icons/fa";

const DriverBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchBookings = useCallback(async () => {
    if (!token) {
      setError("Authentication required.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/drivers/my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.error || `Failed to fetch bookings: ${response.statusText}`
        );
      }
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setError(null);
    try {
      const response = await fetch(
        `/api/drivers/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `Failed to update status: ${response.statusText}`
        );
      }

      fetchBookings();
    } catch (err) {
      console.error("Status update error:", err);
      setError(`Failed to update status: ${err.message}`);
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
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">
        My Schedule / Assigned Bookings
      </h1>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">
          You have no active or upcoming assigned bookings.
        </p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-800 p-4 rounded-lg shadow"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 border-b border-gray-700 pb-2">
                <div>
                  <span className="font-semibold text-lg text-white">
                    {booking.vehicleId?.brand}{" "}
                    {booking.vehicleId?.model || booking.vehicleBrand}
                  </span>
                  <span className="text-sm text-gray-400 ml-2">
                    ({booking.vehicleId?.type || "Vehicle"})
                  </span>
                </div>
                <span
                  className={`text-sm font-medium px-2 py-0.5 rounded ${
                    booking.bookingStatus === "confirmed"
                      ? "bg-blue-600 text-blue-100"
                      : booking.bookingStatus === "picked_up"
                      ? "bg-yellow-600 text-yellow-100"
                      : booking.bookingStatus === "en_route"
                      ? "bg-orange-600 text-orange-100"
                      : "bg-gray-600 text-gray-100"
                  }`}
                >
                  {booking.bookingStatus?.replace("_", " ").toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-300 mb-4">
                <p className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-yellow-500 w-4" />{" "}
                  {moment(booking.pickupDate).format("ddd, MMM D, YYYY")}
                </p>
                <p className="flex items-center">
                  <FaClock className="mr-2 text-yellow-500 w-4" />{" "}
                  {booking.pickupTime} to {booking.returnTime}
                </p>
                <p className="flex items-center col-span-1 md:col-span-2">
                  <FaMapMarkerAlt className="mr-2 text-yellow-500 w-4" /> From:{" "}
                  {booking.pickupPoint}
                </p>
                <p className="flex items-center col-span-1 md:col-span-2">
                  <FaMapMarkerAlt className="mr-2 text-yellow-500 w-4" /> To:{" "}
                  {booking.returnPoint}
                </p>
                <p className="flex items-center">
                  <FaUser className="mr-2 text-yellow-500 w-4" /> Tourist:{" "}
                  {booking.userId?.username || booking.name}
                </p>
                <p className="flex items-center">
                  <FaPhone className="mr-2 text-yellow-500 w-4" /> Contact:{" "}
                  {booking.userId?.phone || booking.phone}
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-700">
                {booking.bookingStatus === "confirmed" && (
                  <button
                    onClick={() => handleStatusUpdate(booking._id, "picked_up")}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-3 rounded transition"
                  >
                    Mark Picked Up
                  </button>
                )}
                {booking.bookingStatus === "picked_up" && (
                  <button
                    onClick={() => handleStatusUpdate(booking._id, "en_route")}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold py-1 px-3 rounded transition"
                  >
                    Mark En Route
                  </button>
                )}
                {(booking.bookingStatus === "picked_up" ||
                  booking.bookingStatus === "en_route") && (
                  <button
                    onClick={() => handleStatusUpdate(booking._id, "completed")}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-1 px-3 rounded transition"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverBookingsPage;
