const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    completedTasks: { type: [String], default: [] },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    streakCount: { type: Number, default: 0, min: 0 },
    badges: { type: [String], default: [] }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Progress', ProgressSchema);