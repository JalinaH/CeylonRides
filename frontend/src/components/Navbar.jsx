import React from "react";
import { Link, NavLink } from "react-router-dom"; // *** Use NavLink ***
import { useAuth } from "../context/AuthContext"; // *** USE AUTH CONTEXT ***
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth(); // *** Get user and logout ***

  // Helper for NavLink className
  const navLinkClasses = ({ isActive }) =>
    `px-3 py-1 rounded transition ${
      isActive
        ? "text-yellow-400 font-semibold"
        : "text-white hover:text-yellow-400"
    }`;

  return (
    <nav className="bg-gray-900 bg-opacity-90 text-white p-4 shadow-md sticky top-0 z-50">
      {" "}
      {/* Added sticky top & z-index */}
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          <span className="text-yellow-500">Ceylon</span>Rides
        </Link>
        <div className="flex items-center space-x-4">
          {" "}
          {/* Adjusted spacing */}
          <NavLink to="/" className={navLinkClasses}>
            Home
          </NavLink>
          {/* Conditional Rendering based on user state */}
          {user ? (
            // --- Logged In View ---
            <>
              <NavLink to="/available-vehicles" className={navLinkClasses}>
                Vehicles
              </NavLink>
              {/* Link to user's bookings - Ensure this route exists and is protected */}
              <NavLink to="/manage-bookings" className={navLinkClasses}>
                My Bookings
              </NavLink>

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-700">
                {" "}
                {/* Separator */}
                <FaUserCircle className="text-yellow-500 text-xl" />
                <span className="font-medium">{user.username}</span>
                <button
                  onClick={logout} // *** Call context logout ***
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            // --- Logged Out View ---
            <>
              {/* Maybe show vehicles even when logged out? */}
              <NavLink to="/available-vehicles" className={navLinkClasses}>
                Vehicles
              </NavLink>
              {/* Separator or adjust spacing */}
              <div className="flex items-center space-x-2 pl-4 border-l border-gray-700">
                <NavLink to="/login" className={navLinkClasses}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-1 px-4 rounded-lg transition text-sm" // Adjusted padding
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
