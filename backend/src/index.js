const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/api/ping', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'dev' }));

// Simple agent route (stub)
app.post('/api/agents/analyze-resume', async (req, res) => {
  const { resumeText } = req.body;
  // In real implementation, call AI agent modules here
  const { analyzeResume } = require('./agents/resumeAnalyzer');
  try {
    const report = await analyzeResume(resumeText || '');
    return res.json({ report });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'agent error' });
  }
});

// connect to MongoDB if URI provided
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((e) => console.warn('MongoDB connection failed', e.message));
}

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
