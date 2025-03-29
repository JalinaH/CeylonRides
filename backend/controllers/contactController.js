import ContactMessage from "../models/contactMessage.js";

// Create a new contact message
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic server-side check (Mongoose validation is primary)
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, Email, and Message are required." });
    }

    const newMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
    });

    const savedMessage = await newMessage.save();

    // Send success response
    res.status(201).json({
      message: "Your message has been sent successfully!",
      data: savedMessage, // Optionally return saved data (or just ID)
    });
  } catch (error) {
    console.error("Error saving contact message:", error);
    if (error.name === "ValidationError") {
      // Extract validation messages
      const errors = Object.values(error.errors).map((el) => el.message);
      return res
        .status(400)
        .json({ error: "Validation failed.", details: errors });
    }
    res.status(500).json({ error: "Server error while sending message." });
  }
};

// Optional: Add functions later for admin to view/manage messages
// export const getAllMessages = async (req, res) => { ... }
// export const markMessageAsRead = async (req, res) => { ... }
// export const deleteMessage = async (req, res) => { ... }
