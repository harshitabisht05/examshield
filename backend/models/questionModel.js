const db = require("../db");

module.exports = {
  addQuestion: (exam_id, type, question, optionA, optionB, optionC, optionD, correct_answer, callback) => {
    const query = `
      INSERT INTO questions 
      (exam_id, type, question, optionA, optionB, optionC, optionD, correct_answer)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [exam_id, type, question, optionA, optionB, optionC, optionD, correct_answer], callback);
  },

  findByExamId: (exam_id, callback) => {
    const query = "SELECT * FROM questions WHERE exam_id = ?";
    db.query(query, [exam_id], callback);
  }
};
