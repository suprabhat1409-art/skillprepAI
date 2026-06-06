const express = require('express');
const router = express.Router();

const { startInterview, submitInterview, historyByUser } = require('../controllers/interviewController');

router.post('/start', startInterview);
router.post('/submit', submitInterview);
router.get('/history/:userId', historyByUser);

module.exports = router;
