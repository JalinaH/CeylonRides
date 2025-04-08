import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const DriverLayout = () => {
  const { logout } = useAuth();

  const sidebarLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 rounded-md transition duration-200 ${
      isActive
        ? "bg-yellow-600 text-gray-900 font-semibold shadow-lg"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-4 flex flex-col shadow-xl">
        <div className="mb-8 text-center">
          <NavLink
            to="/driver/dashboard"
            className="text-2xl font-bold text-white"
          >
            <span className="text-yellow-500">Driver</span> Portal
          </NavLink>
        </div>
        <nav className="flex-grow space-y-2">
          <NavLink to="/driver/dashboard" className={sidebarLinkClasses} end>
            <FaTachometerAlt className="mr-3" /> Dashboard
          </NavLink>
          <NavLink to="/driver/bookings" className={sidebarLinkClasses} end>
            <FaCalendarAlt className="mr-3" /> My Schedule
          </NavLink>
          <NavLink to="/driver/profile" className={sidebarLinkClasses}>
            <FaUserCircle className="mr-3" /> My Profile
          </NavLink>
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-3 rounded-md transition duration-200 text-gray-300 hover:bg-red-700 hover:text-white"
          >
            <FaSignOutAlt className="mr-3" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DriverLayout;
