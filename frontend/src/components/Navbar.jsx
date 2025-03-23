import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 bg-opacity-90 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white">
          <span className="text-yellow-500">Ceylon</span>Rides
        </h1>
      </div>
      <div className="flex items-center space-x-6">
        <Link to="/" className="hover:text-yellow-500 transition">
          Home
        </Link>
        <Link
          to="/available-vehicles"
          className="hover:text-yellow-500 transition"
        >
          Available Vehicles
        </Link>
        <Link
          to="/manage-bookings"
          className="hover:text-yellow-500 transition"
        >
          Manage My Bookings
        </Link>
        <Link
          to="/login"
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
