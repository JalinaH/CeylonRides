import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import moment from "moment"; 

const AvailableVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageTitle, setPageTitle] = useState("Available Vehicles"); // State for dynamic title
  const location = useLocation();

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);
      setVehicles([]); // Clear previous results on new fetch

      try {
        const queryParams = new URLSearchParams(location.search);
        const pickupDate = queryParams.get("pickupDate");
        const returnDate = queryParams.get("returnDate");
        const vehicleType = queryParams.get("vehicleType");

        // --- Build API URL & Page Title Conditionally ---
        const apiParams = new URLSearchParams(); // Use URLSearchParams for clean parameter handling
        let title = "All Available Vehicles"; // Default title

        // Add valid dates to API params and update title
        // Basic check: ensure both dates exist. Backend handles deeper validation.
        if (pickupDate && returnDate) {
          const startMoment = moment(pickupDate);
          const endMoment = moment(returnDate);
          // Only add if dates seem valid and in order (optional frontend check)
          if (
            startMoment.isValid() &&
            endMoment.isValid() &&
            startMoment.isBefore(endMoment)
          ) {
            apiParams.append("pickupDate", pickupDate);
            apiParams.append("returnDate", returnDate);
            title = `Available Vehicles (${startMoment.format(
              "MMM D, YYYY"
            )} - ${endMoment.format("MMM D, YYYY")})`;
          } else {
            console.warn("Invalid dates in URL query, fetching all vehicles.");
          }
        }

        // Add vehicle type if specified
        if (vehicleType && vehicleType !== "Any Vehicle") {
          apiParams.append("vehicleType", vehicleType);
          // Append type to title
          if (title === "All Available Vehicles") {
            // If no dates were added
            title = `All Available ${vehicleType}s`;
          } else {
            // If dates were added
            title += ` - ${vehicleType}s`;
          }
        }

        setPageTitle(title); // Set the dynamic page title

        const queryString = apiParams.toString();
        const url = `/api/vehicles/available${
          queryString ? `?${queryString}` : ""
        }`; // Append params only if they exist

        // --- Fetch Data ---
        console.log("Fetching vehicles from:", url); // Useful for debugging
        const response = await fetch(url);

        if (!response.ok) {
          // Try to get JSON error if available
          const errorData = await response
            .json()
            .catch(() => ({ message: "Failed to parse error response" }));
          throw new Error(
            errorData.error ||
              errorData.message ||
              `HTTP error! Status: ${response.status}`
          );
        }

        const data = await response.json();
        setVehicles(data);
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        setError(fetchError.message);
        setVehicles([]); // Ensure vehicles are cleared on error
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [location.search]); // IMPORTANT: Re-run effect if query string changes

  // --- Render Logic ---
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center p-10 text-gray-400">
          Loading vehicles...
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center p-10 text-red-500">
          Error loading vehicles: {error}
        </div>
      );
    }
    if (vehicles.length === 0) {
      return (
        <div className="text-center p-10 text-gray-400">
          No vehicles match your criteria.
        </div>
      );
    }
    // --- Vehicle Grid ---
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {" "}
        {/* Added xl breakpoint */}
        {vehicles.map((vehicle) => (
          <Link
            // Pass relevant query params to vehicle profile? Or just ID is enough?
            // Let's keep it simple and just pass the ID. Profile page fetches details again.
            to={`/vehicles/${vehicle._id}`}
            key={vehicle._id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col" // Added flex col
          >
            <img
              src={
                vehicle.image ||
                "https://via.placeholder.com/300x200?text=No+Image"
              } // Placeholder
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-48 object-cover" // Fixed height for image consistency
            />
            <div className="p-4 flex flex-col flex-grow">
              {" "}
              {/* Added flex grow for content */}
              <h2
                className="text-xl font-semibold mb-1 text-white truncate"
                title={`${vehicle.brand} ${vehicle.model}`}
              >
                {" "}
                {/* Added truncate and title */}
                {vehicle.brand} {vehicle.model}
              </h2>
              <p className="text-sm text-gray-400 mb-2">{vehicle.type}</p>
              <div className="text-sm text-gray-300 mb-3">
                {" "}
                {/* Increased margin */}
                <span>Seats: {vehicle.seatingCapacity}</span>
                {/* Maybe add transmission or fuel type if available */}
                {/* <span className="ml-4">Transmission: {vehicle.transmission || 'N/A'}</span> */}
              </div>
              <div className="mt-auto pt-2 border-t border-gray-700">
                {" "}
                {/* Push price to bottom */}
                <p className="text-lg font-semibold text-yellow-500 text-right">
                  {" "}
                  {/* Right align price */}$
                  {vehicle.pricingDetails.perDay.toFixed(2)}{" "}
                  {/* Format price */}
                  <span className="text-xs font-normal text-gray-400">
                    / day
                  </span>
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      <div className="container mx-auto p-6 flex-grow">
        {/* Use the dynamic pageTitle state here */}
        <h1 className="text-3xl font-bold mb-8 text-center text-yellow-500">
          {pageTitle}
        </h1>
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
};

export default AvailableVehicles;
