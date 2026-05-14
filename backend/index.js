const express = require("express");
const cors = require("cors");
require("dotenv").config();

const progressRoutes = require("./routes/progress");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/progress", progressRoutes);

// Health check
app.get("/", (req, res) => res.send("Fitness Tracker API running ✅"));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error handling
server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});
