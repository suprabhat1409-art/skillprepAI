const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    generatedQuestions: { type: [String], default: [] },
    userAnswers: { type: [String], default: [] },
    feedback: { type: [String], default: [] },
    score: { type: Number, default: 0, min: 0, max: 100 },
    interviewType: { type: String, default: '', trim: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Interview', InterviewSchema);