const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');

// create user with /api/auth dosen't require auth

router.post(
  "/",
  [
    body("email","Enter a valid email").isEmail(),
    body("password","passwaord length should be minimum 5 chars").isLength({ min: 5 }),
    body("name","enter a valid name").isLength({ min: 3 }),
  ],
  (req, res) => {
    console.log(req.body);
    user = User(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      }).then(user => res.json(user))
      .catch(err => console.log(err)) 
      res.json({"error":"Duplicate entries are not allowed."})
    
  }
);

module.exports = router;
