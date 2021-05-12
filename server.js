const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const PORT = process.env.PORT || 3000;

//Routes
app.use(
  express.static(path.join(__dirname, "public"), {
    extensions: ["html"],
  })
);

//Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Display saved notes
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// Save New Note
app.post("/api/notes", function (req, res) {
  fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const newNote = req.body;
    newNote.id = uuid.v4();
    notes.push(newNote);

    const createNote = JSON.stringify(notes);
    fs.writeFile(path.join(__dirname, "./db/db.json"), createNote, (err) => {
      if (err) throw err;
    });
    res.json(newNote);
  });
});

//Delete Saved Notes
app.delete("/api/notes/:id", function (req, res) {
  const noteID = req.params.id;
  fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const notesArray = notes.filter((item) => {
      return item.id !== noteID;
    });
    fs.writeFile("./db/db.json", JSON.stringify(notesArray), (err, data) => {
      console.log("Note Deleted");
      if (err) throw err;
      res.json(notesArray);
    });
  });
});

app.listen(PORT, function () {
  console.log(`Server started at ${PORT}`);
});
