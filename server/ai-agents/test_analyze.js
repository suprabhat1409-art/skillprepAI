const { analyzeResume } = require('./resumeAnalyzer');

(async () => {
  const res = await analyzeResume('Experienced React and Node.js developer with MongoDB background.');
  console.log('ANALYSIS_RESULT', JSON.stringify(res, null, 2));
})();
