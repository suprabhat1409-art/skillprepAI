const mongoose = require('mongoose');
const SkillAnalysis = require('../models/SkillAnalysis');
const { analyzeResume } = require('../ai-agents/resumeAnalyzer');

async function analyzeSkills(req, res) {
  try {
    const { resumeText, userId } = req.body;

    const report = await analyzeResume(String(resumeText || ''));

    const payload = {
      matchedSkills: Array.isArray(report.keywordsFound) ? report.keywordsFound : (report.keywordsFound ? [report.keywordsFound] : []),
      missingSkills: Array.isArray(report.missingKeywords) ? report.missingKeywords : (report.missingKeywords ? [report.missingKeywords] : []),
      recommendedCourses: Array.isArray(report.recommendedCourses) ? report.recommendedCourses : (report.recommendedCourses ? [report.recommendedCourses] : []),
      recommendedProjects: Array.isArray(report.recommendedProjects) ? report.recommendedProjects : (report.recommendedProjects ? [report.recommendedProjects] : [])
    };

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId' });
      }

      const analysis = await SkillAnalysis.create({ user: userId, ...payload });
      return res.status(201).json({ analysis, report });
    }

    return res.json({ report, analysis: payload });
  } catch (error) {
    console.error('Skill analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze skills' });
  }
}

async function getAnalysisByUser(req, res) {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    const analysis = await SkillAnalysis.findOne({ user: userId }).sort({ createdAt: -1 });
    if (!analysis) {
      return res.status(404).json({ error: 'No skill analysis found for this user' });
    }

    return res.json({ analysis });
  } catch (error) {
    console.error('Fetch skill analysis error:', error);
    return res.status(500).json({ error: 'Failed to fetch skill analysis' });
  }
}

module.exports = {
  analyzeSkills,
  getAnalysisByUser
};
