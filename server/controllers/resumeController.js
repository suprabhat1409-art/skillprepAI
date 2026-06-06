const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const Resume = require('../models/Resume');

async function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    // Prefer authenticated user id if available
    const userId = (req.user && req.user.userId) ? req.user.userId : req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required to link the resume to a User' });
    }

    const resumeUrl = `/uploads/${path.basename(req.file.path)}`;
    const extractedSkills = Array.isArray(req.body.extractedSkills)
      ? req.body.extractedSkills
      : typeof req.body.extractedSkills === 'string' && req.body.extractedSkills.length > 0
        ? req.body.extractedSkills.split(',').map((skill) => skill.trim()).filter(Boolean)
        : [];

    const suggestions = Array.isArray(req.body.suggestions)
      ? req.body.suggestions
      : typeof req.body.suggestions === 'string' && req.body.suggestions.length > 0
        ? req.body.suggestions.split(',').map((item) => item.trim()).filter(Boolean)
        : [];

    const atsScore = req.body.atsScore === undefined || req.body.atsScore === null || req.body.atsScore === ''
      ? 0
      : Number(req.body.atsScore);

    const resume = await Resume.create({
      user: userId,
      resumeUrl,
      extractedSkills,
      atsScore: Number.isNaN(atsScore) ? 0 : atsScore,
      suggestions,
      targetRole: req.body.targetRole ? String(req.body.targetRole).trim() : ''
    });

    return res.status(201).json({
      message: 'Resume uploaded successfully',
      resume: {
        id: resume._id,
        user: resume.user,
        resumeUrl: resume.resumeUrl,
        extractedSkills: resume.extractedSkills,
        atsScore: resume.atsScore,
        suggestions: resume.suggestions,
        targetRole: resume.targetRole,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt
      }
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    return res.status(500).json({ error: 'Failed to upload resume' });
  }
}

async function getResumeByUser(req, res) {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    // ensure requester is the same user
    if (!req.user || req.user.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const resume = await Resume.findOne({ user: userId }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found for this user' });
    }

    return res.json({
      resume: {
        id: resume._id,
        user: resume.user,
        resumeUrl: resume.resumeUrl,
        extractedSkills: resume.extractedSkills,
        atsScore: resume.atsScore,
        suggestions: resume.suggestions,
        targetRole: resume.targetRole,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt
      }
    });
  } catch (error) {
    console.error('Fetch resume error:', error);
    return res.status(500).json({ error: 'Failed to fetch resume' });
  }
}

async function deleteResume(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid resume id' });
    }

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // ensure requester owns the resume
    if (!req.user || req.user.userId !== String(resume.user)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const fileName = path.basename(resume.resumeUrl || '');
    const filePath = path.join(__dirname, '..', 'uploads', fileName);

    if (fileName && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Resume.deleteOne({ _id: id });

    return res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    return res.status(500).json({ error: 'Failed to delete resume' });
  }
}

module.exports = {
  uploadResume,
  getResumeByUser,
  deleteResume
};