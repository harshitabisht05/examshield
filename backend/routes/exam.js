const express = require("express");
const router = express.Router();
const { examModel, questionModel, responseModel, resultModel, logModel } = require("../models");
const authMiddleware = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const parseCsvRows = (buffer) => {
  const text = buffer.toString("utf8").trim();
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];

  const header = lines.shift().split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map((h) => h.trim());
  const requiredHeaders = ["exam_id", "type", "question", "optionA", "optionB", "optionC", "optionD", "correct_answer"];

  const missingHeaders = requiredHeaders.filter((field) => !header.includes(field));
  if (missingHeaders.length > 0) {
    throw new Error(`Missing CSV headers: ${missingHeaders.join(", ")}`);
  }

  return lines.map((line, index) => {
    const values = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map((value) => value.trim().replace(/^\"|\"$/g, ""));
    if (values.length !== header.length) {
      throw new Error(`Invalid CSV format on row ${index + 2}`);
    }

    const row = {};
    header.forEach((key, i) => {
      row[key] = values[i] || "";
    });
    return row;
  });
};

// CREATE EXAM
router.post("/create", authMiddleware, allowRoles("examiner"), (req, res) => {
  const { title, duration } = req.body;
  const created_by = req.user.id;

  if (!title || !duration) {
    return res.status(400).json({ error: "title and duration are required" });
  }

  examModel.createExam(title, duration, created_by, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });

    logModel.saveLog(created_by, "exam_created", { examId: result.insertId, title }, () => {});
    res.status(201).json({ message: "Exam created successfully ✅", examId: result.insertId });
  });
});

// ADD QUESTION
router.post("/add-question", authMiddleware, allowRoles("examiner"), (req, res) => {
  const {
    exam_id,
    type,
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correct_answer
  } = req.body;

  if (!exam_id || !type || !question || !correct_answer) {
    return res.status(400).json({ error: "exam_id, type, question and correct_answer are required" });
  }

  if (!["mcq", "subjective"].includes(type)) {
    return res.status(400).json({ error: "type must be either 'mcq' or 'subjective'" });
  }

  if (type === "mcq" && (!optionA || !optionB || !optionC || !optionD)) {
    return res.status(400).json({ error: "All four options are required for MCQ" });
  }

  questionModel.addQuestion(
    exam_id,
    type,
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correct_answer,
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error", details: err });

      logModel.saveLog(req.user.id, "question_added", { exam_id, questionId: result.insertId }, () => {
        res.status(201).json({ message: "Question added successfully ✅", questionId: result.insertId });
      });
    }
  );
});

// LIST ALL EXAMS
router.get("/", authMiddleware, (req, res) => {
  examModel.findAll((err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    res.json(results);
  });
});

// BULK UPLOAD QUESTIONS
router.post(
  "/bulk-upload",
  authMiddleware,
  allowRoles("examiner"),
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "CSV file is required under field name 'file'" });
    }

    let rows;
    try {
      rows = parseCsvRows(req.file.buffer);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const insertQuestion = (row) => {
      return new Promise((resolve, reject) => {
        questionModel.addQuestion(
          row.exam_id,
          row.type,
          row.question,
          row.optionA,
          row.optionB,
          row.optionC,
          row.optionD,
          row.correct_answer,
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });
    };

    try {
      const results = [];
      for (const row of rows) {
        results.push(await insertQuestion(row));
      }
      logModel.saveLog(req.user.id, "bulk_upload", { imported: results.length }, () => {});
      res.json({ message: "Bulk upload completed ✅", imported: results.length });
    } catch (err) {
      res.status(500).json({ error: "Bulk upload failed", details: err.message });
    }
  }
);

// LIST EXAMINER EXAMS
router.get("/mine", authMiddleware, allowRoles("examiner"), (req, res) => {
  examModel.findByCreator(req.user.id, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    res.json(results);
  });
});

const shuffleArray = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const randomizeMcqOptions = (question) => {
  const options = [
    { label: "A", text: question.optionA },
    { label: "B", text: question.optionB },
    { label: "C", text: question.optionC },
    { label: "D", text: question.optionD }
  ].filter((option) => option.text !== null && option.text !== undefined);

  return {
    ...question,
    shuffledOptions: shuffleArray(options)
  };
};

// GET QUESTIONS BY EXAM ID
router.get("/:exam_id", authMiddleware, (req, res) => {
  const { exam_id } = req.params;

  questionModel.findByExamId(exam_id, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });

    if (req.user.role === "student") {
      logModel.saveLog(req.user.id, "exam_started", { exam_id, questionCount: results.length }, () => {});
    }

    const shuffledQuestions = shuffleArray(results);
    const mapped = shuffledQuestions.map((question) => {
      if (question.type === "mcq") {
        return randomizeMcqOptions(question);
      }
      return question;
    });

    res.json(mapped);
  });
});

// SUBMIT EXAM
router.post("/submit", authMiddleware, allowRoles("student"), (req, res) => {
  const { exam_id, answers } = req.body;
  const student_id = req.user.id;

  if (!exam_id || !answers) {
    return res.status(400).json({ error: "exam_id and answers are required" });
  }

  responseModel.findByStudentExam(student_id, exam_id, (err, existing) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (existing.length > 0) {
      return res.status(400).json({ error: "Exam already submitted" });
    }

    responseModel.saveResponse(student_id, exam_id, JSON.stringify(answers), (err) => {
      if (err) return res.status(500).json({ error: "Database error", details: err });

      questionModel.findByExamId(exam_id, (err, questions) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });

        let score = 0;
        questions.forEach((q) => {
          if (answers[q.id] === q.correct_answer) {
            score++;
          }
        });

        resultModel.saveResult(student_id, exam_id, score, (err, result) => {
          if (err) return res.status(500).json({ error: "Database error", details: err });

          logModel.saveLog(student_id, "exam_submitted", { exam_id, score, resultId: result.insertId }, () => {});
          res.json({ message: "Exam submitted ✅", score });
        });
      });
    });
  });
});

module.exports = router;