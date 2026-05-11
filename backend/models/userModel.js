const db = require("../db");

module.exports = {
  createUser: (name, email, password, role, callback) => {
    const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(query, [name, email, password, role], callback);
  },

  findByRole: (role, callback) => {
    const query = "SELECT id, name, email, role FROM users WHERE role = ?";
    db.query(query, [role], callback);
  },

  updateUser: (id, updates, callback) => {
    const fields = [];
    const values = [];
    if (updates.name) {
      fields.push("name = ?");
      values.push(updates.name);
    }
    if (updates.email) {
      fields.push("email = ?");
      values.push(updates.email);
    }
    if (updates.role) {
      fields.push("role = ?");
      values.push(updates.role);
    }
    if (fields.length === 0) {
      return callback(null, { affectedRows: 0 });
    }
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    db.query(query, values, callback);
  },

  deleteUser: (id, callback) => {
    const query = "DELETE FROM users WHERE id = ?";
    db.query(query, [id], callback);
  },

  findByEmail: (email, callback) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], callback);
  },

  findById: (id, callback) => {
    const query = "SELECT * FROM users WHERE id = ?";
    db.query(query, [id], callback);
  }
};
