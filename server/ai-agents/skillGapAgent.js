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
 * analyzeSkillGaps
 * - resumeSkills: array of strings (skills extracted from resume)
 * - targetRole: string (role title or short description)
 * - targetRequirements: optional array of strings or freeform description
 *
 * Returns an object:
 * { matchedSkills: [], missingSkills: [], recommendations: [], prioritizedLearningPath: [], confidence: 0-100, gapSummary: string }
 */
async function analyzeSkillGaps({ resumeSkills = [], targetRole = '', targetRequirements = null } = {}) {
  const system = {
    role: 'system',
    content: 'You are an expert career coach and hiring manager. ALWAYS respond with a single valid JSON object and nothing else.'
  };

  const schema = `JSON schema (required keys):\n- matchedSkills: array of strings\n- missingSkills: array of strings\n- recommendations: array of short strings (concrete learning actions)\n- prioritizedLearningPath: array of strings (ordered list of next steps)\n- confidence: integer 0-100\n- gapSummary: short string summary`;

  const userContent = [];
  userContent.push(`Target role: ${String(targetRole || '')}`);
  if (Array.isArray(targetRequirements) && targetRequirements.length) {
    userContent.push(`Role requirements:\n- ${targetRequirements.join('\n- ')}`);
  }
  userContent.push(`Resume skills:\n- ${Array.isArray(resumeSkills) ? resumeSkills.join('\n- ') : String(resumeSkills)}`);

  const user = {
    role: 'user',
    content: `Compare the resume skills to the target role and output ONLY a single valid JSON object that conforms to the schema exactly (no surrounding text). ${schema}\n\n${userContent.join('\n\n')}`
  };

  const raw = await chat([system, user]);

  const parsed = tryParseJsonMaybe(raw);
  if (parsed) {
    return {
      matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      prioritizedLearningPath: Array.isArray(parsed.prioritizedLearningPath) ? parsed.prioritizedLearningPath : [],
      confidence: Number.isFinite(parsed.confidence) ? Math.max(0, Math.min(100, Number(parsed.confidence))) : 0,
      gapSummary: typeof parsed.gapSummary === 'string' ? parsed.gapSummary : String(raw || '')
    };
  }

  // Fallback when model did not produce valid JSON
  return {
    matchedSkills: [],
    missingSkills: [],
    recommendations: [String(raw || 'Model did not return valid JSON')],
    prioritizedLearningPath: [],
    confidence: 0,
    gapSummary: String(raw || 'No structured output')
  };
}

module.exports = { analyzeSkillGaps };
