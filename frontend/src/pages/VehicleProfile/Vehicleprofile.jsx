import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const localizer = momentLocalizer(moment);

const VehicleProfile = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    // Fetch vehicle details
    fetch(`http://localhost:5001/api/vehicles/${id}`)
      .then((response) => response.json())
      .then((data) => setVehicle(data))
      .catch((error) => console.error("Error fetching vehicle:", error));

    // Fetch vehicle availability
    fetch(`http://localhost:5001/api/vehicles/${id}/availability`)
      .then((response) => response.json())
      .then((data) => setAvailability(data))
      .catch((error) => console.error("Error fetching availability:", error));
  }, [id]);

  if (!vehicle) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">
          {vehicle.brand} {vehicle.model}
        </h1>
        <img
          src={vehicle.image}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p className="text-gray-300 mb-4">{vehicle.type}</p>
        <p className="text-gray-300 mb-4">
          Seating Capacity: {vehicle.seatingCapacity}
        </p>
        <p className="text-gray-300 mb-4">
          Features: {vehicle.features.join(", ")}
        </p>
        <p className="text-gray-300 mb-4">
          Pricing: ${vehicle.pricingDetails.perDay}/day or $
          {vehicle.pricingDetails.perHour}/hour
        </p>

        <h2 className="text-2xl font-bold mb-4">Availability Calendar</h2>
        <div className="bg-gray-800 p-4 rounded-lg">
          <Calendar
            localizer={localizer}
            events={availability}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VehicleProfile;
