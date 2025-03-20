// This is just the Customer Reviews Section part of the code

import { useState } from "react";
import { FaStar } from "react-icons/fa";

const CustomerReviewsSection = () => {
  const reviews = [
    {
      name: "Yury Kleymenov",
      initial: "Y",
      color: "bg-yellow-500",
      time: "1 month ago",
      rating: 5,
      text: "Very good experience after renting a car at Kings Rent. Found this company on Google maps",
      readMoreLink: "#",
    },
    {
      name: "Marco Iacobucci",
      initial: "M",
      color: "bg-yellow-500",
      time: "1 month ago",
      rating: 5,
      text: "I rented a car with my girlfriend for 10 days in Sri Lanka. Everything went perfectly, zero issues.",
      readMoreLink: "#",
    },
    {
      name: "Juan Manuel Martín",
      initial: "J",
      color: "bg-yellow-500",
      time: "1 month ago",
      rating: 5,
      text: "Nos facilitaron todo para poder conducir en el país. Nos prepararon los documentos de manera eficiente.",
      readMoreLink: "#",
    },
    {
      name: "Charlotte L'Heureux",
      initial: "C",
      color: "bg-yellow-500",
      time: "2 months ago",
      rating: 5,
      text: "Amazing service. The team was responsive before our travel. They dropped and picked up the car at our hotel.",
      readMoreLink: "#",
    },
    {
      name: "Guy Millard",
      initial: "G",
      color: "bg-yellow-500",
      time: "2 months ago",
      rating: 5,
      text: "Many thanks for providing an excellent service during our holiday in Sri Lanka. All the arrangements were perfect.",
      readMoreLink: "#",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleReviews = 3; // Number of reviews visible at once

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - visibleReviews : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - visibleReviews ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="py-16 px-6 md:px-12 lg:px-24 bg-gray-800 bg-opacity-60">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">WHAT OUR CUSTOMERS SAY</h2>
          <p className="text-xl text-gray-300">
            TRUSTED FEEDBACK FROM OUR LOYAL CUSTOMERS
          </p>
          <div className="w-32 h-1 bg-yellow-500 mx-auto mt-4"></div>{" "}
        </div>

        <div className="relative">
          <div className="flex overflow-hidden">
            <div
              className="flex transition-transform duration-300"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / visibleReviews)
                }%)`,
              }}
            >
              {reviews.map((review, index) => (
                <div key={index} className="w-full md:w-1/3 px-4 flex-shrink-0">
                  <div className="bg-gray-900 bg-opacity-70 p-6 rounded-lg h-full">
                    {" "}
                    <div className="flex items-center mb-4">
                      <div
                        className={`${review.color} h-14 w-14 rounded-full flex items-center justify-center mr-4 text-gray-900 text-xl font-bold`}
                      >
                        {review.initial}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{review.name}</h4>
                        <p className="text-gray-400 text-sm">{review.time}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500 mr-1" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-3">{review.text}</p>
                    <a
                      href={review.readMoreLink}
                      className="text-gray-400 hover:text-yellow-500"
                    >
                      Read more
                    </a>
                    <div className="mt-4 flex items-center">
                      <span className="text-gray-400 text-sm">Posted on</span>
                      <div className="ml-2">
                        <img
                          src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                          alt="Google"
                          className="h-5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-900 hover:bg-yellow-500 text-white hover:text-gray-900 p-2 rounded-full shadow-lg z-10 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-900 hover:bg-yellow-500 text-white hover:text-gray-900 p-2 rounded-full shadow-lg z-10 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="flex justify-center space-x-2 mt-6">
          {[...Array(Math.ceil(reviews.length / visibleReviews))].map(
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * visibleReviews)}
                className={`h-2 w-2 rounded-full ${
                  i === Math.floor(currentIndex / visibleReviews)
                    ? "bg-yellow-500"
                    : "bg-gray-400"
                }`}
              />
            )
          )}
        </div>

        <div className="text-center mt-8">
          <a
            href="#"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg transition"
          >
            VIEW MORE
          </a>
        </div>
      </div>
    </div>
  );
};

export default CustomerReviewsSection;
