const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: "" }, // Changed from URL to a base64 string
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
