const express = require('express');
const router = express.Router();

const { analyzeSkills, getAnalysisByUser } = require('../controllers/skillController');

router.post('/analyze', analyzeSkills);
router.get('/:userId', getAnalysisByUser);

module.exports = router;
