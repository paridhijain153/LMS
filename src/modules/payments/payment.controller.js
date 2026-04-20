const paymentService = require('./payment.service');

// Create payment
const createPayment = async (req, res, next) => {
  try {
    const { courseId, amount } = req.body;
    const payment = await paymentService.createPayment(
      req.user.id,
      courseId,
      amount
    );
    res.status(201).json({
      success: true,
      message: 'Payment initiated',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// Get my payments
const getMyPayments = async (req, res, next) => {
  try {
    const payments = await paymentService.getStudentPayments(req.user.id);
    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

// Get course payments
const getCoursePayments = async (req, res, next) => {
  try {
    const payments = await paymentService.getCoursePayments(req.params.courseId);
    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

// Update payment status
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { transactionId, status } = req.body;
    const payment = await paymentService.updatePaymentStatus(transactionId, status);
    res.json({ success: true, message: 'Payment status updated', data: payment });
  } catch (error) {
    next(error);
  }
};

// Get all payments (admin only)
const getAllPayments = async (req, res, next) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  getMyPayments,
  getCoursePayments,
  updatePaymentStatus,
  getAllPayments
};