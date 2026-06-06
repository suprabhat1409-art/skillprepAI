const { prepareInterviewKit } = require('./interviewAgent');

async function run() {
  const targetRole = 'Senior Fullstack Engineer';
  const skills = ['JavaScript','React','Node.js','Docker'];
  const kit = await prepareInterviewKit({ targetRole, skills, level: 'senior' });
  console.log('INTERVIEW_AGENT_RESULT', JSON.stringify(kit, null, 2));
}

run().catch(err => {
  console.error('test failed', err && err.message ? err.message : err);
  process.exit(1);
});
