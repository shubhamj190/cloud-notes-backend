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
// <-------------------------------------------------------------------------------------------------------->
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

// <-------------------------------------------------------------------------------------------------------->
// Route 3: edit notes notes using put request login required
router.put(
  "/updatenote/:id",
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
      // create a new note object
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      // find the note to be update

      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("not found");
      }
      if (note.user.toString() !== req.user) {
        console.log("this is true");
        return res.status(401).send("access denied");
      }
      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      console.log("this isa note", note);
      res.json({ note });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error 500", error: error });
    }
  }
);

// <-------------------------------------------------------------------------------------------------------->
// Route 4: delete notes notes using delete request login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // find the note to be deleted

    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not found");
    }
    if (note.user.toString() !== req.user) {
      console.log("this is true");
      return res.status(401).send("access denied");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    
    res.json({ "success":"note has been deleted " });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error 500", error: error });
  }
});
module.exports = router;
