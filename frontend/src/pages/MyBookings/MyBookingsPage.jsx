import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import {
  FaCalendarAlt,
  FaCar,
  FaDollarSign,
  FaSpinner,
  FaExclamationCircle,
  FaInfoCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); 

  const API_BASE_URL = import.meta.env.VITE_API_TARGET_URL;
  const apiUrl = `${API_BASE_URL}/api/bookings/my-bookings`;

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setError("Authentication required to view bookings.");
        setLoading(false);
        return; // Don't fetch if no token
      }

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching bookings from:", apiUrl);
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Handle specific auth errors
            throw new Error("Unauthorized. Please log in again.");
          }
          const errorData = await response.json().catch(() => ({})); // Try to parse error
          throw new Error(
            errorData.error ||
              `Failed to fetch bookings: ${response.statusText}`
          );
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(
          err.message || "An error occurred while fetching your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]); // Re-fetch if token changes (e.g., on login/logout)

  const renderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className="bg-yellow-600 text-yellow-100 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
            Pending
          </span>
        );
      case "confirmed":
        return (
          <span className="bg-green-600 text-green-100 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
            Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-600 text-red-100 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
            Cancelled
          </span>
        );
      case "completed":
        return (
          <span className="bg-blue-600 text-blue-100 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
            Completed
          </span>
        );
      default:
        return (
          <span className="bg-gray-600 text-gray-100 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
            Unknown
          </span>
        );
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center p-10">
          <FaSpinner className="animate-spin text-4xl text-yellow-500 mx-auto" />
          <p className="mt-4 text-gray-400">Loading your bookings...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-10 bg-red-900 bg-opacity-50 rounded-lg">
          <FaExclamationCircle className="text-4xl text-red-400 mx-auto mb-3" />
          <p className="text-red-400">Error: {error}</p>
          {error.includes("Unauthorized") && (
            <Link
              to="/login"
              className="mt-4 inline-block text-yellow-400 hover:underline"
            >
              Login Again
            </Link>
          )}
        </div>
      );
    }

    if (bookings.length === 0) {
      return (
        <div className="text-center p-10 bg-gray-800 bg-opacity-70 rounded-lg">
          <FaInfoCircle className="text-4xl text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">You have no bookings yet.</p>
          <Link
            to="/available-vehicles"
            className="mt-4 inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition"
          >
            Find a Vehicle
          </Link>
        </div>
      );
    }

    // --- Display Bookings ---
    return (
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-gray-800 p-5 rounded-lg shadow-lg flex flex-col md:flex-row gap-4 md:items-center"
          >
            {/* Basic Vehicle Info (Consider fetching image if needed) */}
            <div className="flex-shrink-0 w-full md:w-40 text-center md:text-left">
              <FaCar className="text-3xl text-yellow-500 mx-auto md:mx-0 mb-2" />
              <h3 className="text-lg font-semibold text-white">
                {booking.vehicleBrand} {booking.vehicleModel}
              </h3>
              {/* Optional: Vehicle Type */}
              {/* <p className="text-sm text-gray-400">{booking.vehicleType}</p> */}
            </div>

            <div className="flex-grow border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-400">
                  Booking ID: {booking._id}
                </p>
                {renderStatusBadge(booking.bookingStatus)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-300 mb-3">
                <p className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-yellow-500" />{" "}
                  <strong>Pickup:</strong>{" "}
                  {moment(booking.pickupDate).format("ddd, MMM D, YYYY")} at{" "}
                  {booking.pickupTime}
                </p>
                <p className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-yellow-500" />{" "}
                  <strong>Return:</strong>{" "}
                  {moment(booking.returnDate).format("ddd, MMM D, YYYY")} at{" "}
                  {booking.returnTime}
                </p>
                <p className="flex items-center col-span-1 sm:col-span-2">
                  <FaMapMarkerAlt className="mr-2 text-yellow-500" />{" "}
                  <strong>Location:</strong> {booking.pickupPoint}
                </p>
              </div>
              <div className="flex justify-between items-center border-t border-gray-700 pt-2">
                <p className="flex items-center text-sm">
                  <FaDollarSign className="mr-1 text-yellow-500" /> Est. Total:{" "}
                  <strong className="ml-1">
                    ${booking.totalPrice?.toFixed(2)}
                  </strong>
                </p>
                {/* Add Action Buttons (View Details, Cancel) Here */}
                <div className="space-x-2">
                  {/* <Link to={`/booking-details/${booking._id}`} className='text-xs text-blue-400 hover:underline'>Details</Link> */}
                  {/* Add Cancel button if status allows */}
                  {/* {booking.bookingStatus === 'pending' || booking.bookingStatus === 'confirmed' && (
                                          <button onClick={() => handleCancelBooking(booking._id)} className='text-xs text-red-400 hover:underline'>Cancel</button>
                                      )} */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      <div className="container mx-auto p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-center text-yellow-500">
          My Bookings
        </h1>
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
};

export default MyBookingsPage;
