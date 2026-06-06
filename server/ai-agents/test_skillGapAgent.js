const { analyzeSkillGaps } = require('./skillGapAgent');

async function run() {
  const resumeSkills = ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'];
  const targetRole = 'Senior Fullstack Engineer';
  const targetRequirements = ['TypeScript', 'Docker', 'Kubernetes', 'CI/CD', 'Testing (Jest)'];

  const out = await analyzeSkillGaps({ resumeSkills, targetRole, targetRequirements });
  console.log('SKILL_GAP_AGENT_RESULT', JSON.stringify(out, null, 2));
}

run().catch(err => {
  console.error('test failed', err && err.message ? err.message : err);
  process.exit(1);
});
