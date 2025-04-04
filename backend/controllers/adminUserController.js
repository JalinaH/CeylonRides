import User from "../models/user.js";

export const adminGetAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Admin Get All Users Error:", error);
    res.status(500).json({ error: "Server error fetching users." });
  }
};

