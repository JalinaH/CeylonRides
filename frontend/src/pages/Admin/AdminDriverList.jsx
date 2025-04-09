import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaSpinner,
  FaExclamationCircle,
  FaEdit,
  FaTrash,
  FaPlusCircle,
  FaUserTie,
} from "react-icons/fa";

const AdminDriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const API_BASE_URL = process.env.VITE_API_TARGET_URL;

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/api/admin/drivers`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch drivers");
        return res.json();
      })
      .then((data) => setDrivers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async (driverId, driverName) => {
    if (
      window.confirm(
        `Are you sure you want to delete driver: ${driverName}? Check for active bookings first.`
      )
    ) {
      console.log("Attempting to delete driver:", driverId);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/drivers/${driverId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Delete failed");
        }
        alert(result.message || "Driver deleted.");
        setDrivers((prev) => prev.filter((d) => d._id !== driverId));
      } catch (err) {
        setError(`Delete failed: ${err.message}`);
      }
    }
  };

  if (loading)
    return (
      <div className="text-center p-10">
        <FaSpinner className="animate-spin text-4xl text-yellow-500 mx-auto" />
      </div>
    );
  if (error)
    return (
      <div className="text-center p-6 bg-red-900 bg-opacity-50 rounded">
        <FaExclamationCircle className="inline mr-2 text-red-400" />
        Error: {error}
      </div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-500">Manage Drivers</h1>
        <Link
          to="/admin/drivers/new"
          className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          <FaPlusCircle className="mr-2" /> Add New Driver
        </Link>
      </div>

      <div className="bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="border-b-2 border-gray-700 bg-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">License No.</th>
              <th className="px-5 py-3">Experience</th>
              <th className="px-5 py-3">Languages</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {drivers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No drivers found.
                </td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr
                  key={driver._id}
                  className="border-b border-gray-700 hover:bg-gray-750"
                >
                  <td className="px-5 py-4 text-sm">{driver.username}</td>
                  <td className="px-5 py-4 text-sm">{driver.email}</td>
                  <td className="px-5 py-4 text-sm">{driver.phone || "N/A"}</td>
                  <td className="px-5 py-4 text-sm">
                    {driver.licenseNumber || "N/A"}
                  </td>
                  <td className="px-5 py-4 text-sm">
                    {driver.experienceYears || 0} yrs
                  </td>
                  <td className="px-5 py-4 text-sm">
                    {(driver.languages || []).join(", ") || "N/A"}
                  </td>
                  <td className="px-5 py-4 text-sm whitespace-no-wrap">
                    <Link
                      to={`/admin/drivers/edit/${driver._id}`}
                      title="Edit Driver"
                      className="text-indigo-400 hover:text-indigo-600 mr-3 inline-block"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(driver._id, driver.username)}
                      title="Delete Driver"
                      className="text-red-400 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDriverList;
