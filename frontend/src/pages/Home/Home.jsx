import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCar,
  FaUsers,
  FaCalendarAlt,
  FaBusAlt,
  FaMotorcycle,
  FaTruckMoving,
} from "react-icons/fa";
import CustomerReviewsSection from "../../components/CustomerReviewsSection";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import VehicleBookingForm from "../../components/VehicleBookingForm";

const vehicleCategories = [
  {
    name: "Cars",
    type: "Car",
    icon: FaCar,
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  }, // Replace with relevant images
  {
    name: "Vans",
    type: "Van",
    icon: FaBusAlt,
    image:
      "https://images.unsplash.com/photo-1606505719100-7695a1cf4a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    name: "SUVs",
    type: "SUV",
    icon: FaTruckMoving,
    image:
      "https://images.unsplash.com/photo-1588811690044-5a92863b1385?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    name: "Scooters",
    type: "Scooter",
    icon: FaMotorcycle,
    image:
      "https://images.unsplash.com/photo-1593672598113-49521a2a4b9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
  },
];

const Home = () => {
  const navigate = useNavigate();

  const handleFormSubmit = (formData) => {
    const queryParams = new URLSearchParams({
      pickupPoint: formData.pickupPoint,
      returnPoint: formData.returnPoint,
      pickupDate: formData.pickupDate,
      returnDate: formData.returnDate,
      pickupTime: formData.pickupTime,
      returnTime: formData.returnTime,
      vehicleType: formData.vehicleType,
    }).toString();

    navigate(`/available-vehicles?${queryParams}`);
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-80 z-0"></div>

      <div className="relative z-10">
        <Navbar />

        <div className="py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Experience Sri Lanka with{" "}
            <span className="text-yellow-500">Premium Vehicles</span>
          </h1>

          <VehicleBookingForm onSubmit={handleFormSubmit} />
        </div>

        <div className="py-16 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Browse by <span className="text-yellow-500">Vehicle Type</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {vehicleCategories.map((category) => (
                <Link
                  key={category.type}
                  to={`/available-vehicles?vehicleType=${encodeURIComponent(
                    category.type
                  )}`}
                  className="block bg-gray-800 bg-opacity-70 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" // Zoom effect on hover
                    />
                  </div>
                  <div className="p-5 text-center">
                    <category.icon className="text-yellow-500 text-3xl mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-white">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="py-16 px-6 md:px-12 lg:px-24 bg-gray-800 bg-opacity-60">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Why Choose <span className="text-yellow-500">CeylonRides</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-900 bg-opacity-60 p-6 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-yellow-500 p-4 rounded-full">
                    <FaStar className="text-gray-900 text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">4.9/5 Overall Rating</h3>
                <p className="text-gray-300">
                  Based on 2,000+ happy customer reviews
                </p>
              </div>

              <div className="bg-gray-900 bg-opacity-60 p-6 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-yellow-500 p-4 rounded-full">
                    <FaCar className="text-gray-900 text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Premium Vehicles</h3>
                <p className="text-gray-300">
                  Wide range of well-maintained vehicles for every need
                </p>
              </div>

              <div className="bg-gray-900 bg-opacity-60 p-6 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-yellow-500 p-4 rounded-full">
                    <FaUsers className="text-gray-900 text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Professional Drivers</h3>
                <p className="text-gray-300">
                  Experienced, multilingual drivers for a smooth journey
                </p>
              </div>

              <div className="bg-gray-900 bg-opacity-60 p-6 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-yellow-500 p-4 rounded-full">
                    <FaCalendarAlt className="text-gray-900 text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
                <p className="text-gray-300">
                  Simple online booking process with instant confirmation
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-16 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Best Places to Start Your{" "}
              <span className="text-yellow-500">Journey</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Sigiriya */}
              <div className="bg-gray-800 bg-opacity-70 rounded-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://beyondescapes.com/uploads/excursions/BW4YPnXzX3u1.jpg"
                    alt="Sigiriya"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    Sigiriya Rock Fortress
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Explore the ancient rock fortress and marvel at its
                    engineering and artistic wonders.
                  </p>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-yellow-500 mr-2" />
                    <span className="text-gray-300">Central Province</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 bg-opacity-70 rounded-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://cdn.getyourguide.com/img/tour/5c3f043fa24e8.jpeg/145.jpg"
                    alt="Kandy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    Kandy Temple of the Tooth
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Visit the sacred temple housing the relic of Buddha's tooth
                    in the scenic city.
                  </p>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-yellow-500 mr-2" />
                    <span className="text-gray-300">Central Province</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 bg-opacity-70 rounded-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://lk.lakpura.com/cdn/shop/files/galle_147f8ef7-7d19-4c30-9069-eb59128e1c2c.jpg?v=1655875568&width=3840"
                    alt="Galle"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Galle Fort</h3>
                  <p className="text-gray-300 mb-4">
                    Discover the UNESCO World Heritage site with its colonial
                    architecture and seaside charm.
                  </p>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-yellow-500 mr-2" />
                    <span className="text-gray-300">Southern Province</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-16 px-6 md:px-12 lg:px-24 bg-gray-800 bg-opacity-60">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Our <span className="text-yellow-500">Branches</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-900 bg-opacity-70 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Colombo</h3>
                <div className="flex items-start mb-2">
                  <FaMapMarkerAlt className="text-yellow-500 mr-2 mt-1" />
                  <p className="text-gray-300">42 Galle Road, Colombo 03</p>
                </div>
                <div className="flex items-center mb-2">
                  <FaPhone className="text-yellow-500 mr-2" />
                  <p className="text-gray-300">+94 11 234 5678</p>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-yellow-500 mr-2" />
                  <p className="text-gray-300">colombo@ceylonrides.com</p>
                </div>
              </div>

              <div className="bg-gray-900 bg-opacity-70 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Kandy</h3>
                <div className="flex items-start mb-2">
                  <FaMapMarkerAlt className="text-yellow-500 mr-2 mt-1" />
                  <p className="text-gray-300">15 Temple Street, Kandy</p>
                </div>
                <div className="flex items-center mb-2">
                  <FaPhone className="text-yellow-500 mr-2" />
                  <p className="text-gray-300">+94 81 234 5678</p>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-yellow-500 mr-2" />
                  <p className="text-gray-300">kandy@ceylonrides.com</p>
                </div>
              </div>

              <div className="bg-gray-900 bg-opacity-70 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Negombo</h3>
                <div className="flex items-start mb-2">
                  <FaMapMarkerAlt className="text-yellow-500 mr-2 mt-1" />
                  <p className="text-gray-300">78 Beach Road, Negombo</p>
                </div>
                <div className="flex items-center mb-2">
                  <FaPhone className="text-yellow-500 mr-2" />
                  <p className="text-gray-300">+94 31 234 5678</p>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-yellow-500 mr-2" />
                  <p className="text-gray-300">negombo@ceylonrides.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CustomerReviewsSection />

        <Footer />
      </div>
    </div>
  );
};

export default Home;
