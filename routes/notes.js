const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// Route 1: get all the notes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Notes.find({ user: req.user });
  res.json(notes);
});

// Route 2: add a new notes using post login required
router.post(
  "/addnote",
  [
    body("title", "Enter a valid title").isLength({ min: 5 }),
    body("description", "Enter a valid description").isLength({ min: 5 }),
  ],
  fetchuser,
  async (req, res) => {
    // if there are any error it will throw the error witht the status

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, tag } = req.body;
      const note = await new Notes({
        title,
        description,
        tag,
        user: req.user,
      });
      const savednote = await note.save();
      res.json(savednote);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error 500", error: error });
    }
  }
);

module.exports = router;
