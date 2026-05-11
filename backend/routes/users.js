const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const { userModel } = require("../models");

// GET all student users for admin/examiner views
router.get("/students", authMiddleware, allowRoles("admin", "examiner"), (req, res) => {
  userModel.findByRole("student", (err, results) => {
    if (err) {
      console.error("Fetch students error:", err);
      return res.status(500).json({ error: "Failed to load students" });
    }

    const students = results.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }));

    res.json({ students });
  });
});

// UPDATE student user
router.patch("/:id", authMiddleware, allowRoles("admin"), (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  userModel.updateUser(id, { name, email, role }, (err, result) => {
    if (err) {
      console.error("Update student error:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Email already in use" });
      }
      return res.status(500).json({ error: "Failed to update student" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student updated successfully" });
  });
});

// DELETE student user
router.delete("/:id", authMiddleware, allowRoles("admin"), (req, res) => {
  const { id } = req.params;

  userModel.deleteUser(id, (err, result) => {
    if (err) {
      console.error("Delete student error:", err);
      return res.status(500).json({ error: "Failed to delete student" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  });
});

module.exports = router;
