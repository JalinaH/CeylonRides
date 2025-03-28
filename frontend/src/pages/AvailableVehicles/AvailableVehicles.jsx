import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const AvailableVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // AvailableVehicles.jsx
    const fetchVehicles = async () => {
      setLoading(true); // Set loading true at the start
      setError(null);
      try {
        const queryParams = new URLSearchParams(location.search);
        const pickupDate = queryParams.get("pickupDate");
        const returnDate = queryParams.get("returnDate");
        const vehicleType = queryParams.get("vehicleType");

        if (!pickupDate || !returnDate) {
          throw new Error("Both pickup and return dates are required");
        }

        let url = `/api/vehicles/available?pickupDate=${encodeURIComponent(
          pickupDate
        )}&returnDate=${encodeURIComponent(returnDate)}`;
        if (vehicleType && vehicleType !== "Any Vehicle") {
          // Added check for 'Any Vehicle'
          url += `&vehicleType=${encodeURIComponent(vehicleType)}`;
        }
        console.log("Fetching URL:", url); // Add this line for debugging
        const response = await fetch(url);

        if (!response.ok) {
          // Try to get text content first to see the HTML error
          const errorText = await response.text();
          console.error("Non-OK response body:", errorText);
          // Try parsing as JSON *if* header indicates it, otherwise use text
          let errorData = {};
          try {
            if (
              response.headers.get("content-type")?.includes("application/json")
            ) {
              errorData = JSON.parse(errorText); // Manually parse if needed after logging
            }
          } catch (parseError) {
            console.error(
              "Could not parse error response as JSON:",
              parseError
            );
          }
          throw new Error(
            errorData.error ||
              errorData.message ||
              `HTTP error! Status: ${
                response.status
              }. Response: ${errorText.substring(0, 100)}...` // Show snippet of HTML
          );
        }

        const data = await response.json(); // Only parse as JSON if response.ok
        setVehicles(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message || "An unknown error occurred"); // Ensure error is a string
        setVehicles([]);
      } finally {
        setLoading(false); // <<< Make sure loading is set to false here
      }
    };

    fetchVehicles();
  }, [location.search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {vehicles.length > 0 ? "Available Vehicles" : "No Vehicles Available"}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Link
              to={`/vehicles/${vehicle._id}`}
              key={vehicle._id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <img
                src={vehicle.image}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold">
                  {vehicle.brand} {vehicle.model}
                </h2>
                <p className="text-gray-300">{vehicle.type}</p>
                <p className="text-gray-300">
                  Seats: {vehicle.seatingCapacity}
                </p>
                <p className="text-gray-300">
                  ${vehicle.pricingDetails.perDay}/day
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AvailableVehicles;
