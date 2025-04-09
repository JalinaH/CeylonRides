# CeylonRides - Vehicle Rental System

**CeylonRides** is a full-stack web application designed to facilitate vehicle rentals, primarily targeting tourists who may also require drivers. It provides a seamless platform for browsing vehicles, managing bookings, and connecting tourists with drivers and administrators.

**Live Demo:** [Link to your deployed application (if applicable)]

![Screenshot of CeylonRides Homepage](<https://github.com/JalinaH/CeylonRides/blob/main/Screenshots/SCR-20250409-kvvc.jpeg>)

## Table of Contents

-   [Features](#features)
    -   [Tourist Features](#tourist-features)
    -   [Driver Features](#driver-features)
    -   [Admin Features](#admin-features)
-   [Tech Stack](#tech-stack)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Environment Variables](#environment-variables)
    -   [Running the Application](#running-the-application)
-   [Project Structure](#project-structure)
    -   [Backend](#backend)
    -   [Frontend](#frontend)
-   [API Endpoints](#api-endpoints)
-   [Contributing](#contributing)
-   [License](#license)
-   [Acknowledgements](#acknowledgements)

## Features

### Tourist Features

-   **User Authentication:** Secure registration (Tourist/Driver selection) and login.
-   **Browse Vehicles:** View all available vehicles or filter by category (Car, Van, SUV, Scooter, etc.).
-   **View Vehicle Details:** See specific vehicle information, including images, seating capacity, features, pricing, and an availability calendar.
-   **Booking System:**
    -   Select pickup/return points, dates, and times.
    -   Submit booking requests.
    -   View estimated costs.
    -   Confirmation step before final submission.
    -   View booking history ("My Bookings").
    -   [Future] Cancel pending bookings.
    -   [Future] Browse and view driver profiles.
    -   [Future] Rate and review drivers/vehicles after trip completion.
    -   [Future] Online payment integration.
-   **Contact Form:** Send inquiries to the administration.

### Driver Features

-   **Driver Authentication:** Secure login for registered drivers.
-   **Driver Dashboard:** Overview of assigned tasks.
-   **View Assigned Bookings:** See details of confirmed/active bookings assigned to them ("My Schedule").
-   **Update Booking Status:** Mark bookings as 'Picked Up', 'En Route', 'Completed'.
-   **Manage Profile:** View and update personal details, contact information, license info, experience, and languages.

### Admin Features

-   **Admin Authentication:** Secure login for administrators.
-   **Admin Dashboard:** Central hub for management (Statistics placeholders).
-   **Vehicle Management (CRUD):** Add, view, update, and delete vehicle listings with details like type, capacity, features, pricing, image URL, and availability status.
-   **Driver Management (CRUD):** Add, view, update, and delete driver profiles (user accounts with 'driver' role), including license details, experience, etc.
-   **Booking Management:**
    -   View all bookings with filters (placeholder).
    -   Review pending bookings.
    -   Assign available drivers to pending bookings.
    -   Confirm bookings (with driver assignment).
    -   Reject/Cancel bookings.
-   **User Management:** View all registered users and their roles.
-   [Future] Manage Contact Messages.
-   [Future] Review Moderation.
-   [Future] Reporting and Analytics.

## Tech Stack

**Frontend:**

-   **React:** JavaScript library for building user interfaces.
-   **Vite:** Fast frontend build tool and development server.
-   **React Router:** For declarative routing.
-   **Tailwind CSS:** Utility-first CSS framework for styling.
-   **React Icons:** For including popular icon sets.
-   **Moment.js:** For date/time parsing, formatting, and manipulation.
-   **React Big Calendar:** For displaying vehicle availability.
-   **Context API:** For global state management (Authentication).
-   **Fetch API:** For making requests to the backend.

**Backend:**

-   **Node.js:** JavaScript runtime environment.
-   **Express.js:** Web application framework for Node.js.
-   **MongoDB:** NoSQL database for storing application data.
-   **Mongoose:** Object Data Modeling (ODM) library for MongoDB and Node.js.
-   **JSON Web Tokens (JWT):** For secure user authentication and authorization.
-   **bcryptjs:** Library for hashing passwords.
-   **dotenv:** For loading environment variables from a `.env` file.
-   **cors:** Middleware for enabling Cross-Origin Resource Sharing.
-   **Moment.js:** For date/time handling on the server.

## Getting Started

### Prerequisites

-   Node.js (v16.x or later recommended)
-   npm or yarn
-   MongoDB (Local installation or a cloud service like MongoDB Atlas)
-   Git

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/[YourUsername]/[YourRepoName].git
    cd [YourRepoName]
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    # or
    yarn install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend # Or your frontend directory name
    npm install
    # or
    yarn install
    ```

### Environment Variables

Environment variables are crucial for configuration and security.

1.  **Backend (`backend/.env`):** Create a `.env` file in the `backend` directory:
    ```dotenv
    PORT=5001                       # Port for the backend server
    MONGO_URI=[Your MongoDB Connection String] # Your MongoDB connection URL
    JWT_SECRET=[Your Secret Key for JWT]     # A strong, random secret key
    # Add other variables if needed (e.g., email service credentials)
    ```

2.  **Frontend (`frontend/.env` or `frontend/.env.development`):** Create a `.env` file (or `.env.development`) in the `frontend` directory:
    ```dotenv
    # URL for the backend API (used by frontend code)
    VITE_API_BASE_URL=http://localhost:5001

    # URL for the backend API Target (used by Vite proxy config)
    VITE_API_TARGET_URL=http://localhost:5001
    ```
    *(Note: Having both might seem redundant if they are the same for development, but `VITE_API_BASE_URL` is read by your React code, while `VITE_API_TARGET_URL` can be read by `vite.config.js` for the proxy setup.)*

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd backend
    npm run start # Or your specific start script (e.g., dev script for nodemon)
    ```
    The backend should start, typically on port 5001 (or the `PORT` specified in `.env`).

2.  **Start the Frontend Development Server:**
    Open a *new terminal window*.
    ```bash
    cd frontend # Or your frontend directory name
    npm run dev
    ```
    The frontend development server (Vite) will start, typically on port 5173.

3.  **Access the Application:** Open your web browser and navigate to `http://localhost:5173`.

## Project Structure

```plaintext
vehicle-rental-system/
├── backend/
│   ├── config/
│   │   └── db.js           # MongoDB connection logic
│   ├── controllers/        # Request handling logic
│   │   ├── admin/          # Admin-specific controllers
│   │   │   ├── bookingAdminController.js
│   │   │   ├── driverAdminController.js
│   │   │   ├── userAdminController.js
│   │   │   └── vehicleAdminController.js
│   │   ├── bookingController.js
│   │   ├── contactController.js
│   │   ├── driverController.js
│   │   ├── userController.js
│   │   └── vehicleController.js
│   ├── models/             # Mongoose schemas
│   │   ├── Booking.js
│   │   ├── ContactMessage.js
│   │   ├── User.js
│   │   └── Vehicle.js
│   ├── routes/             # API endpoint definitions
│   │   ├── admin/          # Admin-specific routes
│   │   │   ├── bookingAdminRoutes.js
│   │   │   ├── driverAdminRoutes.js
│   │   │   ├── userAdminRoutes.js
│   │   │   └── vehicleAdminRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── driverRoutes.js
│   │   ├── userRoutes.js
│   │   └── vehicleRoutes.js
│   ├── utils/              # Utility functions, middleware
│   │   └── verifyToken.js    # Auth middleware (verifyToken, verifyAdmin, verifyDriver)
│   ├── .env                # Environment variables (ignored by git)
│   ├── .gitignore
│   ├── package.json
│   └── server.js           # Express server setup
│
└── frontend/               # React frontend code (Vite setup)
    ├── public/             # Static assets
    ├── src/
    │   ├── assets/         # Images, fonts, etc.
    │   ├── components/     # Reusable UI components
    │   │   ├── Admin/        # Admin-specific components (Layout, Forms, etc.)
    │   │   ├── Driver/       # Driver-specific components (Layout, etc.)
    │   │   ├── Footer.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── VehicleBookingForm.jsx
    │   │   └── ...           # Other shared components
    │   ├── context/        # React Context API
    │   │   └── AuthContext.jsx
    │   ├── pages/          # Page-level components
    │   │   ├── Admin/        # Admin pages
    │   │   ├── Auth/         # Login, Register pages
    │   │   ├── Booking/      # Booking form, confirmation, user list pages
    │   │   ├── Contact/      # Contact page
    │   │   ├── Driver/       # Driver pages
    │   │   ├── Home/         # Home page
    │   │   ├── Vehicle/      # Vehicle list, profile pages
    │   │   └── ...           # Other pages (Not Found, etc.)
    │   ├── App.jsx           # Main application component with routing
    │   ├── index.css         # Global styles (Tailwind base)
    │   └── main.jsx          # Application entry point
    ├── .env                # Frontend environment variables (ignored by git)
    ├── .gitignore
    ├── index.html          # HTML entry point
    ├── package.json
    ├── postcss.config.js   # PostCSS config (for Tailwind)
    ├── tailwind.config.js  # Tailwind config
    └── vite.config.js      # Vite configuration (including proxy)



API Endpoints


Auth:

POST /api/users/register - Register new user/driver

POST /api/users/login - Login user/driver/admin

Vehicles (Public):

GET /api/vehicles/available?params... - Get available vehicles (filtered)

GET /api/vehicles/:id - Get specific vehicle details

GET /api/vehicles/:id/availability - Get booking dates for a vehicle

Bookings (User - Requires Auth):

POST /api/bookings - Create a new booking request

GET /api/bookings/my-bookings - Get bookings for logged-in user

PATCH /api/bookings/:id/cancel - [TODO] Cancel a pending booking

Drivers (Driver - Requires Driver/Admin Auth):

GET /api/drivers/my-bookings - Get assigned bookings for logged-in driver

PATCH /api/drivers/bookings/:id/status - Update assigned booking status

GET /api/drivers/profile - Get logged-in driver's profile

PUT /api/drivers/profile - Update logged-in driver's profile

Admin (Requires Admin Auth):

GET /api/admin/users - Get all users

GET /api/admin/drivers - Get all drivers

POST /api/admin/drivers - Create driver

PUT /api/admin/drivers/:id - Update driver

DELETE /api/admin/drivers/:id - Delete driver

GET /api/admin/drivers/available?params... - Get available drivers for dates

GET /api/admin/vehicles - Get all vehicles

POST /api/admin/vehicles - Create vehicle

PUT /api/admin/vehicles/:id - Update vehicle

DELETE /api/admin/vehicles/:id - Delete vehicle

GET /api/admin/bookings - Get all bookings

PATCH /api/admin/bookings/:id - Update booking (confirm, assign driver, cancel)

GET /api/admin/vehicles/:id - Get vehicle details (admin)

GET /api/admin/drivers/:id - Get driver details (admin)

Contact:

POST /api/contact - Submit contact message

Contributing

Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch (git checkout -b feature/YourFeatureName).

Make your changes.

Commit your changes (git commit -m 'Add some feature').

Push to the branch (git push origin feature/YourFeatureName).

Open a Pull Request.

Please ensure your code follows the existing style and includes tests where applicable.


Acknowledgements

React

Node.js

Express.js

MongoDB

Mongoose

Tailwind CSS

Vite

React Router

React Big Calendar
