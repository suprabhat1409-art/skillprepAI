const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String, required: true, trim: true },
    extractedSkills: { type: [String], default: [] },
    atsScore: { type: Number, default: 0, min: 0, max: 100 },
    suggestions: { type: [String], default: [] },
    targetRole: { type: String, default: '', trim: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Resume', ResumeSchema);