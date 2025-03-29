import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaUser, FaEnvelope, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { MdSubject } from "react-icons/md";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" }); // For success/error after submit

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
    // Clear general submit status if user types again
    if (submitStatus.message) {
      setSubmitStatus({ type: "", message: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Please enter a valid email address";
    // Subject is optional in this setup, add validation if required
    if (!formData.message.trim()) errors.message = "Message cannot be empty";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: "", message: "" }); // Clear previous status

    if (!validateForm()) {
      console.log("Contact form validation failed", formErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        // Use relative path for proxy
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Use error details from backend if available
        throw new Error(
          result.error || `Failed to send message: ${response.statusText}`
        );
      }

      // --- Success ---
      setSubmitStatus({
        type: "success",
        message: result.message || "Message sent successfully!",
      });
      // Clear the form
      setFormData({ name: "", email: "", subject: "", message: "" });
      setFormErrors({});
    } catch (err) {
      console.error("Contact form submission error:", err);
      setSubmitStatus({
        type: "error",
        message:
          err.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      <div className="container mx-auto p-6 flex-grow flex items-center justify-center">
        {" "}
        {/* Center content */}
        <div className="w-full max-w-2xl">
          {" "}
          {/* Limit width */}
          <h1 className="text-4xl font-bold mb-8 text-center text-yellow-500">
            Get In Touch
          </h1>
          <p className="text-center text-gray-400 mb-10">
            Have questions or need assistance? Fill out the form below, and
            we'll get back to you as soon as possible.
          </p>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-lg space-y-6" // Added space-y
            noValidate
          >
            {/* Display Success/Error Message */}
            {submitStatus.message && (
              <div
                className={`p-4 rounded-md text-center font-medium ${
                  submitStatus.type === "success"
                    ? "bg-green-800 text-green-100"
                    : "bg-red-800 text-red-100"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div>
                <label className="block mb-1 text-gray-300">
                  <span className="flex items-center">
                    <FaUser className="mr-2" />
                    Name<span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-700 rounded-lg text-white border ${
                    formErrors.name ? "border-red-500" : "border-gray-600"
                  } focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none`}
                  placeholder="Your Name"
                  required
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="block mb-1 text-gray-300">
                  <span className="flex items-center">
                    <FaEnvelope className="mr-2" />
                    Email<span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-700 rounded-lg text-white border ${
                    formErrors.email ? "border-red-500" : "border-gray-600"
                  } focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none`}
                  placeholder="Your Email Address"
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Subject Input (Optional) */}
            <div>
              <label className="block mb-1 text-gray-300">
                <span className="flex items-center">
                  <MdSubject className="mr-2" />
                  Subject
                </span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none"
                placeholder="Booking Inquiry, Feedback, etc."
              />
              {/* No error display unless subject becomes required */}
            </div>

            {/* Message Textarea */}
            <div>
              <label className="block mb-1 text-gray-300">
                <span className="flex items-center">
                  Message<span className="text-red-500 ml-1">*</span>
                </span>
              </label>
              <textarea
                name="message"
                rows="5" // Increased rows
                value={formData.message}
                onChange={handleInputChange}
                className={`w-full p-3 bg-gray-700 rounded-lg text-white border ${
                  formErrors.message ? "border-red-500" : "border-gray-600"
                } focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none resize-none`} // Added resize-none
                placeholder="Write your message here..."
                required
              ></textarea>
              {formErrors.message && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg transition duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <FaPaperPlane className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
