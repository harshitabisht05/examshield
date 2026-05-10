const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authRateLimit } = require("../middleware/rateLimit");
const auth = require("../middleware/auth");

router.post("/register", authRateLimit, authController.register);
router.post("/login", authRateLimit, authController.login);
router.get("/me", auth, authController.me);

module.exports = router;