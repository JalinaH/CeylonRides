import express from "express";
import connectDB from "./config/db.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

connectDB();

app.use(express.json());

// Routes
app.use("/api", vehicleRoutes);
app.use("/api", driverRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api", userRoutes);
app.use("/api/contact", contactRoutes); 
app.use("/api/admin", adminUserRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
