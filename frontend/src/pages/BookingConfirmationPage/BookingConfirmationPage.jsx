import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaMapMarkerAlt,
  FaCar,
  FaInfoCircle,
  FaDollarSign,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [bookingData, setBookingData] = useState(
    location.state?.bookingData || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [finalBookingId, setFinalBookingId] = useState(null);

  useEffect(() => {
    if (!bookingData) {
      console.error("Booking data missing. Redirecting...");
      navigate("/");
    }
  }, [bookingData, navigate]);

  const handleConfirmBooking = async () => {
    if (!bookingData || success) return;

    if (!token) {
      setError("Authentication error. Please log in again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const API_BASE_URL = import.meta.env.VITE_API_TARGET_URL;

    try {
      const submitUrl = `${API_BASE_URL}/api/bookings`;
      const response = await fetch(submitUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: bookingData.userId,
          vehicleId: bookingData.vehicleId,
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          pickupDate: bookingData.pickupDate,
          pickupTime: bookingData.pickupTime,
          returnDate: bookingData.returnDate,
          returnTime: bookingData.returnTime,
          pickupPoint: bookingData.pickupPoint,
          returnPoint: bookingData.returnPoint,
          numTourists: bookingData.numTourists,
          driverOption: bookingData.driverOption,
          specialRequests: bookingData.specialRequests,
          totalPrice: bookingData.totalPrice,
          vehicleBrand: bookingData.vehicleBrand,
          vehicleModel: bookingData.vehicleModel,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(
            result.error ||
              "Vehicle is no longer available for the selected dates. Please try again."
          );
        }
        throw new Error(
          result.error || `Booking confirmation failed: ${response.statusText}`
        );
      }

      console.log("Booking Confirmed and Saved:", result);
      setSuccess(true);
      setFinalBookingId(result._id);

      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (err) {
      console.error("Booking confirmation error:", err);
      setError(
        err.message ||
          "An unexpected error occurred while confirming the booking."
      );
      setIsLoading(false);
    }
  };

  if (!bookingData && !error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto p-6 text-center">
          Loading confirmation details...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto p-6 max-w-3xl">
        {" "}
        {success ? (
          <div className="bg-green-800 bg-opacity-90 p-8 rounded-lg shadow-lg text-center">
            <FaCheckCircle className="text-5xl text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">
              Booking Request Submitted!
            </h1>
            <p className="text-lg mb-2">Thank you, {bookingData?.name}!</p>
            <p className="mb-4">
              Your booking request for the{" "}
              <span className="font-semibold">
                {bookingData?.vehicleBrand} {bookingData?.vehicleModel}
              </span>{" "}
              has been received.
            </p>
            {finalBookingId && (
              <p className="mb-4">
                Booking Reference ID:{" "}
                <strong className="text-yellow-400">{finalBookingId}</strong>
              </p>
            )}
            <p className="text-gray-300 mb-6">
              We will review the availability and contact you via email (
              {bookingData?.email}) or phone ({bookingData?.phone}) shortly to
              confirm.
            </p>
            <p className="text-sm text-gray-400">Redirecting to homepage...</p>
          </div>
        ) : (
          <div className="bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-yellow-500">
              Confirm Your Booking
            </h1>

            {error && (
              <div className="bg-red-800 text-white p-3 rounded-md mb-6 text-center flex items-center justify-center gap-2">
                <FaTimesCircle /> {error}
              </div>
            )}

            <div className="mb-6 border-b border-gray-700 pb-4 flex items-center gap-4">
              <img
                src={
                  bookingData.vehicleImage || "https://via.placeholder.com/100"
                }
                alt={`${bookingData.vehicleBrand} ${bookingData.vehicleModel}`}
                className="w-24 h-16 object-cover rounded"
              />
              <div>
                <h2 className="text-xl font-semibold">
                  {bookingData.vehicleBrand} {bookingData.vehicleModel}
                </h2>
                <p className="text-sm text-gray-400">
                  {bookingData.vehicleType} - Seats: {bookingData.vehicleSeats}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-gray-300">
              <div className="flex items-center">
                <FaUser className="mr-3 text-yellow-500" />{" "}
                <strong>Name:</strong> {bookingData.name}
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-3 text-yellow-500" />{" "}
                <strong>Email:</strong> {bookingData.email}
              </div>
              <div className="flex items-center">
                <FaPhone className="mr-3 text-yellow-500" />{" "}
                <strong>Phone:</strong> {bookingData.phone}
              </div>
              <div className="flex items-center">
                <FaUsers className="mr-3 text-yellow-500" />{" "}
                <strong>Tourists:</strong> {bookingData.numTourists}
              </div>
              <div className="flex items-start col-span-1 md:col-span-2">
                <FaMapMarkerAlt className="mr-3 text-yellow-500 mt-1" />{" "}
                <strong>Pickup:</strong> {bookingData.pickupPoint}
              </div>
              <div className="flex items-start col-span-1 md:col-span-2">
                <FaMapMarkerAlt className="mr-3 text-yellow-500 mt-1" />{" "}
                <strong>Return:</strong> {bookingData.returnPoint}
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="mr-3 text-yellow-500" />{" "}
                <strong>From:</strong> 
                {moment(bookingData.pickupDate).format("LL")} at{" "}
                {bookingData.pickupTime}
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="mr-3 text-yellow-500" />{" "}
                <strong>To:</strong> 
                {moment(bookingData.returnDate).format("LL")} at{" "}
                {bookingData.returnTime}
              </div>
              <div className="flex items-center">
                <FaCar className="mr-3 text-yellow-500" />{" "}
                <strong>Driver:</strong> 
                {bookingData.driverOption === "withDriver"
                  ? "With Driver"
                  : "Self-Drive"}
              </div>
              {bookingData.specialRequests && (
                <div className="flex items-start col-span-1 md:col-span-2">
                  <FaInfoCircle className="mr-3 text-yellow-500 mt-1" />{" "}
                  <strong>Requests:</strong> {bookingData.specialRequests}
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-gray-900 rounded-lg text-center mb-8">
              <p className="text-2xl font-bold text-yellow-500 flex items-center justify-center">
                <FaDollarSign className="mr-2" /> Estimated Total: $
                {bookingData.totalPrice?.toFixed(2)}
              </p>
              {bookingData.driverOption === "withDriver" && (
                <p className="text-sm text-gray-400 mt-1">
                  (Includes driver cost)
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                Back to Edit
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isLoading}
                className={`bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Submitting..." : "Confirm & Submit Request"}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingConfirmationPage;
