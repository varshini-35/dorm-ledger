// src/routes/auth.js
const express = require("express");
const router = express.Router();
const { auth } = require("../services/firebase"); // make sure this exists

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email } = req.body;

  // Validate input
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  console.log("Received login request for email:", email); // temp debug

  try {
    // Get user from Firebase Auth
    const user = await auth.getUserByEmail(email);

    // Success response
    return res.status(200).json({
      message: "User verified",
      uid: user.uid,
      email: user.email,
    });
  } catch (error) {
    console.error("Firebase error:", error.code); // temp debug
    return res.status(401).json({
      message: "User not found in Firebase Auth",
    });
  }
});

module.exports = router;



