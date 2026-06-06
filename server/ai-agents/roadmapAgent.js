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
    // Build local fallback pieces
    const missingSkills = (preferences && preferences.missingSkills) || [];
    const learn = Array.isArray(missingSkills) && missingSkills.length ? missingSkills : (Array.isArray(skills) ? skills.slice(0,5) : []);
    const weeklyGoalsFallback = [];
    for (let i=0;i<8;i++) {
      weeklyGoalsFallback.push({ week: i+1, goals: [`Study ${learn[i % learn.length] || 'core topics'}`, 'Build small project/practice problems'] });
    }
    const dsaPlanFallback = ['Week 1-2: Arrays & Strings','Week 3-4: Trees & Graphs','Week 5-6: Dynamic Programming','Week 7-8: System Design basics'];
    const projectRecommendationsFallback = learn.slice(0,3).map(s => `Project: Build a ${s} focused application`);

    return {
      weeklyGoals: Array.isArray(parsed.weeklyGoals) && parsed.weeklyGoals.length ? parsed.weeklyGoals : weeklyGoalsFallback,
      learningPath: Array.isArray(parsed.learningPath) && parsed.learningPath.length ? parsed.learningPath : learn,
      dsaPlan: Array.isArray(parsed.dsaPlan) && parsed.dsaPlan.length ? parsed.dsaPlan : dsaPlanFallback,
      projectRecommendations: Array.isArray(parsed.projectRecommendations) && parsed.projectRecommendations.length ? parsed.projectRecommendations : projectRecommendationsFallback,
      confidence: Number.isFinite(parsed.confidence) ? Math.max(0, Math.min(100, Number(parsed.confidence))) : 50,
      summary: typeof parsed.summary === 'string' && parsed.summary ? parsed.summary : 'Generated roadmap (merged parsed and fallback).'
    };
  }

  // Fallback simple roadmap generation using provided skills and targetRole
  const missingSkills = (preferences && preferences.missingSkills) || [];
  const learn = Array.isArray(missingSkills) && missingSkills.length ? missingSkills : (Array.isArray(skills) ? skills.slice(0,5) : []);

  const weeklyGoals = [];
  for (let i=0;i<8;i++) {
    weeklyGoals.push({ week: i+1, goals: [`Study ${learn[i % learn.length] || 'core topics'}`, 'Build small project/practice problems'] });
  }

  const dsaPlan = ['Week 1-2: Arrays & Strings','Week 3-4: Trees & Graphs','Week 5-6: Dynamic Programming','Week 7-8: System Design basics'];
  const projectRecommendations = learn.slice(0,3).map(s => `Project: Build a ${s} focused application`);

  return {
    weeklyGoals,
    learningPath: learn,
    dsaPlan,
    projectRecommendations,
    confidence: 50,
    summary: 'Generated fallback roadmap based on available skills.'
  };
}

module.exports = { generateRoadmap };
