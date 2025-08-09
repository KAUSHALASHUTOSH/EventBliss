require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes"); // New import
const app = express();
app.use(cors()); // <-- Add this line to enable CORS


app.use(express.json());
const corsOptions = {
    origin: 'https://eventbliss.onrender.com',
    optionsSuccessStatus: 200 // For legacy browser support
};

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully."))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes); // New route for user management

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
