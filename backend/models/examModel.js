const db = require("../db");

module.exports = {
  createExam: (title, duration, created_by, callback) => {
    const query = "INSERT INTO exams (title, duration, created_by) VALUES (?, ?, ?)";
    db.query(query, [title, duration, created_by], callback);
  },

  findById: (id, callback) => {
    const query = "SELECT * FROM exams WHERE id = ?";
    db.query(query, [id], callback);
  },

  findByCreator: (created_by, callback) => {
    const query = `
      SELECT e.id, e.title, e.duration, e.created_by, u.name AS examiner_name
      FROM exams e
      LEFT JOIN users u ON e.created_by = u.id
      WHERE e.created_by = ?
    `;
    db.query(query, [created_by], callback);
  },

  findAll: (callback) => {
    const query = `
      SELECT e.id, e.title, e.duration, e.created_by, u.name AS examiner_name
      FROM exams e
      LEFT JOIN users u ON e.created_by = u.id
      ORDER BY e.id DESC
    `;
    db.query(query, callback);
  }
};
