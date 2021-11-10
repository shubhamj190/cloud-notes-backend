const express = require("express");
const router = express.Router();
const User = require("../models/User");
var bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "redminote3kenzopocophonepocof1";
const fetchuser=require('../middleware/fetchUser')

// create user with /api/auth dosen't require auth

router.post(
  "/createuser/",
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
        const salt = await bcrypt.genSalt(10);
        const secupassword = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secupassword,
        });

        const data = {
          id: user._id,
        };

        const jwtData = jwt.sign(data, JWT_SECRET);

        res.json({ jwtData });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error 500", error: error });
    }
  }
);
// <---------------------------------------------------------------------------------------------------------------->
// authenticate a user using /api/auth/login
router.post(
  "/login/",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blanked").exists({
      min: 5,
    }),
  ],
  async (req, res) => {
    // if there are any error it will throw the error witht the status
    let success=false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      // console.log(user.password);

      if (!email) {
        return res
          .status(400)
          .json({success, message: "please login with correct credentials1" });
      }
      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        return res
          .status(400)
          .json({ success, message: "please login with correct credentials2" });
      }
      success=true
      const data = {
        id: user._id,
      };
      const jwtData = jwt.sign(data, JWT_SECRET);
      success=true
      res.json({ jwtData , success});
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error 500", error: error });
    }
  }
);
// <---------------------------------------------------------------------------------------------------------------->
// get all the information of the logged user using the path /api/auth/getuser
router.post("/getuser/", fetchuser, async (req, res) => {
  try {
    userID=req.user
    console.log(req.user.id)
    const user= await User.findById(userID).select('-password')
    res.json(user)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error 500", error: error });
  }
});

module.exports = router;
