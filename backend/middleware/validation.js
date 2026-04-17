// Input validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateName = (name) => {
  return name && name.trim().length > 0 && name.trim().length <= 100;
};

const validateExamTitle = (title) => {
  return title && title.trim().length > 0 && title.trim().length <= 255;
};

const validateDuration = (duration) => {
  const num = parseInt(duration);
  return !isNaN(num) && num > 0 && num <= 480; // max 8 hours
};

const validateQuestion = (question) => {
  return question && question.trim().length > 0;
};

const validateRole = (role) => {
  return ["admin", "examiner", "student"].includes(role);
};

const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().substring(0, 1000); // Limit length
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validateExamTitle,
  validateDuration,
  validateQuestion,
  validateRole,
  sanitizeInput
};
