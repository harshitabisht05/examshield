const db = require("../db");

module.exports = {
  saveLog: (user_id, action, metadata, callback) => {
    const query = "INSERT INTO logs (user_id, action, metadata) VALUES (?, ?, ?)";
    db.query(query, [user_id, action, JSON.stringify(metadata || {})], callback);
  },

  findByUser: (user_id, callback) => {
    const query = "SELECT * FROM logs WHERE user_id = ? ORDER BY timestamp DESC";
    db.query(query, [user_id], callback);
  }
};
