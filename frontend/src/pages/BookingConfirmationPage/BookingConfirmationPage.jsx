import { useLocation, useParams } from "react-router-dom";

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails; // Get details passed via navigate

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold text-green-500 mb-4">
          Booking Request Submitted!
        </h1>
        <p className="text-lg text-gray-300 mb-2">
          Thank you for your request.
        </p>
        <p className="text-gray-300 mb-4">
          Your booking reference is:{" "}
          <strong className="text-yellow-500">{bookingId}</strong>
        </p>
        {bookingDetails && (
          <div className="bg-gray-800 p-4 rounded-lg max-w-md mx-auto text-left mb-6">
            <h2 className="text-xl font-semibold mb-2">Summary:</h2>
            <p>
              <strong>Vehicle:</strong> {bookingDetails.vehicleBrand}{" "}
              {bookingDetails.vehicleModel}
            </p>
            <p>
              <strong>Pickup:</strong>{" "}
              {moment(bookingDetails.pickupDate).format("LL")} at{" "}
              {bookingDetails.pickupTime}
            </p>
            <p>
              <strong>Return:</strong>{" "}
              {moment(bookingDetails.returnDate).format("LL")} at{" "}
              {bookingDetails.returnTime}
            </p>
            <p>
              <strong>Estimated Price:</strong> $
              {bookingDetails.totalPrice?.toFixed(2)}
            </p>
          </div>
        )}
        <p className="text-gray-400">
          We will contact you shortly via email ({bookingDetails?.email}) or
          phone ({bookingDetails?.phone}) to confirm your booking.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-yellow-500 text-gray-900 px-6 py-2 rounded hover:bg-yellow-600"
        >
          Back to Home
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default BookingConfirmationPage;;