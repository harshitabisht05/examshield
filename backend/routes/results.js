const express = require("express");
const router = express.Router();
const { resultModel, logModel } = require("../models");
const authMiddleware = require("../middleware/auth");
const allowRoles = require("../middleware/roles");

// GET STUDENT'S RESULTS
router.get("/student/all", authMiddleware, allowRoles("student"), (req, res) => {
  const student_id = req.user.id;

  resultModel.findByStudent(student_id, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (results.length === 0) {
      return res.json({ message: "No results found", results: [] });
    }
    res.json(results);
  });
});

// GET EXAM RESULTS (EXAMINER)
router.get("/exam/:exam_id", authMiddleware, allowRoles("examiner"), (req, res) => {
  const { exam_id } = req.params;

  resultModel.findByExam(exam_id, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (results.length === 0) {
      return res.json({ message: "No results for this exam yet", results: [] });
    }
    res.json(results);
  });
});

// GET SPECIFIC RESULT
router.get("/exam/:exam_id/student/:student_id", authMiddleware, (req, res) => {
  const { exam_id, student_id } = req.params;

  if (req.user.role !== "examiner" && req.user.id !== parseInt(student_id)) {
    return res.status(403).json({ error: "Forbidden: you can only view your own results" });
  }

  resultModel.findByExamAndStudent(exam_id, student_id, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (results.length === 0) {
      return res.status(404).json({ error: "Result not found" });
    }
    res.json(results[0]);
  });
});

// UPDATE RESULT SCORE (MANUAL GRADING)
router.post("/grade", authMiddleware, allowRoles("examiner"), (req, res) => {
  const { result_id, score } = req.body;

  if (!result_id || score === undefined) {
    return res.status(400).json({ error: "result_id and score are required" });
  }

  if (typeof score !== "number" || score < 0) {
    return res.status(400).json({ error: "score must be a non-negative number" });
  }

  resultModel.updateScore(result_id, score, (err) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    logModel.saveLog(req.user.id, "result_graded", { result_id, score }, () => {
      res.json({ message: "Result updated successfully ✅", result_id, score });
    });
  });
});

module.exports = router;
