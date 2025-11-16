const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(403).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

exports.getUserDetails = async (req, res) => {
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

// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");
// require("dotenv").config();

// exports.signup = (req, res) => {
//   const { name, email, password } = req.body;

//   User.findByEmail(email, (err, results) => {
//     if (results.length > 0)
//       return res.status(403).json({ message: "Email already exists" });

//     bcrypt.hash(password, 10, (err, hashedPassword) => {
//       if (err)
//         return res.status(500).json({ message: "Error hashing password" });

//       User.create(name, email, hashedPassword, (err) => {
//         if (err) return res.status(500).json({ message: "Failed to add user" });
//         res.status(201).json({ message: "User added successfully" });
//       });
//     });
//   });
// };

// exports.login = (req, res) => {
//   const { email, password } = req.body;

//   User.findByEmail(email, (err, results) => {
//     if (results.length === 0)
//       return res.status(404).json({ message: "User not found" });

//     const user = results[0];
//     bcrypt.compare(password, user.password, (err, isMatch) => {
//       if (!isMatch)
//         return res.status(401).json({ message: "Incorrect password" });

//       const token = jwt.sign(
//         { id: user.id, email: user.email },
//         process.env.JWT_SECRET,
//         { expiresIn: "24h" }
//       );

//       res.status(200).json({
//         message: "Login successful",
//         token,
//         user: { id: user.id, name: user.name, email: user.email },
//       });
//     });
//   });
// };
