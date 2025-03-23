import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const localizer = momentLocalizer(moment);

const VehicleProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleBookNow = () => {
    navigate(`/book-vehicle/${id}`); // Navigate to the booking page
  };

  if (!vehicle) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto p-6">
        {/* Vehicle Details Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {vehicle.brand} {vehicle.model}
          </h1>
          <img
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Type:</span> {vehicle.type}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Seating Capacity:</span>{" "}
                {vehicle.seatingCapacity}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Features:</span>{" "}
                {vehicle.features.join(", ")}
              </p>
            </div>
            <div>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Price per Day:</span> $
                {vehicle.pricingDetails.perDay}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Price per Hour:</span> $
                {vehicle.pricingDetails.perHour}
              </p>
            </div>
          </div>
          <button
            onClick={handleBookNow}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg mt-4 transition duration-300"
          >
            Book This Vehicle
          </button>
        </div>

        {/* Availability Calendar Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Availability Calendar</h2>
          <div className="bg-gray-700 p-4 rounded-lg">
            <Calendar
              localizer={localizer}
              events={availability}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: "#FCD34D", // Lighter yellow for occupied dates
                  borderRadius: "4px",
                  border: "none",
                  color: "#1F2937", // Dark text for better contrast
                },
              })}
              // Customize the calendar colors
              components={{
                toolbar: (props) => (
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => props.onNavigate("PREV")}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
                    >
                      Previous
                    </button>
                    <span className="text-lg font-semibold">{props.label}</span>
                    <button
                      onClick={() => props.onNavigate("NEXT")}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
                    >
                      Next
                    </button>
                  </div>
                ),
              }}
              // Customize the calendar header
              views={["month", "week", "day"]}
              defaultView="month"
              // Customize the calendar colors
              className="custom-calendar"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VehicleProfile;
