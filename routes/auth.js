const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

// create user with /api/auth dosen't require auth

router.post(
  "/",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "passwaord length should be minimum 5 chars").isLength({
      min: 5,
    }),
    body("name", "enter a valid name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    // console.log(req.body);

    // if there are any error it will throw the error witht the status

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //check with that user with the wmail id already exists
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(401)
          .json({ errors: "Duplicate entries are not allowed." });
      } else {
        user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        res.json({ messge: "User created successfully" });
      }
    } catch (error) {
        res.status(500).send("Internal server error 500")
    }
  }
);

module.exports = router;
