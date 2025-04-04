import React from "react";

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">
        Admin Dashboard
      </h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <p className="text-lg">Welcome to the Admin Panel!</p>
        <p className="text-gray-400 mt-2">
          Statistics and quick links will appear here.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
