import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaCar } from "react-icons/fa";

const RegisterTypeSelection = () => {
  const navigate = useNavigate();

  const handleSelection = (role) => {
    navigate("/register/details", { state: { selectedRole: role } });
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-80 z-0"></div>

      <div className="relative z-10 bg-gray-800 bg-opacity-90 p-10 rounded-lg shadow-lg w-full max-w-lg text-center">
        <h2 className="text-3xl font-bold mb-8 text-yellow-500">Register As</h2>

        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-10">
          <button
            onClick={() => handleSelection("tourist")}
            className="flex flex-col items-center justify-center p-8 bg-gray-700 rounded-lg hover:bg-yellow-600 hover:text-gray-900 transition duration-300 transform hover:scale-105 group w-full md:w-auto"
          >
            <FaUser className="text-5xl mb-4 text-yellow-500 group-hover:text-gray-900 transition duration-300" />
            <span className="text-xl font-semibold">Tourist</span>
            <span className="text-sm text-gray-400 group-hover:text-gray-800 transition duration-300 mt-1">
              Browse & Book
            </span>
          </button>

          <button
            onClick={() => handleSelection("driver")}
            className="flex flex-col items-center justify-center p-8 bg-gray-700 rounded-lg hover:bg-yellow-600 hover:text-gray-900 transition duration-300 transform hover:scale-105 group w-full md:w-auto"
          >
            <FaCar className="text-5xl mb-4 text-yellow-500 group-hover:text-gray-900 transition duration-300" />
            <span className="text-xl font-semibold">Driver</span>
            <span className="text-sm text-gray-400 group-hover:text-gray-800 transition duration-300 mt-1">
              Offer Rides
            </span>
          </button>
        </div>

        <p className="mt-10 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterTypeSelection;
