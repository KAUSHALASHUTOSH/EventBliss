const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Event = require("../models/Event");

router.put("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!["owner", "admin"].includes(decoded.role)) {
      return res.status(403).json({ message: "Permission denied" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, description: req.body.description },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(updatedEvent);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;