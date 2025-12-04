import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(403).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); //10 → Salt rounds (how many times to scramble)

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Failed to add user" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password); //Checks if the password matches the hashed password in database.
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET); // Generating token

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "isPremium"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("User details error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
