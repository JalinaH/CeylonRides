import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import VehicleProfile from './pages/VehicleProfile/Vehicleprofile';
import AvailableVehicles from './pages/AvailableVehicles/AvailableVehicles';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vehicles/:id" element={<VehicleProfile />} />
        <Route path="/available-vehicles" element={<AvailableVehicles />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
