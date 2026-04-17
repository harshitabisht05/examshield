const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models");
const { validateEmail, validatePassword, validateName, validateRole, sanitizeInput } = require("../middleware/validation");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate inputs
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "name, email, password and role are required" });
  }

  if (!validateName(name)) {
    return res.status(400).json({ error: "Invalid name: must be 1-100 characters" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  if (!validateRole(role)) {
    return res.status(400).json({ error: "Invalid role: must be admin, examiner, or student" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    userModel.createUser(sanitizedName, sanitizedEmail, hashedPassword, role, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "Email already in use" });
        }
        console.error("Registration error:", err);
        return res.status(500).json({ error: "Registration failed" });
      }
      res.status(201).json({ message: "User registered successfully ✅", userId: result.insertId });
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const sanitizedEmail = sanitizeInput(email).toLowerCase();

  userModel.findByEmail(sanitizedEmail, async (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "Login failed" });
    }
    if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ token, role: user.role, expiresIn: JWT_EXPIRES_IN });
  });
};
