const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authRateLimit } = require("../middleware/rateLimit");

router.post("/register", authRateLimit, authController.register);
router.post("/login", authRateLimit, authController.login);

module.exports = router;