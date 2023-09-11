const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: [
    {
      text: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
    },
  ],
  language: { type: String, required: true },
  diffeculty : { type : String , required: true }
});

const Question = mongoose.model("Question", questionSchema);

module.exports = { QuestionModel: Question };
