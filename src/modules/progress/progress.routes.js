const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/auth.middleware');
const { getCourseProgress, markTopicCompleted } = require('./progress.controller');

router.post('/:courseId/topics/:topicId/complete', protect, markTopicCompleted);
router.get('/:courseId', protect, getCourseProgress);

module.exports = router;