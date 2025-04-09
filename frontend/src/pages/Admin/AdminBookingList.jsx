import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import { FaSpinner, FaExclamationCircle, FaUserEdit } from "react-icons/fa";

const AdminBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const [availableDrivers, setAvailableDrivers] = useState({});
  const [selectedDriver, setSelectedDriver] = useState({});
  const [loadingDrivers, setLoadingDrivers] = useState({});
  const [updateError, setUpdateError] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_TARGET_URL;

  const fetchBookings = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch bookings");
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

  const fetchAvailableDrivers = async (bookingId, startDate, endDate) => {
    if (!startDate || !endDate) {
      console.error(
        "Dates missing for fetching drivers for booking:",
        bookingId
      );
      setUpdateError((prev) => ({
        ...prev,
        [bookingId]: "Booking date info missing.",
      }));
      return;
    }
    setLoadingDrivers((prev) => ({ ...prev, [bookingId]: true }));
    setUpdateError((prev) => ({ ...prev, [bookingId]: null })); // Clear previous error
    try {
      const query = new URLSearchParams({
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
      }).toString();

      const response = await fetch(
        `${API_BASE_URL}/api/admin/drivers/available?${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to fetch available drivers");
      }
      const drivers = await response.json();
      setAvailableDrivers((prev) => ({ ...prev, [bookingId]: drivers }));
    } catch (err) {
      console.error(`Error fetching drivers for booking ${bookingId}:`, err);
      setUpdateError((prev) => ({ ...prev, [bookingId]: err.message }));
      setAvailableDrivers((prev) => ({ ...prev, [bookingId]: [] })); // Clear drivers on error
    } finally {
      setLoadingDrivers((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleDriverSelectionChange = (bookingId, driverId) => {
    setSelectedDriver((prev) => ({ ...prev, [bookingId]: driverId }));
    setUpdateError((prev) => ({ ...prev, [bookingId]: null })); // Clear error on selection change
  };

  const handleConfirmBooking = async (bookingId, isSelfDrive = false) => {
    let driverIdToAssign = null;

    if (!isSelfDrive) {
      driverIdToAssign = selectedDriver[bookingId];
      if (!driverIdToAssign) {
        setUpdateError((prev) => ({
          ...prev,
          [bookingId]: "Please select a driver first.",
        }));
        return;
      }
    }

    setUpdateError((prev) => ({ ...prev, [bookingId]: null }));

    try {
      const payload = {
        status: "confirmed",
        ...(driverIdToAssign && { driverId: driverIdToAssign }),
      };

      const response = await fetch(
        `${API_BASE_URL}/api/admin/bookings/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to confirm booking");
      }

      alert("Booking confirmed successfully!");
      fetchBookings();
      setSelectedDriver((prev) => ({ ...prev, [bookingId]: undefined }));
      setAvailableDrivers((prev) => ({ ...prev, [bookingId]: undefined }));
    } catch (err) {
      console.error(`Error confirming booking ${bookingId}:`, err);
      setUpdateError((prev) => ({ ...prev, [bookingId]: err.message }));
    } finally {
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setUpdateError((prev) => ({ ...prev, [bookingId]: null }));

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/bookings/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "cancelled",
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to cancel booking");
      }

      alert("Booking cancelled successfully!");
      fetchBookings();
    } catch (err) {
      console.error(`Error cancelling booking ${bookingId}:`, err);
      setUpdateError((prev) => ({ ...prev, [bookingId]: err.message }));
    } finally {
    }
  };

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
        Error fetching bookings: {error}
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">
        Manage Bookings
      </h1>
      <div className="bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="border-b-2 border-gray-700 bg-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
              <th className="px-3 py-3">ID</th>
              <th className="px-3 py-3">User</th>
              <th className="px-3 py-3">Vehicle</th>
              <th className="px-3 py-3">Dates</th>
              <th className="px-3 py-3">Driver</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Actions</th>
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
                  className="border-b border-gray-700 hover:bg-gray-750 align-top"
                >
                  {" "}
                  <td className="px-3 py-4 text-sm">
                    <span title={booking._id} className="cursor-default">
                      {booking._id.substring(0, 6)}...
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm">
                    <p className="whitespace-no-wrap font-medium">
                      {booking.userId?.username || "N/A"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {booking.userId?.email || booking.email}
                    </p>
                  </td>
                  <td className="px-3 py-4 text-sm">
                    {booking.vehicleId?.brand
                      ? `${booking.vehicleId.brand} ${booking.vehicleId.model}`
                      : booking.vehicleBrand || "N/A"}
                  </td>
                  <td className="px-3 py-4 text-sm">
                    {moment(booking.pickupDate).format("DD/MM/YY")} -{" "}
                    {moment(booking.returnDate).format("DD/MM/YY")}
                  </td>
                  <td className="px-3 py-4 text-sm">
                    {booking.bookingStatus === "pending" &&
                    booking.driverOption === "withDriver" ? (
                      <div className="flex flex-col space-y-1 w-40">
                        {" "}
                        {loadingDrivers[booking._id] ? (
                          <FaSpinner className="animate-spin text-yellow-500" />
                        ) : availableDrivers[booking._id] === undefined ? (
                          <button
                            onClick={() =>
                              fetchAvailableDrivers(
                                booking._id,
                                booking.pickupDate,
                                booking.returnDate
                              )
                            }
                            className="text-xs text-blue-400 hover:underline"
                            title="Find available drivers for these dates"
                          >
                            Find Drivers...
                          </button>
                        ) : (
                          <select
                            value={selectedDriver[booking._id] || ""}
                            onChange={(e) =>
                              handleDriverSelectionChange(
                                booking._id,
                                e.target.value
                              )
                            }
                            className="text-xs bg-gray-700 border border-gray-600 rounded p-1 w-full"
                            disabled={!availableDrivers[booking._id]?.length}
                          >
                            <option value="">
                              {availableDrivers[booking._id]?.length
                                ? "Select Driver"
                                : "No Drivers Available"}
                            </option>
                            {availableDrivers[booking._id]?.map((driver) => (
                              <option key={driver._id} value={driver._id}>
                                {driver.username}
                              </option>
                            ))}
                          </select>
                        )}
                        {updateError[booking._id] && (
                          <p className="text-red-500 text-xs mt-1">
                            {updateError[booking._id]}
                          </p>
                        )}
                      </div>
                    ) : booking.driverId ? (
                      <span>
                        {booking.driverId?.username ||
                          booking.driverId?.toString().substring(0, 6) +
                            "..." ||
                          "N/A"}
                      </span>
                    ) : booking.driverOption === "selfDrive" ? (
                      <span className="text-xs italic text-gray-500">
                        Self-Drive
                      </span>
                    ) : (
                      <span className="text-xs italic text-gray-500">
                        Not Assigned
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-sm">
                    {renderStatusBadge(booking.bookingStatus)}
                  </td>
                  <td className="px-3 py-4 text-sm whitespace-nowrap">
                    {booking.bookingStatus === "pending" &&
                      booking.driverOption === "withDriver" && (
                        <button
                          onClick={() => handleConfirmBooking(booking._id)}
                          disabled={
                            !selectedDriver[booking._id] ||
                            loadingDrivers[booking._id]
                          }
                          title="Assign selected driver and confirm"
                          className={`text-xs px-2 py-1 rounded transition ${
                            selectedDriver[booking._id]
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-gray-600 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Confirm
                        </button>
                      )}
                    {booking.bookingStatus === "pending" &&
                      booking.driverOption === "selfDrive" && (
                        <button
                          onClick={() => handleConfirmBooking(booking._id)}
                          title="Confirm Self-Drive Booking"
                          className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition"
                        >
                          Confirm SD
                        </button>
                      )}
                    {(booking.bookingStatus === "pending" ||
                      booking.bookingStatus === "confirmed") && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        title="Cancel Booking"
                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition ml-1"
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
