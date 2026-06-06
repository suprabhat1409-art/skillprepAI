const mongoose = require('mongoose');
const Interview = require('../models/Interview');

let genQuestions = null;
let grader = null;
try {
  const mod = require('../ai-agents/interviewAgent');
  genQuestions = mod && mod.generateInterviewQuestions ? mod.generateInterviewQuestions : null;
  grader = mod && mod.gradeInterview ? mod.gradeInterview : null;
} catch (e) {
  genQuestions = null;
  grader = null;
}

async function startInterview(req, res) {
  try {
    const { userId, interviewType, topic } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Valid userId is required' });
    }

    const questions = typeof genQuestions === 'function'
      ? await genQuestions({ interviewType: interviewType || '', topic: topic || '' })
      : [
        'Tell me about yourself.',
        'Describe a challenging bug you fixed.',
        'How do you optimize database queries?'
      ];

    const interview = await Interview.create({ user: userId, generatedQuestions: questions, interviewType: interviewType || '' });

    return res.status(201).json({ interviewId: interview._id, generatedQuestions: questions });
  } catch (error) {
    console.error('Start interview error:', error);
    return res.status(500).json({ error: 'Failed to start interview' });
  }
}

async function submitInterview(req, res) {
  try {
    const { interviewId, userAnswers } = req.body;

    if (!interviewId || !mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ error: 'Valid interviewId is required' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    const answers = Array.isArray(userAnswers) ? userAnswers : (typeof userAnswers === 'string' ? [userAnswers] : []);

    let score = 0;
    let feedback = [];
    if (typeof grader === 'function') {
      const result = await grader({ questions: interview.generatedQuestions, answers });
      score = result.score || 0;
      feedback = result.feedback || [];
    } else {
      // simple scoring stub
      score = Math.min(100, answers.length * 20);
      feedback = answers.map((a, i) => `Answer ${i + 1}: received`);
    }

    interview.userAnswers = answers;
    interview.score = score;
    interview.feedback = feedback;
    await interview.save();

    return res.json({ interviewId: interview._id, score, feedback });
  } catch (error) {
    console.error('Submit interview error:', error);
    return res.status(500).json({ error: 'Failed to submit interview' });
  }
}

async function historyByUser(req, res) {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    const records = await Interview.find({ user: userId }).sort({ createdAt: -1 });
    return res.json({ interviews: records });
  } catch (error) {
    console.error('Interview history error:', error);
    return res.status(500).json({ error: 'Failed to fetch interview history' });
  }
}

module.exports = {
  startInterview,
  submitInterview,
  historyByUser
};
