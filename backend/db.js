require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "examshield_user",
  password: process.env.DB_PASSWORD || "ExamShield@123",
  database: process.env.DB_NAME || "examshield",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT ? Number(process.env.DB_CONNECTION_LIMIT) : 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL ✅");
    connection.release();
  }
});

module.exports = pool;
