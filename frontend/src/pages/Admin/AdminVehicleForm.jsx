import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaCar,
  FaInfoCircle,
  FaDollarSign,
  FaCheckSquare,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";
import {
  MdOutlineBrandingWatermark,
  MdAirlineSeatReclineNormal,
} from "react-icons/md";

const vehicleTypes = ["Car", "Van", "SUV", "Bus", "Scooter"];

const AdminVehicleForm = () => {
  const { id: vehicleId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isEditing = Boolean(vehicleId);

  const [formData, setFormData] = useState({
    type: "",
    brand: "",
    model: "",
    seatingCapacity: "",
    features: [],
    "pricingDetails.perDay": "",
    "pricingDetails.perHour": "",
    image: "",
    availabilityStatus: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(isEditing);

  const API_BASE_URL = process.env.VITE_API_TARGET_URL;

  useEffect(() => {
    if (isEditing && token) {
      setLoadingDetails(true);
      setError(null);
      fetch(`${API_BASE_URL}/api/admin/vehicles/${vehicleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch vehicle details");
          return res.json();
        })
        .then((data) => {
          setFormData({
            type: data.type || "",
            brand: data.brand || "",
            model: data.model || "",
            seatingCapacity: data.seatingCapacity || "",
            features: data.features || [],
            "pricingDetails.perDay": data.pricingDetails?.perDay || "",
            "pricingDetails.perHour": data.pricingDetails?.perHour || "",
            image: data.image || "",
            availabilityStatus:
              data.availabilityStatus !== undefined
                ? data.availabilityStatus
                : true,
          });
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setError(`Error loading vehicle data: ${err.message}`);
        })
        .finally(() => setLoadingDetails(false));
    }
  }, [vehicleId, isEditing, token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "features") {
      setFormData((prev) => ({
        ...prev,
        features: checked
          ? [...prev.features, value]
          : prev.features.filter((feature) => feature !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiData = {
      type: formData.type,
      brand: formData.brand,
      model: formData.model,
      seatingCapacity: Number(formData.seatingCapacity) || 0,
      features: formData.features,
      pricingDetails: {
        perDay: Number(formData["pricingDetails.perDay"]) || 0,
        perHour: Number(formData["pricingDetails.perHour"]) || 0,
      },
      image: formData.image,
      availabilityStatus: formData.availabilityStatus,
    };

    const url = isEditing
      ? `${API_BASE_URL}/api/admin/vehicles/${vehicleId}`
      : `${API_BASE_URL}/api/admin/vehicles`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `Failed to ${isEditing ? "update" : "create"} vehicle`
        );
      }

      alert(`Vehicle ${isEditing ? "updated" : "created"} successfully!`);
      navigate("/admin/vehicles");
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingDetails) {
    return (
      <div className="text-center p-10">
        <FaSpinner className="animate-spin text-4xl text-yellow-500 mx-auto" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">
        {isEditing ? "Edit Vehicle" : "Add New Vehicle"}
      </h1>

      {error && (
        <div
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300"
          role="alert"
        >
          <FaTimesCircle className="inline mr-2" /> Error: {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow space-y-4"
      >
        <div>
          <label className="block mb-1 text-gray-300">
            <FaCar className="inline mr-2" />
            Type*
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            className="form-input bg-gray-700"
          >
            <option value="">-- Select Type --</option>
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-300">
              <MdOutlineBrandingWatermark className="inline mr-2" />
              Brand*
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
              className="form-input bg-gray-700"
              placeholder="e.g., Toyota"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">
              <FaInfoCircle className="inline mr-2" />
              Model*
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              required
              className="form-input bg-gray-700"
              placeholder="e.g., Aqua"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-gray-300">
              <MdAirlineSeatReclineNormal className="inline mr-2" />
              Seats*
            </label>
            <input
              type="number"
              name="seatingCapacity"
              value={formData.seatingCapacity}
              onChange={handleInputChange}
              required
              min="1"
              className="form-input bg-gray-700"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">
              <FaDollarSign className="inline mr-2" />
              Price/Day*
            </label>
            <input
              type="number"
              name="pricingDetails.perDay"
              value={formData["pricingDetails.perDay"]}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="form-input bg-gray-700"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">
              <FaDollarSign className="inline mr-2" />
              Price/Hour*
            </label>
            <input
              type="number"
              name="pricingDetails.perHour"
              value={formData["pricingDetails.perHour"]}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="form-input bg-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-gray-300">Features</label>
          <div className="flex flex-wrap gap-4">
            {[
              "Air Conditioning",
              "WiFi",
              "GPS",
              "Bluetooth",
              "Automatic",
              "Manual",
            ].map((feature) => (
              <label
                key={feature}
                className="flex items-center space-x-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="features"
                  value={feature}
                  checked={formData.features.includes(feature)}
                  onChange={handleInputChange}
                  className="rounded text-yellow-500 focus:ring-yellow-400 bg-gray-600 border-gray-500"
                />
                <span>{feature}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="form-input bg-gray-700"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-gray-400 mt-1">
            Enter the full URL of the vehicle image. File upload coming soon!
          </p>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              name="availabilityStatus"
              checked={formData.availabilityStatus}
              onChange={handleInputChange}
              className="rounded text-yellow-500 focus:ring-yellow-400 bg-gray-600 border-gray-500"
            />
            <span>Mark as Available</span>
          </label>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/vehicles")}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading && (
              <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
            )}
            {isEditing ? "Update Vehicle" : "Create Vehicle"}
          </button>
        </div>
      </form>
      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 0.75rem;
          background-color: #4a5568; /* gray-700 */
          border-radius: 0.375rem; /* rounded-lg */
          color: white;
          border: 1px solid #718096; /* gray-600 */
          transition: border-color 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #f59e0b; /* yellow-500 */
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.5); /* ring-yellow-500 */
        }
      `}</style>
    </div>
  );
};

export default AdminVehicleForm;
