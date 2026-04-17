-- ExamShield MySQL schema migration

CREATE DATABASE IF NOT EXISTS examshield;
USE examshield;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','examiner','student') NOT NULL
);

CREATE TABLE IF NOT EXISTS exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  created_by INT NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_exams_created_by ON exams(created_by);

CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  exam_id INT NOT NULL,
  type ENUM('mcq','subjective') NOT NULL,
  question TEXT NOT NULL,
  optionA TEXT,
  optionB TEXT,
  optionC TEXT,
  optionD TEXT,
  correct_answer TEXT,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);
CREATE INDEX idx_questions_exam_id ON questions(exam_id);

CREATE TABLE IF NOT EXISTS responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  exam_id INT NOT NULL,
  answers JSON NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  UNIQUE KEY unique_submission (student_id, exam_id)
);

CREATE TABLE IF NOT EXISTS results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  exam_id INT NOT NULL,
  score INT NOT NULL,
  graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  UNIQUE KEY unique_result (student_id, exam_id)
);
CREATE INDEX idx_results_student_id ON results(student_id);
CREATE INDEX idx_results_exam_id ON results(exam_id);

CREATE TABLE IF NOT EXISTS logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  metadata JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX idx_logs_user_id ON logs(user_id);
