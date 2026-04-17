const db = require("../db");

module.exports = {
  saveResult: (student_id, exam_id, score, callback) => {
    const query = "INSERT INTO results (student_id, exam_id, score) VALUES (?, ?, ?)";
    db.query(query, [student_id, exam_id, score], callback);
  },

  findByStudent: (student_id, callback) => {
    const query = "SELECT * FROM results WHERE student_id = ?";
    db.query(query, [student_id], callback);
  },

  findByExam: (exam_id, callback) => {
    const query = `
      SELECT r.*, u.name as student_name, u.email as student_email
      FROM results r
      LEFT JOIN users u ON r.student_id = u.id
      WHERE r.exam_id = ?
      ORDER BY r.graded_at DESC
    `;
    db.query(query, [exam_id], callback);
  },

  findByExamAndStudent: (exam_id, student_id, callback) => {
    const query = "SELECT * FROM results WHERE exam_id = ? AND student_id = ?";
    db.query(query, [exam_id, student_id], callback);
  },

  updateScore: (result_id, score, callback) => {
    const query = "UPDATE results SET score = ? WHERE id = ?";
    db.query(query, [score, result_id], callback);
  }
};
