const { chat } = require('./openaiClient');
const fs = require('fs');
const path = require('path');

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

let skillsDb = {};
let roleReq = {};
try { skillsDb = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'skillsDatabase.json'), 'utf8')); } catch (e) { skillsDb = {}; }
try { roleReq = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'roleRequirements.json'), 'utf8')); } catch (e) { roleReq = {}; }

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
  if (parsed && (Array.isArray(parsed.matchedSkills) || Array.isArray(parsed.missingSkills))) {
    // If model returned structured fields, prefer them but fill missing values with local analysis
    const pmatched = Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [];
    const pmissing = Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [];
    const prel = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
    return {
      matchedSkills: pmatched.length ? pmatched : matched,
      missingSkills: pmissing.length ? pmissing : missing,
      recommendations: prel.length ? prel : recommendations,
      prioritizedLearningPath: Array.isArray(parsed.prioritizedLearningPath) && parsed.prioritizedLearningPath.length ? parsed.prioritizedLearningPath : prioritizedLearningPath,
      confidence: Number.isFinite(parsed.confidence) ? Math.max(0, Math.min(100, Number(parsed.confidence))) : (req.length ? Math.round((matched.length / req.length) * 100) : 50),
      gapSummary: typeof parsed.gapSummary === 'string' ? parsed.gapSummary : `Matched ${matched.length} of ${req.length} role skills.`
    };
  }

  // Local deterministic fallback logic using skills DB
  const lowerResume = resumeSkills.map(s => String(s).toLowerCase());
  let req = [];
  const roleKey = (targetRole || '').toLowerCase();
  if (roleKey && roleReq[roleKey]) {
    req = roleReq[roleKey].map(s => String(s).toLowerCase());
  } else {
    // try to infer role by overlap
    const scores = Object.keys(roleReq).map(r => {
      const rs = roleReq[r].map(x => x.toLowerCase());
      const common = rs.filter(x => lowerResume.includes(x)).length;
      return { role: r, common };
    }).sort((a,b)=>b.common-a.common);
    if (scores.length && scores[0].common>0) req = roleReq[scores[0].role].map(s=>s.toLowerCase());
  }

  const matched = req.filter(r => lowerResume.includes(r));
  const missing = req.filter(r => !lowerResume.includes(r));

  const recommendations = missing.map(s => `Learn ${s} via project-based exercises and official docs.`);
  const prioritizedLearningPath = missing.slice(0,5).map(s => `Week plan: learn ${s} with hands-on examples`);

  return {
    matchedSkills: matched,
    missingSkills: missing,
    recommendations,
    prioritizedLearningPath,
    confidence: req.length ? Math.round((matched.length / req.length) * 100) : 50,
    gapSummary: `Matched ${matched.length} of ${req.length} role skills.`
  };
}

module.exports = { analyzeSkillGaps };
