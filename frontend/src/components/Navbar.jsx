import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaUserCircle,
  FaChevronDown,
  FaCar,
  FaBusAlt,
  FaMotorcycle,
  FaTruckMoving,
  FaTachometerAlt,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);

  const navLinkClasses = ({ isActive }) =>
    `px-3 py-1 rounded transition ${
      isActive
        ? "text-yellow-400 font-semibold"
        : "text-white hover:text-yellow-400"
    }`;

  const adminLinkClasses = ({ isActive }) =>
    `px-3 py-1 rounded transition ${
      isActive
        ? "text-yellow-400 font-semibold border border-yellow-500" // Example distinct style
        : "text-gray-300 hover:text-yellow-400"
    }`;

  const vehicleCategories = [
    { name: "Cars", type: "Car", icon: FaCar },
    { name: "Vans", type: "Van", icon: FaBusAlt },
    { name: "SUVs", type: "SUV", icon: FaTruckMoving },
    { name: "Scooters", type: "Scooter", icon: FaMotorcycle },
  ];

  return (
    <nav className="bg-gray-900 bg-opacity-90 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          <span className="text-yellow-500">Ceylon</span>Rides
        </Link>
        <div className="flex items-center space-x-4">
          <NavLink to="/" className={navLinkClasses} end>
            Home
          </NavLink>

          <div className="relative">
            <button
              onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
              onBlur={() =>
                setTimeout(() => setIsVehicleDropdownOpen(false), 150)
              }
              className="flex items-center px-3 py-1 rounded transition text-white hover:text-yellow-400 focus:outline-none"
            >
              Vehicles
              <FaChevronDown
                className={`ml-1 transition-transform duration-200 ${
                  isVehicleDropdownOpen ? "rotate-180" : ""
                }`}
                size={12}
              />
            </button>
            {isVehicleDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/available-vehicles"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
                  onClick={() => setIsVehicleDropdownOpen(false)}
                >
                  All Vehicles
                </Link>
                <div className="border-t border-gray-700 my-1"></div>{" "}
                {vehicleCategories.map((category) => (
                  <Link
                    key={category.type}
                    to={`/available-vehicles?vehicleType=${encodeURIComponent(
                      category.type
                    )}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
                    onClick={() => setIsVehicleDropdownOpen(false)}
                  >
                    <category.icon className="mr-2" /> {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <>
              {user.role === "admin" && (
                <NavLink
                  to="/admin/dashboard"
                  className={adminLinkClasses}
                  title="Admin Dashboard"
                >
                  <FaTachometerAlt className="mr-1 inline" /> Admin
                </NavLink>
              )}
              <NavLink to="/manage-bookings" className={navLinkClasses}>
                My Bookings
              </NavLink>
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-700">
                <FaUserCircle className="text-yellow-500 text-xl" />
                <span className="font-medium">{user.username}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2 pl-4 border-l border-gray-700">
                <NavLink to="/login" className={navLinkClasses}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-1 px-4 rounded-lg transition text-sm"
                >
                  Register
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
