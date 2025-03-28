import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaClock, FaUsers,
  FaMapMarkerAlt, FaCar, FaInfoCircle, FaDollarSign,
} from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import moment from "moment";
import { useAuth } from "../../context/AuthContext"; // Import useAuth

const DRIVER_COST_PER_DAY = 50;

const BookingPage = () => {
  const { id: vehicleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // Get authenticated user

  // ... (vehicle, loading, error, formErrors, totalPrice states remain the same) ...
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true); // For vehicle fetch + booking submit
  const [submitError, setSubmitError] = useState(null); // Specific error for submission
  const [formErrors, setFormErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);


  const [formData, setFormData] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    // Pre-fill name and email if user is logged in
    return {
      name: user?.username || "", // Use user's username
      email: user?.email || "", // Use user's email
      phone: "", // Keep phone separate unless stored in user profile
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

  // --- Fetch Vehicle Details (useEffect remains the same) ---
   useEffect(() => {
      // ... (fetch vehicle logic - no changes needed here) ...
        setLoading(true);
        const fetchUrl = `/api/vehicles/${vehicleId}`;
        fetch(fetchUrl)
          .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch vehicle details");
            return response.json();
          })
          .then((data) => { setVehicle(data); setSubmitError(null); })
          .catch((err) => { console.error("Error fetching vehicle:", err); setSubmitError(err.message || "Could not load vehicle data."); setVehicle(null); })
          .finally(() => { setLoading(false); });
    }, [vehicleId]);


  // --- Recalculate Price (useEffect remains the same) ---
  useEffect(() => {
    // ... (price calculation logic - no changes needed here) ...
    if (vehicle && formData.pickupDate && formData.returnDate) {
        try {
            const start = moment(`${formData.pickupDate} ${formData.pickupTime || "00:00"}`);
            const end = moment(`${formData.returnDate} ${formData.returnTime || "23:59"}`);
            if (!start.isValid() || !end.isValid() || end.isBefore(start)) { setTotalPrice(0); return; }
            const durationDays = Math.ceil(end.diff(start, "days", true));
            const calculatedDays = durationDays <= 0 ? 1 : durationDays;
            let price = calculatedDays * vehicle.pricingDetails.perDay;
            if (formData.driverOption === "withDriver") { price += calculatedDays * DRIVER_COST_PER_DAY; }
            setTotalPrice(price);
        } catch (calcError) { console.error("Price calculation error:", calcError); setTotalPrice(0); }
    } else { setTotalPrice(0); }
  }, [vehicle, formData.pickupDate, formData.pickupTime, formData.returnDate, formData.returnTime, formData.driverOption]);

  // --- Handle Input Change (remains the same) ---
   const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: type === "checkbox" ? checked : value }));
        if (formErrors[name]) { setFormErrors((prevErrors) => ({ ...prevErrors, [name]: null })); }
   };

  // --- Validate Form (remains the same) ---
   const validateForm = () => {
        // ... (validation logic - no changes needed here) ...
         const errors = {};
        if (!formData.name.trim()) errors.name = "Name is required";
        if (!formData.email.trim()) errors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
        if (!formData.phone.trim()) errors.phone = "Phone number is required";
        if (!formData.pickupDate) errors.pickupDate = "Pickup date is required";
        if (!formData.pickupTime) errors.pickupTime = "Pickup time is required";
        if (!formData.returnDate) errors.returnDate = "Return date is required";
        if (!formData.returnTime) errors.returnTime = "Return time is required";
        if (!formData.pickupPoint.trim()) errors.pickupPoint = "Pickup point is required";
        if (!formData.returnPoint.trim()) errors.returnPoint = "Return point is required";
        if (formData.numTourists < 1) errors.numTourists = "At least 1 tourist";
         if (formData.pickupDate && formData.returnDate) {
             const start = moment(`${formData.pickupDate} ${formData.pickupTime || "00:00"}`);
             const end = moment(`${formData.returnDate} ${formData.returnTime || "23:59"}`);
             if (!start.isValid() || !end.isValid()) { errors.pickupDate = "Invalid date/time format"; }
             else if (end.isBefore(start)) { errors.returnDate = "Return date/time must be after pickup"; }
         }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
   };

  // --- Handle Form Submit (Update to include userId) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("Form validation failed", formErrors);
      return;
    }

    if (!vehicle) {
      setSubmitError("Vehicle details not loaded. Cannot submit booking.");
      return;
    }
    if (!user) { // Ensure user is logged in before submitting
        setSubmitError("You must be logged in to book.");
        // Optionally redirect to login: navigate('/login', { state: { from: location } });
        return;
    }

    setLoading(true); // Use the general loading state for submission
    setSubmitError(null);

    const bookingData = {
      ...formData,
      userId: user._id, // <<< Add the logged-in user's ID
      vehicleId: vehicle._id,
      vehicleBrand: vehicle.brand,
      vehicleModel: vehicle.model,
      totalPrice: totalPrice,
      bookingStatus: 'pending',
    };

    try {
      const submitUrl = `/api/bookings`;
      const response = await fetch(submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include Authorization header if your booking endpoint requires it
          // 'Authorization': `Bearer ${token}` // Get token from useAuth() if needed
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Booking failed: ${response.statusText}`);
      }

      console.log("Booking successful:", result);
      navigate(`/booking-confirmation/${result._id}`, { state: { bookingDetails: result } });

    } catch (err) {
      console.error("Booking submission error:", err);
      setSubmitError(err.message || "An unexpected error occurred during booking.");
       setLoading(false); // Stop loading indicator on error
    }
     // setLoading will be implicitly false on navigation success
  };

  // --- Render Logic ---
  // Add check for auth loading state if needed
    // if (authLoading || (loading && !vehicle)) { ... }

   if (loading && !vehicle) {
        return ( <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        Loading Vehicle Details...
      </div>);
    }

   if (submitError && !vehicle) { // Error fetching vehicle initially
        return ( <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto p-6 text-center">
          <h1 className="text-2xl text-red-500">Error Loading Vehicle</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-yellow-500 text-gray-900 px-4 py-2 rounded hover:bg-yellow-600"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </div> );
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
              src={vehicle.image || "https://via.placeholder.com/150"} // Placeholder image
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

        {/* Display SUBMISSION errors here */}
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
          {/* --- User Details --- */}
          <fieldset className="mb-6 border border-gray-700 p-4 rounded-md">
            <legend className="text-xl font-semibold mb-4 px-2 text-gray-200">
              Your Details
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name - Potentially read-only if logged in */}
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
                  // readOnly={!!user} // Make read-only if logged in? User choice.
                  // className={`w-full p-3 bg-gray-700 rounded-lg text-white ${formErrors.name ? 'border border-red-500' : 'border border-gray-600'} ${!!user ? 'bg-gray-600 cursor-not-allowed' : ''}`}
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
              {/* Email - Potentially read-only if logged in */}
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
                  // readOnly={!!user} // Make read-only if logged in? User choice.
                  // className={`w-full p-3 bg-gray-700 rounded-lg text-white ${formErrors.email ? 'border border-red-500' : 'border border-gray-600'} ${!!user ? 'bg-gray-600 cursor-not-allowed' : ''}`}
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
              {/* Phone */}
              <div>
                {/* ... phone input ... */}
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

          {/* --- Booking Details (No changes needed here) --- */}
          <fieldset className="mb-6 border border-gray-700 p-4 rounded-md">
            {/* ... pickup/return points, dates, times ... */}
          </fieldset>

          {/* --- Options (No changes needed here) --- */}
          <fieldset className="mb-6 border border-gray-700 p-4 rounded-md">
            {/* ... num tourists, driver option, special requests ... */}
          </fieldset>

          {/* --- Price & Submit --- */}
          <div className="mt-6 p-4 bg-gray-900 rounded-lg text-center">
            {/* ... price display ... */}
          </div>

          <button
            type="submit"
            disabled={loading} // Disable button while fetching vehicle OR submitting booking
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