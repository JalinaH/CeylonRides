import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaSpinner,
  FaExclamationCircle,
  FaEdit,
  FaTrash,
  FaPlusCircle,
} from "react-icons/fa";

const AdminVehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_TARGET_URL;

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!token) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/vehicles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(
            errData.error || `Failed to fetch vehicles: ${response.statusText}`
          );
        }

        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [token]);

  const handleDelete = async (vehicleId, vehicleName) => {
    if (
      window.confirm(
        `Are you sure you want to delete vehicle: ${vehicleName}? This cannot be undone.`
      )
    ) {
      console.log("Attempting to delete vehicle:", vehicleId);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/admin/vehicles/${vehicleId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(
            result.error || `Failed to delete: ${response.statusText}`
          );
        }
        console.log(result.message);
        alert(result.message || "Vehicle deleted successfully.");
        setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
      } catch (err) {
        console.error("Delete error:", err);
        setError(`Delete failed: ${err.message}`);
      } finally {
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center p-10">
        <FaSpinner className="animate-spin text-4xl text-yellow-500 mx-auto" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center p-6 bg-red-900 bg-opacity-50 rounded">
        <FaExclamationCircle className="inline mr-2 text-red-400" />
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-500">Manage Vehicles</h1>
        <Link
          to="/admin/vehicles/new"
          className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          <FaPlusCircle className="mr-2" /> Add New Vehicle
        </Link>
      </div>

      <div className="bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        {" "}
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="border-b-2 border-gray-700 bg-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
              <th className="px-5 py-3">Image</th>
              <th className="px-5 py-3">Brand & Model</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Seats</th>
              <th className="px-5 py-3">Price/Day</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No vehicles found.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr
                  key={vehicle._id}
                  className="border-b border-gray-700 hover:bg-gray-750"
                >
                  <td className="px-5 py-3 text-sm">
                    <img
                      src={
                        vehicle.image ||
                        "https://via.placeholder.com/80x50?text=No+Image"
                      }
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-20 h-12 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/80x50?text=Error";
                      }}
                    />
                  </td>
                  <td className="px-5 py-3 text-sm">
                    <p className="font-semibold whitespace-no-wrap">
                      {vehicle.brand} {vehicle.model}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-sm">{vehicle.type}</td>
                  <td className="px-5 py-3 text-sm">
                    {vehicle.seatingCapacity}
                  </td>
                  <td className="px-5 py-3 text-sm">
                    ${vehicle.pricingDetails?.perDay?.toFixed(2) || "N/A"}
                  </td>
                  <td className="px-5 py-3 text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vehicle.availabilityStatus
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {vehicle.availabilityStatus ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm whitespace-no-wrap">
                    <Link
                      to={`/admin/vehicles/edit/${vehicle._id}`}
                      title="Edit Vehicle"
                      className="text-indigo-400 hover:text-indigo-600 mr-3"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() =>
                        handleDelete(
                          vehicle._id,
                          `${vehicle.brand} ${vehicle.model}`
                        )
                      }
                      title="Delete Vehicle"
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

export default AdminVehicleList;
