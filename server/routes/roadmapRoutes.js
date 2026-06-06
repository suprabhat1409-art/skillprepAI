const express = require('express');
const router = express.Router();

const { generate, getByUser, updateRoadmap } = require('../controllers/roadmapController');

router.post('/generate', generate);
router.get('/:userId', getByUser);
router.put('/update', updateRoadmap);

module.exports = router;
