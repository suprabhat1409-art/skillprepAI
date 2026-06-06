const { chat } = require('./openaiClient');

function tryParseJsonMaybe(raw) {
  if (!raw || typeof raw !== 'string') return null;
  // direct parse
  try { return JSON.parse(raw); } catch (e) {}

  // attempt to extract JSON substring between first { and last }
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    const substr = raw.slice(start, end + 1);
    try { return JSON.parse(substr); } catch (e) {}
  }

  return null;
}

async function analyzeResumeAgent(resumeText) {
  const system = {
    role: 'system',
    content: 'You are an expert resume analyst. ALWAYS respond with a single valid JSON object and nothing else.'
  };

  const schema = `JSON schema (required keys):\n- atsScore: integer 0-100\n- missingSkills: array of strings\n- strengths: array of strings\n- weaknesses: array of strings\n- suggestions: array of strings`;

  const user = {
    role: 'user',
    content: `Analyze the resume below and output ONLY a single valid JSON object that conforms to the schema exactly (no surrounding text). ${schema}\nResume:\n"""${String(resumeText || '')}"""`
  };

  const raw = await chat([system, user]);

  const parsed = tryParseJsonMaybe(raw);
  if (parsed) {
    return {
      atsScore: Number.isFinite(parsed.atsScore) ? Math.max(0, Math.min(100, Number(parsed.atsScore))) : 0,
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
    };
  }

  // fallback structured response
  return {
    atsScore: 0,
    missingSkills: [],
    strengths: [],
    weaknesses: [],
    suggestions: [String(raw || 'No valid JSON produced by model.')]
  };
}

module.exports = { analyzeResumeAgent };
