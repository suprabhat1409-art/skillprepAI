const express = require('express');

const upload = require('../config/multer');
const auth = require('../middleware/authMiddleware');
const {
	uploadResume,
	getResumeByUser,
	deleteResume
} = require('../controllers/resumeController');

const router = express.Router();

router.post('/upload', auth, upload.single('resume'), uploadResume);
router.get('/:userId', auth, getResumeByUser);
router.delete('/:id', auth, deleteResume);

module.exports = router;