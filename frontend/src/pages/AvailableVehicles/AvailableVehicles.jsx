import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import moment from "moment";

const AvailableVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageTitle, setPageTitle] = useState("Available Vehicles");
  const location = useLocation();

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);
      setVehicles([]);

      try {
        const queryParams = new URLSearchParams(location.search);
        const pickupDate = queryParams.get("pickupDate");
        const returnDate = queryParams.get("returnDate");
        const vehicleType = queryParams.get("vehicleType");

        const apiParams = new URLSearchParams();
        let title = "All Available Vehicles";

        if (pickupDate && returnDate) {
          const startMoment = moment(pickupDate);
          const endMoment = moment(returnDate);
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

        if (vehicleType && vehicleType !== "Any Vehicle") {
          apiParams.append("vehicleType", vehicleType);
          if (title === "All Available Vehicles") {
            title = `All Available ${vehicleType}s`;
          } else {
            title += ` - ${vehicleType}s`;
          }
        }

        setPageTitle(title);

        const API_BASE_URL = import.meta.env.VITE_API_TARGET_URL;

        const queryString = apiParams.toString();
        const url = `${API_BASE_URL}/api/vehicles/available${
          queryString ? `?${queryString}` : ""
        }`;

        console.log("Fetching vehicles from:", url);
        const response = await fetch(url);

        if (!response.ok) {
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
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [location.search]);

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
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vehicles.map((vehicle) => (
          <Link
            to={`/vehicles/${vehicle._id}`}
            key={vehicle._id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col"
          >
            <img
              src={
                vehicle.image ||
                "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h2
                className="text-xl font-semibold mb-1 text-white truncate"
                title={`${vehicle.brand} ${vehicle.model}`}
              >
                {vehicle.brand} {vehicle.model}
              </h2>
              <p className="text-sm text-gray-400 mb-2">{vehicle.type}</p>
              <div className="text-sm text-gray-300 mb-3">
                <span>Seats: {vehicle.seatingCapacity}</span>
              </div>
              <div className="mt-auto pt-2 border-t border-gray-700">
                <p className="text-lg font-semibold text-yellow-500 text-right">
                  ${vehicle.pricingDetails.perDay.toFixed(2)}
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
