const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { analyzeResume } = require('./ai-agents/resumeAnalyzer');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const skillRoutes = require('./routes/skillRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/progress', progressRoutes);

app.get('/api/ping', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'dev' });
});

app.post('/api/agents/analyze-resume', async (req, res) => {
  const { resumeText } = req.body;

  try {
    const report = await analyzeResume(resumeText || '');
    return res.json({ report });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'agent error' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;