const mongoose = require('mongoose');
const Progress = require('../models/Progress');

async function getProgressByUser(req, res) {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    const progress = await Progress.findOne({ user: userId }).sort({ createdAt: -1 });
    if (!progress) {
      return res.status(404).json({ error: 'No progress found for this user' });
    }

    return res.json({ progress });
  } catch (error) {
    console.error('Fetch progress error:', error);
    return res.status(500).json({ error: 'Failed to fetch progress' });
  }
}

async function updateProgress(req, res) {
  try {
    const { userId, updates } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Valid userId is required' });
    }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ error: 'Updates object is required' });
    }

    const progress = await Progress.findOneAndUpdate({ user: userId }, { $set: updates }, { new: true, upsert: true });

    return res.json({ progress });
  } catch (error) {
    console.error('Update progress error:', error);
    return res.status(500).json({ error: 'Failed to update progress' });
  }
}

module.exports = {
  getProgressByUser,
  updateProgress
};
