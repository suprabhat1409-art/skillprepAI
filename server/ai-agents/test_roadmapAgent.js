const { generateRoadmap } = require('./roadmapAgent');

async function run() {
  const skills = ['JavaScript', 'React', 'Node.js'];
  const targetRole = 'Senior Fullstack Engineer';
  const preferences = { timePerWeek: '8h', focusAreas: ['backend','devops'] };

  const out = await generateRoadmap({ skills, targetRole, preferences });
  console.log('ROADMAP_AGENT_RESULT', JSON.stringify(out, null, 2));
}

run().catch(err => {
  console.error('test failed', err && err.message ? err.message : err);
  process.exit(1);
});
