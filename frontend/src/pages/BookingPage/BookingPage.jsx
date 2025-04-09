import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
} from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";

const DRIVER_COST_PER_DAY = 50;

const BookingPage = () => {
  const { id: vehicleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const [formData, setFormData] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    return {
      name: user?.username || "",
      email: user?.email || "",
      phone: "",
      pickupDate: queryParams.get("pickupDate") || "",
      pickupTime: queryParams.get("pickupTime") || "",
      returnDate: queryParams.get("returnDate") || "",
      returnTime: queryParams.get("returnTime") || "",
      pickupPoint: queryParams.get("pickupPoint") || "",
      returnPoint: queryParams.get("returnPoint") || "",
      numTourists: 1,
      driverOption: "withDriver",
      specialRequests: "",
    };
  });

  const API_BASE_URL = import.meta.env.VITE_API_TARGET_URL;

  useEffect(() => {
    setLoading(true);
    const fetchUrl = `${API_BASE_URL}/api/vehicles/${vehicleId}`;
    fetch(fetchUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch vehicle details");
        return response.json();
      })
      .then((data) => {
        setVehicle(data);
        setSubmitError(null);
      })
      .catch((err) => {
        console.error("Error fetching vehicle:", err);
        setSubmitError(err.message || "Could not load vehicle data.");
        setVehicle(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [vehicleId]);

  useEffect(() => {
    if (vehicle && formData.pickupDate && formData.returnDate) {
      try {
        const start = moment(
          `${formData.pickupDate} ${formData.pickupTime || "00:00"}`
        );
        const end = moment(
          `${formData.returnDate} ${formData.returnTime || "23:59"}`
        );
        if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
          setTotalPrice(0);
          return;
        }
        const durationDays = Math.ceil(end.diff(start, "days", true));
        const calculatedDays = durationDays <= 0 ? 1 : durationDays;
        let price = calculatedDays * vehicle.pricingDetails.perDay;
        if (formData.driverOption === "withDriver") {
          price += calculatedDays * DRIVER_COST_PER_DAY;
        }
        setTotalPrice(price);
      } catch (calcError) {
        console.error("Price calculation error:", calcError);
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [
    vehicle,
    formData.pickupDate,
    formData.pickupTime,
    formData.returnDate,
    formData.returnTime,
    formData.driverOption,
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.pickupDate) errors.pickupDate = "Pickup date is required";
    if (!formData.pickupTime) errors.pickupTime = "Pickup time is required";
    if (!formData.returnDate) errors.returnDate = "Return date is required";
    if (!formData.returnTime) errors.returnTime = "Return time is required";
    if (!formData.pickupPoint.trim())
      errors.pickupPoint = "Pickup point is required";
    if (!formData.returnPoint.trim())
      errors.returnPoint = "Return point is required";
    if (formData.numTourists < 1) errors.numTourists = "At least 1 tourist";
    if (formData.pickupDate && formData.returnDate) {
      const start = moment(
        `${formData.pickupDate} ${formData.pickupTime || "00:00"}`
      );
      const end = moment(
        `${formData.returnDate} ${formData.returnTime || "23:59"}`
      );
      if (!start.isValid() || !end.isValid()) {
        errors.pickupDate = "Invalid date/time format";
      } else if (end.isBefore(start)) {
        errors.returnDate = "Return date/time must be after pickup";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("Form validation failed", formErrors);
      return;
    }
    if (!vehicle) {
      setSubmitError("Vehicle details not loaded. Cannot proceed.");
      return;
    }
    if (!user) {
      setSubmitError("You must be logged in to book.");
      return;
    }
    setSubmitError(null);

    const bookingDetailsToConfirm = {
      ...formData,
      userId: user._id,
      vehicleId: vehicle._id,
      vehicleBrand: vehicle.brand,
      vehicleModel: vehicle.model,
      vehicleImage: vehicle.image,
      vehicleType: vehicle.type,
      vehicleSeats: vehicle.seatingCapacity,
      totalPrice: totalPrice,
    };

    navigate(`/booking-confirmation`, {
      state: { bookingData: bookingDetailsToConfirm },
    });
  };

  if (loading && !vehicle) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        Loading Vehicle Details...
      </div>
    );
  }

  if (submitError && !vehicle) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto p-6 text-center">
          <h1 className="text-2xl text-red-500">Error Loading Vehicle</h1>
          <p className="text-gray-300 mb-4">{submitError}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-yellow-500 text-gray-900 px-4 py-2 rounded hover:bg-yellow-600"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-500">
          Book Your Ride
        </h1>

        {vehicle && (
          <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row items-center gap-4">
            <img
              src={vehicle.image || "https://via.placeholder.com/150"}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-48 h-32 object-cover rounded-md flex-shrink-0"
            />
            <div>
              <h2 className="text-2xl font-semibold">
                {vehicle.brand} {vehicle.model}
              </h2>
              <p className="text-gray-300">{vehicle.type}</p>
              <p className="text-gray-300">Seats: {vehicle.seatingCapacity}</p>
            </div>
          </div>
        )}

        {submitError && (
          <div className="bg-red-800 text-white p-3 rounded-md mb-4 text-center">
            {submitError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg"
          noValidate
        >
          <fieldset className="mb-6 border border-gray-700 p-4 rounded-md">
            <legend className="text-xl font-semibold mb-4 px-2 text-gray-200">
              Your Details
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-gray-300">
                  <span className="flex items-center">
                    <FaUser className="mr-2" />
                    Name<span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-700 rounded-lg text-white ${
                    formErrors.name
                      ? "border border-red-500"
                      : "border border-gray-600"
                  }`}
                  required
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-gray-300">
                  <span className="flex items-center">
                    <FaEnvelope className="mr-2" />
                    Email<span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-700 rounded-lg text-white ${
                    formErrors.email
                      ? "border border-red-500"
                      : "border border-gray-600"
                  }`}
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-gray-300">
                  <span className="flex items-center">
                    <FaPhone className="mr-2" />
                    Phone<span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-700 rounded-lg text-white ${
                    formErrors.phone
                      ? "border border-red-500"
                      : "border border-gray-600"
                  }`}
                  required
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="mb-6 border border-gray-700 p-4 rounded-md">
            <legend className="text-xl font-semibold mb-4 px-2 text-gray-200">
              Booking Details
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-gray-300">
                  <span className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    Pickup Point<span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="pickupPoint"
                  value={formData.pickupPoint}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-700 rounded-lg text-white ${
                    formErrors.pickupPoint
                      ? "border border-red-500"
                      : "border border-gray-600"
                  }`}
                  required
                />
                {formErrors.pickupPoint && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.pickupPoint}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-gray-300">
                  <span className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    Return Point<span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="returnPoint"
                  value={formData.returnPoint}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-700 rounded-lg text-white ${
                    formErrors.returnPoint
                      ? "border border-red-500"
                      : "border border-gray-600"
                  }`}
                  required
                />
                {formErrors.returnPoint && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.returnPoint}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block mb-1 text-gray-300">
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    Pickup Date<span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-700 rounded-lg text-white ${
                    formErrors.pickupDate
                      ? "border border-red-500"
                      : "border border-gray-600"
                  }`}
                  required
                />
                {formErrors.pickupDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.pickupDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-gray-300">
                  <span className="flex items-center">
                    <FaClock className="mr-2" />
                    Pickup Time<span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <input
                  type="time"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-700 rounded-lg text-white ${
                    formErrors.pickupTime
                      ? "border border-red-500"
                      : "border border-gray-600"
                  }`}
                  required
                />
                {formErrors.pickupTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.pickupTime}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-gray-300">
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    Return Date<span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-700 rounded-lg text-white ${
                    formErrors.returnDate
                      ? "border border-red-500"
                      : "border border-gray-600"
                  }`}
                  required
                />
                {formErrors.returnDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.returnDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-gray-300">
                  <span className="flex items-center">
                    <FaClock className="mr-2" />
                    Return Time<span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <input
                  type="time"
                  name="returnTime"
                  value={formData.returnTime}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-700 rounded-lg text-white ${
                    formErrors.returnTime
                      ? "border border-red-500"
                      : "border border-gray-600"
                  }`}
                  required
                />
                {formErrors.returnTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.returnTime}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="mb-6 border border-gray-700 p-4 rounded-md">
            <legend className="text-xl font-semibold mb-4 px-2 text-gray-200">
              Options & Requests
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-gray-300">
                  <span className="flex items-center">
                    <FaUsers className="mr-2" />
                    Number of Tourists
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <input
                  type="number"
                  name="numTourists"
                  value={formData.numTourists}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full p-3 bg-gray-700 rounded-lg text-white ${
                    formErrors.numTourists
                      ? "border border-red-500"
                      : "border border-gray-600"
                  }`}
                  required
                />
                {formErrors.numTourists && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.numTourists}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-gray-300">
                  <span className="flex items-center">
                    <FaCar className="mr-2" />
                    Driver Option<span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <select
                  name="driverOption"
                  value={formData.driverOption}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-700 rounded-lg text-white border ${
                    formErrors.driverOption
                      ? "border-red-500"
                      : "border-gray-600"
                  }`}
                  required
                >
                  <option value="withDriver">With Driver</option>
                  <option value="selfDrive">Self-Drive</option>
                </select>
                {formErrors.driverOption && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.driverOption}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-300">
                <span className="flex items-center">
                  <FaInfoCircle className="mr-2" />
                  Special Requests (Optional)
                </span>
              </label>
              <textarea
                name="specialRequests"
                rows="3"
                value={formData.specialRequests}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600"
                placeholder="e.g., Child seat needed, specific route preferences"
              ></textarea>
            </div>
          </fieldset>

          <div className="mt-6 p-4 bg-gray-900 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-500 flex items-center justify-center">
              <FaDollarSign className="mr-2" /> Estimated Total: $
              {totalPrice.toFixed(2)}
            </p>
            {formData.driverOption === "withDriver" && (
              <p className="text-sm text-gray-400 mt-1">
                (Includes driver cost of ${DRIVER_COST_PER_DAY}/day)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-300 text-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Submit Booking Request"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;
