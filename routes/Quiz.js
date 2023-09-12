const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { QuestionModel } = require("../model/Question.js");
const { LanguageModel } = require("../model/Language.js");
const { UserModel } = require("../model/User");
const { scoreCalculator } = require("../controller/score");
const { scoreModel } = require("../model/QuizResult.js");

const data = {
  text: "हिंदी में संज्ञा के कितने विभक्ति होते हैं?",
  options: [
    { text: "1", isCorrect: false },
    { text: "2", isCorrect: false },
    { text: "3", isCorrect: true },
    { text: "4", isCorrect: false }
  ],
  language: "Hindi",
  diffeculty: "Hard",
};

// Route to create a new question
router.post("/questions", async (req, res) => {
  try {
    const question = await QuestionModel.create(data);
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to get questions by language
router.get("/questions", async (req, res) => {
  const { lang } = req.query;
  // console.log("bodyData ", bodyData);
  try {
    const questions = await QuestionModel.find({ language: lang }).limit(10);
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to create a new language
router.post("/languages", async (req, res) => {
  try {
    const language = await LanguageModel.create({ name: "Hindi" });
    res.status(201).json(language);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to get all languages
router.get("/languages", async (req, res) => {
  try {
    const languages = await LanguageModel.find();
    res.status(200).json(languages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/quiz/submit", (req, res) => {
  // Extract user data from the request body
  const token = req.headers.authorization;
  const data = req.body;
  console.log("Userresponse: ", data.userResponse);

  if (!token) {
    return res.status(400).json({ error: "No credentials sent!" });
  }

  const newToken = token.split(" ")[1];

  jwt.verify(newToken, process.env.SECKET_KEY, async (err, decoded) => {
    console.log("Decoded token: ", decoded);
    if (err) {
      res.status(400).json("invalid Token");
      // Handle invalid token here
    } else {
      console.log("decoded : ",decoded);
      // Token is valid, you can access `decoded` here
      const user = await UserModel.findOne({ email: decoded.email });
      const questions = await QuestionModel.find({ language: data.lang }).limit(
        10
      );
      const score = scoreCalculator(questions, data.userResponse);
      const savedScore = await scoreModel.create({ email: user.email, score });
      res.send(savedScore);
    }
  });
});

// Define a route to get all scores in descending order
router.get('/quiz/scores', async (req, res) => {
  try {
    const scores = await scoreModel.find().sort({ score: -1 }); // Sort by 'score' in descending order
    res.json(scores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = { QuizRouter: router };
