const express = require("express");
const Session = require("../models/session");
const User = require("../models/user");

const sessionRoutes = express.Router();

sessionRoutes.post("/sessions", async (req, res) => {
  const { subject, date, studentId, tutorId } = req.body;

  if (!subject) return res.status(400).json({ message: "Subject is required" });
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return res.status(400).json({ message: "Invalid date" });

  try {
    const student = await User.findById(studentId);
    const tutor = await User.findById(tutorId);

    if (!student || student.role !== "student") {
      return res.status(400).json({ message: "Invalid student" });
    }

    if (!tutor || tutor.role !== "tutor") {
      return res.status(400).json({ message: "Invalid tutor" });
    }

    const newSession = new Session({ subject, date, studentId, tutorId });
    await newSession.save();
    return res.status(201).json({ message: "Session created", newSession });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = sessionRoutes;
