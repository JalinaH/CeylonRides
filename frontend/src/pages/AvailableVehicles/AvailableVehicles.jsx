import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const AvailableVehicles = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // Fetch available vehicles from the backend
    fetch("http://localhost:5001/api/vehicles")
      .then((response) => response.json())
      .then((data) => setVehicles(data))
      .catch((error) => console.error("Error fetching vehicles:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Available Vehicles
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
