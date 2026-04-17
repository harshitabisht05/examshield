require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const authRoutes = require("./routes/auth");
const examRoutes = require("./routes/exam");
const resultsRoutes = require("./routes/results");
const logsRoutes = require("./routes/logs");
const { apiRateLimit } = require("./middleware/rateLimit");

const app = express();

// Security headers and CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "*",
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.use(express.json({ limit: "10kb" })); // Limit payload size
app.use(apiRateLimit); // General rate limiting

app.use("/api/auth", authRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/results", resultsRoutes);
app.use("/api/logs", logsRoutes);

app.get("/", (req, res) => {
  res.send("ExamShield Backend Running 🚀");
});

app.get("/health", async (req, res) => {
  try {
    await db.promise().query("SELECT 1");
    res.status(200).json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(503).json({ status: "error", database: "unavailable", message: error.message });
  }
});

if (require.main === module) {
  app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
  });
}

module.exports = app;