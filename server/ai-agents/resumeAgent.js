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

// load local datasets for role-based matching
let skillsDb = {};
let roleReq = {};
try {
  skillsDb = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'skillsDatabase.json'), 'utf8'));
} catch (e) { skillsDb = {}; }
try {
  roleReq = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'roleRequirements.json'), 'utf8'));
} catch (e) { roleReq = {}; }

function extractSkillsFromText(text) {
  if (!text || typeof text !== 'string') return [];
  const lowered = text.toLowerCase();
  const found = new Set();
  Object.values(skillsDb).flat().forEach((skill) => {
    const s = String(skill).toLowerCase();
    // match whole word or common variants
    const regex = new RegExp('\\b' + s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'i');
    if (regex.test(lowered)) found.add(skill);
  });
  return Array.from(found);
}

function computeATS({ resumeText = '', resumeSkills = [], targetRole = '' } = {}) {
  // skill match percentage
  const roleSkills = (roleReq[(targetRole || '').toLowerCase()] || []).map(s => s.toLowerCase());
  const resumeSkillsLower = resumeSkills.map(s => String(s).toLowerCase());
  const matched = roleSkills.filter(rs => resumeSkillsLower.includes(rs));
  const skillMatchPct = roleSkills.length ? (matched.length / roleSkills.length) : (resumeSkills.length ? Math.min(1, resumeSkills.length / 5) : 0);

  // project score heuristic: count occurrences of 'project', 'built', 'developed'
  const projHits = (String(resumeText).match(/\b(project|built|developed|implemented)\b/gi) || []).length;
  const projectScore = Math.min(1, projHits / 3);

  // formatting heuristic: presence of Experience, Education, Projects
  const formatHits = (String(resumeText).match(/\b(experience|education|projects|skills|summary)\b/gi) || []).length;
  const formattingScore = Math.min(1, formatHits / 5);

  // keyword optimization: count role keywords present
  const keywordHits = roleSkills.filter(k => resumeSkillsLower.includes(k)).length;
  const keywordOpt = roleSkills.length ? Math.min(1, keywordHits / roleSkills.length) : 0;

  // weighted formula
  const score = Math.round(
    (skillMatchPct * 50) +
    (projectScore * 20) +
    (formattingScore * 15) +
    (keywordOpt * 15)
  );
  return Math.max(0, Math.min(100, score));
}

async function analyzeResumeAgent(resumeText, options = {}) {
  const targetRole = options.targetRole || '';

  const system = {
    role: 'system',
    content: 'You are an expert ATS resume reviewer and placement mentor. Respond with a single valid JSON object only.'
  };

  const schema = `JSON schema (required keys):\\n- atsScore: integer 0-100\\n- strengths: array of strings\\n- weaknesses: array of strings\\n- missingSkills: array of strings\\n- recommendedProjects: array of strings\\n- suggestedCertifications: array of strings\\n- resumeSuggestions: array of strings`;

  const user = {
    role: 'user',
    content: `Analyze the resume below for the target role: ${String(targetRole || 'general')}. Output ONLY a single valid JSON object that conforms to the schema exactly (no surrounding text). ${schema}\nResume:\n"""${String(resumeText || '')}"""`
  };

  const raw = await chat([system, user], Number(process.env.AZURE_OPENAI_MAX_TOKENS || 512));
  const parsed = tryParseJsonMaybe(raw);

  // Local extraction and fallback scoring
  const extractedSkills = extractSkillsFromText(resumeText);
  const atsLocal = computeATS({ resumeText, resumeSkills: extractedSkills, targetRole });

  if (parsed) {
    // Merge parsed output with local fallbacks when fields are missing
    const parsedAts = Number.isFinite(parsed.atsScore) ? Math.max(0, Math.min(100, Number(parsed.atsScore))) : atsLocal;
    const parsedStrengths = Array.isArray(parsed.strengths) && parsed.strengths.length ? parsed.strengths : extractedSkills;
    const parsedWeaknesses = Array.isArray(parsed.weaknesses) && parsed.weaknesses.length ? parsed.weaknesses : [];
    const parsedMissing = Array.isArray(parsed.missingSkills) && parsed.missingSkills.length ? parsed.missingSkills : (() => {
      const roleKey = (targetRole || '').toLowerCase();
      const reqSkills = (roleReq[roleKey] || []).map(s => s.toLowerCase());
      return reqSkills.filter(s => !extractedSkills.map(x => x.toLowerCase()).includes(s));
    })();
    const parsedProjects = Array.isArray(parsed.recommendedProjects) && parsed.recommendedProjects.length ? parsed.recommendedProjects : parsedMissing.slice(0,3).map(s => `Build a project focusing on ${s}`);
    const parsedCerts = Array.isArray(parsed.suggestedCertifications) && parsed.suggestedCertifications.length ? parsed.suggestedCertifications : parsedMissing.slice(0,3).map(s => `Certification: ${s}`);
    const parsedResumeSuggestions = Array.isArray(parsed.resumeSuggestions) && parsed.resumeSuggestions.length ? parsed.resumeSuggestions : (extractedSkills.length ? [] : ['Add a Skills section with key technologies used.']);

    return {
      atsScore: parsedAts,
      strengths: parsedStrengths,
      weaknesses: parsedWeaknesses,
      missingSkills: parsedMissing,
      recommendedProjects: parsedProjects,
      suggestedCertifications: parsedCerts,
      resumeSuggestions: parsedResumeSuggestions
    };
  }

  // Fallback structured response using local heuristics
  // Suggest missing skills based on role requirements
  const roleKey = (targetRole || '').toLowerCase();
  const reqSkills = (roleReq[roleKey] || []).map(s => s.toLowerCase());
  const missing = reqSkills.filter(s => !extractedSkills.map(x => x.toLowerCase()).includes(s));

  const fallback = {
    atsScore: atsLocal,
    strengths: extractedSkills.slice(0, 5),
    weaknesses: missing.slice(0, 5),
    missingSkills: missing,
    recommendedProjects: missing.slice(0,3).map(s => `Build a project focusing on ${s}`),
    suggestedCertifications: missing.slice(0,3).map(s => `Relevant certification for ${s}`),
    resumeSuggestions: [
      ...(extractedSkills.length ? [] : ['Add a Skills section with key technologies used.']),
      'Include 2-3 concrete project bullets with metrics.'
    ]
  };

  return fallback;
}

module.exports = { analyzeResumeAgent };
