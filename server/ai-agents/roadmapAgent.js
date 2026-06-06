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
 * generateRoadmap
 * - skills: array of strings (current skills)
 * - targetRole: string
 * - preferences: optional object { timePerWeek, focusAreas }
 *
 * Returns:
 * { weeklyGoals: [{week:int, goals:[] }], learningPath: [], dsaPlan: [], projectRecommendations: [], confidence:0-100, summary: string }
 */
async function generateRoadmap({ skills = [], targetRole = '', preferences = {} } = {}) {
  const system = {
    role: 'system',
    content: 'You are an expert learning roadmap planner. ALWAYS respond with a single valid JSON object and nothing else.'
  };

  const schema = `JSON schema (required keys):\n- weeklyGoals: array of objects { week: integer, goals: array of short strings }\n- learningPath: array of strings (ordered topics)\n- dsaPlan: array of strings (weekly DSA topics/practice)\n- projectRecommendations: array of strings (project ideas)\n- confidence: integer 0-100\n- summary: short string`;

  const userParts = [];
  userParts.push(`Target role: ${String(targetRole || '')}`);
  userParts.push(`Current skills:\n- ${Array.isArray(skills) ? skills.join('\n- ') : String(skills)}`);
  if (preferences && Object.keys(preferences).length) {
    userParts.push(`Preferences:\n${JSON.stringify(preferences)}`);
  }

  const user = {
    role: 'user',
    content: `Create a learning roadmap and output ONLY a single valid JSON object that conforms to the schema exactly (no surrounding text). ${schema}\n\n${userParts.join('\n\n')}`
  };

  const raw = await chat([system, user]);
  const parsed = tryParseJsonMaybe(raw);
  if (parsed) {
    return {
      weeklyGoals: Array.isArray(parsed.weeklyGoals) ? parsed.weeklyGoals : [],
      learningPath: Array.isArray(parsed.learningPath) ? parsed.learningPath : [],
      dsaPlan: Array.isArray(parsed.dsaPlan) ? parsed.dsaPlan : [],
      projectRecommendations: Array.isArray(parsed.projectRecommendations) ? parsed.projectRecommendations : [],
      confidence: Number.isFinite(parsed.confidence) ? Math.max(0, Math.min(100, Number(parsed.confidence))) : 0,
      summary: typeof parsed.summary === 'string' ? parsed.summary : String(raw || '')
    };
  }

  return {
    weeklyGoals: [],
    learningPath: [],
    dsaPlan: [],
    projectRecommendations: [String(raw || 'Model did not return valid JSON')],
    confidence: 0,
    summary: String(raw || 'No structured output')
  };
}

module.exports = { generateRoadmap };
