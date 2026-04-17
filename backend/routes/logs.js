const express = require("express");
const router = express.Router();
const { logModel } = require("../models");
const authMiddleware = require("../middleware/auth");
const allowRoles = require("../middleware/roles");

router.post("/event", authMiddleware, (req, res) => {
  const user_id = req.user.id;
  const { action, metadata } = req.body;

  if (!action) {
    return res.status(400).json({ error: "action is required" });
  }

  logModel.saveLog(user_id, action, metadata || {}, (err, result) => {
    if (err) {
      console.error("Log save error:", err);
      return res.status(500).json({ error: "Failed to save activity log" });
    }
    res.status(201).json({ message: "Activity logged ✅", logId: result.insertId });
  });
});

router.get("/me", authMiddleware, (req, res) => {
  const user_id = req.user.id;

  logModel.findByUser(user_id, (err, results) => {
    if (err) {
      console.error("Log fetch error:", err);
      return res.status(500).json({ error: "Unable to fetch activity logs" });
    }
    res.json(results);
  });
});

router.get("/user/:user_id", authMiddleware, allowRoles("admin"), (req, res) => {
  const { user_id } = req.params;

  logModel.findByUser(user_id, (err, results) => {
    if (err) {
      console.error("Log fetch error:", err);
      return res.status(500).json({ error: "Unable to fetch activity logs" });
    }
    res.json(results);
  });
});

module.exports = router;
