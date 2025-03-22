import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import vehiclesRoutes from "./routes/vehicles.js";
import driversRoutes from "./routes/drivers.js";
import usersRoutes from "./routes/users.js";
import bookingsRoutes from "./routes/bookings.js";
import reviewsRoutes from "./routes/reviews.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Routes
app.use("/api/vehicles", vehiclesRoutes);
app.use("/api/drivers", driversRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/reviews", reviewsRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
