const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weeklyGoals: { type: [String], default: [] },
    milestones: { type: [String], default: [] },
    completionStatus: { type: String, default: 'Not Started', trim: true },
    targetRole: { type: String, default: '', trim: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Roadmap', RoadmapSchema);