import express from "express";
import connectDB from "./config/db.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import adminBookingRoutes from "./routes/adminBookingRoutes.js";
import adminVehicleRoutes from "./routes/adminVehiclesRoutes.js";
import driverAdminRoutes from "./routes/adminDriverRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();


app.use(
  cors({
    origin: ["https://ceylonrides.netlify.app", "http://localhost:5173"],
    methods: "GET, POST, PATCH, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

connectDB();

app.use(express.json());

app.use("/api", vehicleRoutes);
app.use("/api", driverRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api/admin", adminBookingRoutes);
app.use("/api/admin", adminVehicleRoutes);
app.use("/api/admin", driverAdminRoutes);
app.use("/api/drivers", driverRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
