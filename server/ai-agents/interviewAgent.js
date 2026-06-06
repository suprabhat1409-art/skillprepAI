const { chat } = require('./openaiClient');

function tryParseJsonMaybe(raw) {
  if (!raw || typeof raw !== 'string') return null;
  try { return JSON.parse(raw); } catch (e) {}
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    const substr = raw.slice(start, end + 1);
    try { return JSON.parse(substr); } catch (e) {}
  }
  return null;
}

/**
 * prepareInterviewKit
 * - targetRole: string
 * - skills: array of strings
 * - level: 'junior'|'mid'|'senior' optional
 *
 * Returns:
 * { technicalQuestions: [{question, difficulty}], hrQuestions: [], feedback: string template, difficultyBreakdown: {easy:int,medium:int,hard:int}, confidence:0-100 }
 */
async function prepareInterviewKit({ targetRole = '', skills = [], level = 'mid' } = {}) {
  const system = {
    role: 'system',
    content: 'You are an expert interview coach. ALWAYS respond with a single valid JSON object and nothing else.'
  };

  const schema = `JSON schema (required keys):\n- technicalQuestions: array of objects { question: string, difficulty: 'easy'|'medium'|'hard' }\n- hrQuestions: array of strings\n- feedback: string (template for interviewer feedback)\n- difficultyBreakdown: object { easy: int, medium: int, hard: int }\n- confidence: int 0-100`;

  const userParts = [];
  userParts.push(`Target role: ${String(targetRole || '')}`);
  userParts.push(`Level: ${String(level || '')}`);
  userParts.push(`Skills:\n- ${Array.isArray(skills) ? skills.join('\n- ') : String(skills)}`);

  const user = {
    role: 'user',
    content: `Generate interview content and output ONLY a single valid JSON object that conforms to the schema exactly (no surrounding text). ${schema}\n\n${userParts.join('\n\n')}`
  };

  const raw = await chat([system, user]);
  const parsed = tryParseJsonMaybe(raw);
  if (parsed) {
    return {
      technicalQuestions: Array.isArray(parsed.technicalQuestions) ? parsed.technicalQuestions : [],
      hrQuestions: Array.isArray(parsed.hrQuestions) ? parsed.hrQuestions : [],
      feedback: typeof parsed.feedback === 'string' ? parsed.feedback : String(parsed.feedback || ''),
      difficultyBreakdown: (parsed.difficultyBreakdown && typeof parsed.difficultyBreakdown === 'object') ? parsed.difficultyBreakdown : { easy: 0, medium: 0, hard: 0 },
      confidence: Number.isFinite(parsed.confidence) ? Math.max(0, Math.min(100, Number(parsed.confidence))) : 0
    };
  }

  return {
    technicalQuestions: [],
    hrQuestions: [],
    feedback: String(raw || 'Model did not return valid JSON'),
    difficultyBreakdown: { easy: 0, medium: 0, hard: 0 },
    confidence: 0
  };
}

module.exports = { prepareInterviewKit };
