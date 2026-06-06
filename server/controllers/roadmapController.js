const mongoose = require('mongoose');
const Roadmap = require('../models/Roadmap');

let generateRoadmap = null;
try {
  const mod = require('../ai-agents/roadmapGenerator');
  generateRoadmap = mod && mod.generateRoadmap ? mod.generateRoadmap : null;
} catch (e) {
  // optional AI generator not present — will use stub
  generateRoadmap = null;
}

async function generate(req, res) {
  try {
    const { resumeText, userId, targetRole } = req.body;

    // If ai generator exists, use it; otherwise return a stub
    const roadmapContent = typeof generateRoadmap === 'function'
      ? await generateRoadmap({ resumeText: String(resumeText || ''), targetRole: String(targetRole || '') })
      : {
          weeklyGoals: ['Study core concepts', 'Build small project'],
          milestones: ['Complete basics', 'Publish project'],
          completionStatus: 'Not Started',
          targetRole: targetRole || ''
        };

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId' });
      }

      const roadmap = await Roadmap.create({ user: userId, ...roadmapContent });
      return res.status(201).json({ roadmap });
    }

    return res.json({ roadmap: roadmapContent });
  } catch (error) {
    console.error('Roadmap generate error:', error);
    return res.status(500).json({ error: 'Failed to generate roadmap' });
  }
}

async function getByUser(req, res) {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    const roadmap = await Roadmap.findOne({ user: userId }).sort({ createdAt: -1 });
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found for this user' });
    }

    return res.json({ roadmap });
  } catch (error) {
    console.error('Fetch roadmap error:', error);
    return res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
}

async function updateRoadmap(req, res) {
  try {
    const { userId, updates } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Valid userId is required' });
    }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ error: 'Updates object is required' });
    }

    const roadmap = await Roadmap.findOneAndUpdate({ user: userId }, { $set: updates }, { new: true, upsert: false }).sort({ createdAt: -1 });

    if (!roadmap) {
      return res.status(404).json({ error: 'No roadmap found to update for this user' });
    }

    return res.json({ roadmap });
  } catch (error) {
    console.error('Update roadmap error:', error);
    return res.status(500).json({ error: 'Failed to update roadmap' });
  }
}

module.exports = {
  generate,
  getByUser,
  updateRoadmap
};
