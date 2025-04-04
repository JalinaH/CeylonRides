// src/pages/Admin/AdminBookingList.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import { FaSpinner, FaExclamationCircle, FaEdit } from "react-icons/fa";

const AdminBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    };

    fetchBookings();
  }, [token]);

  const renderStatusBadge = (status) => {
    status = status?.toLowerCase() || "unknown";
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-200 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-yellow-400">
            Pending
          </span>
        );
      case "confirmed":
        return (
          <span className="bg-green-200 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-green-400">
            Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-200 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-red-400">
            Cancelled
          </span>
        );
      case "completed":
        return (
          <span className="bg-blue-200 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-blue-400">
            Completed
          </span>
        );
      default:
        return (
          <span className="bg-gray-200 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-400">
            Unknown
          </span>
        );
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    console.log(
      "Attempting to update status for booking:",
      bookingId,
      "to",
      newStatus
    );
    alert("Update status functionality not yet implemented.");
  };

  if (loading) {
    return (
      <div className="text-center p-10">
        <FaSpinner className="animate-spin text-4xl text-yellow-500 mx-auto" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center p-6 bg-red-900 bg-opacity-50 rounded">
        <FaExclamationCircle className="inline mr-2 text-red-400" />
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">
        Manage Bookings
      </h1>

      <div className="bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="border-b-2 border-gray-700 bg-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
              <th className="px-5 py-3">Booking ID</th>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Vehicle</th>
              <th className="px-5 py-3">Dates</th>
              <th className="px-5 py-3">Total Price</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-b border-gray-700 hover:bg-gray-750"
                >
                  <td className="px-5 py-4 text-sm">
                    <span title={booking._id} className="cursor-pointer">
                      {booking._id.substring(0, 8)}...
                    </span>{" "}
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <p className="whitespace-no-wrap font-medium">
                      {booking.userId?.username || "N/A"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {booking.userId?.email || booking.email}
                    </p>{" "}
                  </td>
                  <td className="px-5 py-4 text-sm">
                    {booking.vehicleId?.brand
                      ? `${booking.vehicleId.brand} ${booking.vehicleId.model}`
                      : booking.vehicleBrand || "N/A"}
                  </td>
                  <td className="px-5 py-4 text-sm">
                    {moment(booking.pickupDate).format("MMM D, YYYY")} -{" "}
                    {moment(booking.returnDate).format("MMM D, YYYY")}
                  </td>
                  <td className="px-5 py-4 text-sm">
                    ${booking.totalPrice?.toFixed(2) || "N/A"}
                  </td>
                  <td className="px-5 py-4 text-sm">
                    {renderStatusBadge(booking.bookingStatus)}
                  </td>
                  <td className="px-5 py-4 text-sm whitespace-no-wrap">
                    {booking.bookingStatus === "pending" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(booking._id, "confirmed")
                        }
                        title="Confirm Booking"
                        className="text-green-400 hover:text-green-300 mr-3 text-xs bg-green-900 bg-opacity-50 px-2 py-1 rounded"
                      >
                        Confirm
                      </button>
                    )}
                    {(booking.bookingStatus === "pending" ||
                      booking.bookingStatus === "confirmed") && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(booking._id, "cancelled")
                        }
                        title="Cancel Booking"
                        className="text-red-400 hover:text-red-300 text-xs bg-red-900 bg-opacity-50 px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookingList;
