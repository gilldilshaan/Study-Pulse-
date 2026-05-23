const express = require("express");
const router = express.Router();   // 🔥 THIS LINE WAS MISSING
const mongoose = require("mongoose");
const crypto = require("crypto");

/* LOGIN */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // 🔥 stable ObjectId from email
  const hash = crypto
    .createHash("md5")
    .update(email)
    .digest("hex")
    .slice(0, 24);

  const userId = new mongoose.Types.ObjectId(hash);

  const user = {
    _id: userId,
    name: "Demo Student",
    email
  };

  res.json({
    user,
    token: "demo-token"
  });
});

module.exports = router;