const db = require("../db");

module.exports = {
  saveResponse: (student_id, exam_id, answers, callback) => {
    const query = "INSERT INTO responses (student_id, exam_id, answers) VALUES (?, ?, ?)";
    db.query(query, [student_id, exam_id, answers], callback);
  },

  findByStudentExam: (student_id, exam_id, callback) => {
    const query = "SELECT * FROM responses WHERE student_id = ? AND exam_id = ?";
    db.query(query, [student_id, exam_id], callback);
  }
};
