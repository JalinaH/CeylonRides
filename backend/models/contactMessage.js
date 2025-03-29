import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address."], // Basic email validation
    },
    subject: {
      type: String,
      trim: true,
      default: "General Inquiry", // Optional default
    },
    message: {
      type: String,
      required: [true, "Message cannot be empty."],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt automatically

export default mongoose.model("ContactMessage", contactMessageSchema);
