const { chat } = require('./openaiClient');

async function analyzeResume(resumeText) {
  const system = { role: 'system', content: 'You are a resume analysis assistant. Return JSON only.' };
  const user = {
    role: 'user',
    content: `Analyze this resume for skills and ATS fit. Return JSON with keys: atsScore (0-100), keywordsFound ([]), missingKeywords ([]), suggestions ([]), summary (string). Resume: """${String(resumeText || '')}"""`
  };

  const raw = await chat([system, user]);
  try {
    return JSON.parse(raw);
  } catch (e) {
    return {
      atsScore: 0,
      keywordsFound: [],
      missingKeywords: [],
      suggestions: [],
      summary: String(raw || '')
    };
  }
}

module.exports = { analyzeResume };
async function analyzeResume(resumeText) {
  return {
    atsScore: 72,
    keywordsFound: ['JavaScript', 'React', 'Node.js'],
    missingKeywords: ['TypeScript', 'Docker'],
    summary: 'Stub analysis - replace with AI integration.'
  };
}

module.exports = { analyzeResume };