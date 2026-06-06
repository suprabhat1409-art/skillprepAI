const { analyzeResumeAgent } = require('./resumeAgent');

(async () => {
  const res = await analyzeResumeAgent('Experienced React and Node.js developer with MongoDB and Docker experience.');
  console.log('RESUME_AGENT_RESULT', JSON.stringify(res, null, 2));
})();
