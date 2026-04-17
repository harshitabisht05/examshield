const db = require("../db");

module.exports = {
  createUser: (name, email, password, role, callback) => {
    const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(query, [name, email, password, role], callback);
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
