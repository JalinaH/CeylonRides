import React from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-yellow-500">Ceylon</span>Rides
            </h3>
            <p className="text-gray-400 mb-4">
              Your trusted partner for exploring the beautiful island of Sri
              Lanka with comfortable vehicles and experienced drivers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-500">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  Our Vehicles
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  Our Drivers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Vehicle Types</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  Compact Cars
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  Luxury Sedans
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  SUVs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  Vans
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  Minibuses
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-yellow-500 mr-2 mt-1" />
                <span className="text-gray-400">
                  42 Galle Road, Colombo 03, Sri Lanka
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-yellow-500 mr-2" />
                <span className="text-gray-400">+94 11 234 5678</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-yellow-500 mr-2" />
                <span className="text-gray-400">info@ceylonrides.com</span>
              </li>
              <li className="flex items-center">
                <FaClock className="text-yellow-500 mr-2" />
                <span className="text-gray-400">24/7 Customer Support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} CeylonRides. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
