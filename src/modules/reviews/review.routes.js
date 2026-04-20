const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/auth.middleware');
const { addReview, getCourseReviews } = require('./review.controller');

router.post('/:courseId', protect, addReview);
router.get('/:courseId', getCourseReviews);

module.exports = router;