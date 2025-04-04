import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import VehicleProfile from "./pages/VehicleProfile/Vehicleprofile";
import AvailableVehicles from "./pages/AvailableVehicles/AvailableVehicles";
import BookingPage from "./pages/BookingPage/BookingPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage/BookingConfirmationPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/Register/Register";
import LoginPage from "./pages/Login/Login";
import MyBookingsPage from "./pages/MyBookings/MyBookingsPage";
import ContactPage from "./pages/Contact/ContactPage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminUserList from "./pages/Admin/AdminUserList";
import AdminProtectedRoute from "./components/Admin/AdminProtectedRoutes";
import AdminLayout from "./components/Admin/AdminLayout";

function App() {
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/vehicles/:id" element={<VehicleProfile />} />
      <Route path="/available-vehicles" element={<AvailableVehicles />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route
        path="/book-vehicle/:id"
        element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking-confirmation"
        element={
          <ProtectedRoute>
            <BookingConfirmationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-bookings"
        element={
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUserList />} />
      </Route>
    </Routes>
  );
}

export default App;
