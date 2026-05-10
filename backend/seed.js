require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("./db");

const DEMO_USERS = [
  { name: "Sneha Singh", email: "sneha.singh@university.edu", password: "demo1234",  role: "student" },
  { name: "Admin User",  email: "admin@university.edu",       password: "admin1234", role: "admin" },
];

const upsertUser = async (u) => {
  const hashed = await bcrypt.hash(u.password, 10);
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password), role = VALUES(role)`,
      [u.name, u.email, hashed, u.role],
      (err) => (err ? reject(err) : resolve())
    );
  });
};

(async () => {
  try {
    for (const u of DEMO_USERS) {
      await upsertUser(u);
      console.log(`✔ ${u.role.padEnd(8)} ${u.email}`);
    }
    console.log("Demo users seeded.");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  } finally {
    db.end();
  }
})();
