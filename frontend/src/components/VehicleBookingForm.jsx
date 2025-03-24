import React, { useState } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCar } from "react-icons/fa";

const VehicleBookingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    pickupPoint: "",
    returnPoint: "",
    pickupDate: "",
    returnDate: "",
    pickupTime: "",
    returnTime: "",
    vehicleType: "Any Vehicle",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Check each field
    if (!formData.pickupPoint.trim()) {
      newErrors.pickupPoint = "Pickup location is required";
    }

    if (!formData.returnPoint.trim()) {
      newErrors.returnPoint = "Return location is required";
    }

    if (!formData.pickupDate) {
      newErrors.pickupDate = "Pickup date is required";
    }

    if (!formData.pickupTime) {
      newErrors.pickupTime = "Pickup time is required";
    }

    if (!formData.returnDate) {
      newErrors.returnDate = "Return date is required";
    }

    if (!formData.returnTime) {
      newErrors.returnTime = "Return time is required";
    }

    setErrors(newErrors);

    // Return true if no errors (form is valid)
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg mb-16"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Book Your Vehicle</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-2">
            <span className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              Pickup Point
              <span className="text-red-500 ml-1">*</span>
            </span>
          </label>
          <input
            type="text"
            name="pickupPoint"
            className={`w-full p-3 bg-gray-700 rounded-lg text-white ${
              errors.pickupPoint ? "border border-red-500" : ""
            }`}
            placeholder="Enter pickup location"
            value={formData.pickupPoint}
            onChange={handleChange}
          />
          {errors.pickupPoint && (
            <p className="text-red-500 text-sm mt-1">{errors.pickupPoint}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            <span className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              Return Point
              <span className="text-red-500 ml-1">*</span>
            </span>
          </label>
          <input
            type="text"
            name="returnPoint"
            className={`w-full p-3 bg-gray-700 rounded-lg text-white ${
              errors.returnPoint ? "border border-red-500" : ""
            }`}
            placeholder="Enter return location"
            value={formData.returnPoint}
            onChange={handleChange}
          />
          {errors.returnPoint && (
            <p className="text-red-500 text-sm mt-1">{errors.returnPoint}</p>
          )}
        </div>

        <div className="md:col-span-1">
          <label className="block mb-2">
            <span className="flex items-center">
              <FaCar className="mr-2" />
              Vehicle Type
              <span className="text-red-500 ml-1">*</span>
            </span>
          </label>
          <select
            name="vehicleType"
            className="w-full p-3 bg-gray-700 rounded-lg text-white"
            value={formData.vehicleType}
            onChange={handleChange}
          >
            <option>Any Vehicle</option>
            <option>Car</option>
            <option>Van</option>
            <option>SUV</option>
            <option>Bus</option>
            <option>Scooter</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block mb-2">
            <span className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              Pickup Date
              <span className="text-red-500 ml-1">*</span>
            </span>
          </label>
          <input
            type="date"
            name="pickupDate"
            className={`w-full p-3 bg-gray-700 rounded-lg text-white ${
              errors.pickupDate ? "border border-red-500" : ""
            }`}
            value={formData.pickupDate}
            onChange={handleChange}
          />
          {errors.pickupDate && (
            <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            <span className="flex items-center">
              <FaClock className="mr-2" />
              Pickup Time
              <span className="text-red-500 ml-1">*</span>
            </span>
          </label>
          <input
            type="time"
            name="pickupTime"
            className={`w-full p-3 bg-gray-700 rounded-lg text-white ${
              errors.pickupTime ? "border border-red-500" : ""
            }`}
            value={formData.pickupTime}
            onChange={handleChange}
          />
          {errors.pickupTime && (
            <p className="text-red-500 text-sm mt-1">{errors.pickupTime}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            <span className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              Return Date
              <span className="text-red-500 ml-1">*</span>
            </span>
          </label>
          <input
            type="date"
            name="returnDate"
            className={`w-full p-3 bg-gray-700 rounded-lg text-white ${
              errors.returnDate ? "border border-red-500" : ""
            }`}
            value={formData.returnDate}
            onChange={handleChange}
          />
          {errors.returnDate && (
            <p className="text-red-500 text-sm mt-1">{errors.returnDate}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            <span className="flex items-center">
              <FaClock className="mr-2" />
              Return Time
              <span className="text-red-500 ml-1">*</span>
            </span>
          </label>
          <input
            type="time"
            name="returnTime"
            className={`w-full p-3 bg-gray-700 rounded-lg text-white ${
              errors.returnTime ? "border border-red-500" : ""
            }`}
            value={formData.returnTime}
            onChange={handleChange}
          />
          {errors.returnTime && (
            <p className="text-red-500 text-sm mt-1">{errors.returnTime}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition text-center"
      >
        Show Available Vehicles
      </button>
    </form>
  );
};

export default VehicleBookingForm;
