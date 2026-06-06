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
    // Create fallback pieces to merge
    const coreSkills = Array.isArray(skills) && skills.length ? skills.slice(0,5) : ['JavaScript','Data Structures','APIs'];
    const techQsFallback = [];
    coreSkills.forEach((s, idx) => {
      const difficulty = idx < 2 ? 'easy' : (idx < 4 ? 'medium' : 'hard');
      techQsFallback.push({ question: `Explain core concepts and common interview problems for ${s}.`, difficulty });
    });
    const hrQsFallback = [
      'Tell me about yourself and why you are interested in this role.',
      'Describe a challenge you faced and how you resolved it.'
    ];
    const difficultyBreakdownFallback = { easy: 2, medium: 2, hard: Math.max(0, techQsFallback.length - 4) };

    return {
      technicalQuestions: Array.isArray(parsed.technicalQuestions) && parsed.technicalQuestions.length ? parsed.technicalQuestions : techQsFallback,
      hrQuestions: Array.isArray(parsed.hrQuestions) && parsed.hrQuestions.length ? parsed.hrQuestions : hrQsFallback,
      feedback: typeof parsed.feedback === 'string' && parsed.feedback ? parsed.feedback : 'Assess candidate clarity, depth of technical reasoning, and problem-solving; score 1-5.',
      difficultyBreakdown: (parsed.difficultyBreakdown && typeof parsed.difficultyBreakdown === 'object' && Object.keys(parsed.difficultyBreakdown).length) ? parsed.difficultyBreakdown : difficultyBreakdownFallback,
      confidence: Number.isFinite(parsed.confidence) ? Math.max(0, Math.min(100, Number(parsed.confidence))) : 50
    };
  }
  // Fallback deterministic interview kit generation
  const techQs = [];
  const hrQs = [
    'Tell me about yourself and why you are interested in this role.',
    'Describe a challenge you faced and how you resolved it.'
  ];

  const coreSkills = Array.isArray(skills) && skills.length ? skills.slice(0,5) : ['JavaScript','Data Structures','APIs'];
  // Build 6 technical questions with varying difficulty
  coreSkills.forEach((s, idx) => {
    const difficulty = idx < 2 ? 'easy' : (idx < 4 ? 'medium' : 'hard');
    techQs.push({ question: `Explain core concepts and common interview problems for ${s}.`, difficulty });
  });

  const difficultyBreakdown = { easy: 2, medium: 2, hard: techQs.length - 4 };

  return {
    technicalQuestions: techQs,
    hrQuestions: hrQs,
    feedback: 'Assess candidate clarity, depth of technical reasoning, and problem-solving; score 1-5.',
    difficultyBreakdown,
    confidence: 50
  };
}

module.exports = { prepareInterviewKit };
