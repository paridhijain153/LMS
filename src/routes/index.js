const express = require('express');
const router = express.Router();

const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/user.routes');
const courseRoutes = require('../modules/courses/course.routes');
const enrollmentRoutes = require('../modules/enrollments/enrollment.routes');
const paymentRoutes = require('../modules/payments/payment.routes');
const progressRoutes = require('../modules/progress/progress.routes');
const assessmentRoutes = require('../modules/assessments/assessment.routes');
const reviewRoutes = require('../modules/reviews/review.routes');
const notificationRoutes = require('../modules/notifications/notification.routes');
const wishlistRoutes = require('../modules/wishlist/wishlist.routes');

router.use('/progress', progressRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/payments', paymentRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/courses', courseRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;