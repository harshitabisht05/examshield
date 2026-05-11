const db = require("../db");

module.exports = {
  createExam: (title, duration, starts_at, created_by, callback) => {
    const query = "INSERT INTO exams (title, duration, starts_at, created_by) VALUES (?, ?, ?, ?)";
    db.query(query, [title, duration, starts_at, created_by], callback);
  },

  findById: (id, callback) => {
    const query = "SELECT * FROM exams WHERE id = ?";
    db.query(query, [id], callback);
  },

  findByCreator: (created_by, callback) => {
    const query = `
      SELECT e.id, e.title, e.duration, e.starts_at, e.created_by, u.name AS examiner_name
      FROM exams e
      LEFT JOIN users u ON e.created_by = u.id
      WHERE e.created_by = ?
    `;
    db.query(query, [created_by], callback);
  },

  findAll: (callback) => {
    const query = `
      SELECT e.id, e.title, e.duration, e.starts_at, e.created_by, u.name AS examiner_name
      FROM exams e
      LEFT JOIN users u ON e.created_by = u.id
      ORDER BY e.id DESC
    `;
    db.query(query, callback);
  },

  updateExam: (id, updates, callback) => {
    const fields = [];
    const values = [];
    if (updates.title) {
      fields.push("title = ?");
      values.push(updates.title);
    }
    if (updates.duration) {
      fields.push("duration = ?");
      values.push(updates.duration);
    }
    if (updates.startsAt) {
      fields.push("starts_at = ?");
      values.push(updates.startsAt);
    }
    if (fields.length === 0) {
      return callback(null, { affectedRows: 0 });
    }
    const query = `UPDATE exams SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    db.query(query, values, callback);
  },

  deleteExam: (id, callback) => {
    const query = "DELETE FROM exams WHERE id = ?";
    db.query(query, [id], callback);
  }
};
