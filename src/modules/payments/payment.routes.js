const express = require('express');
const router = express.Router();
const {
  createPayment,
  getMyPayments,
  getCoursePayments,
  updatePaymentStatus,
  getAllPayments
} = require('./payment.controller');

router.post('/', createPayment);                          // initiate payment
router.get('/my', getMyPayments);                         // get my payments
router.get('/course/:courseId', getCoursePayments);       // get course payments
router.put('/status', updatePaymentStatus);               // update payment status
router.get('/all', getAllPayments);                       // admin - get all payments

module.exports = router;