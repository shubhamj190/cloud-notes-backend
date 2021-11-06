const express = require("express");
const router = express.Router();
const User = require("../models/User");

// create user with /api/auth dosen't require auth

router.post("/", (req, res) => {
  console.log(req.body);
  user = User(req.body);
  console.log(user)
  user.save();
  res.json({ message: "I've got the body" });
});

module.exports = router;
