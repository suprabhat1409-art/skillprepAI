const mongoose = require('mongoose');

const SkillAnalysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    missingSkills: { type: [String], default: [] },
    matchedSkills: { type: [String], default: [] },
    recommendedCourses: { type: [String], default: [] },
    recommendedProjects: { type: [String], default: [] }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('SkillAnalysis', SkillAnalysisSchema);