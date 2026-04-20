const Payment = require('./payment.model');

// Create payment
const createPayment = async (studentId, courseId, amount) => {
  return await Payment.create({
    student: studentId,
    course: courseId,
    amount: amount
  });
};

// Get all payments of a student
const getStudentPayments = async (studentId) => {
  return await Payment.find({ student: studentId })
    .populate('course', 'title price thumbnail');
};

// Get all payments of a course
const getCoursePayments = async (courseId) => {
  return await Payment.find({ course: courseId })
    .populate('student', 'name email');
};

// Update payment status
const updatePaymentStatus = async (transactionId, status) => {
  return await Payment.findOneAndUpdate(
    { transactionId },
    { status, paidAt: Date.now() },
    { new: true }
  );
};

// Get all payments (admin)
const getAllPayments = async () => {
  return await Payment.find()
    .populate('student', 'name email')
    .populate('course', 'title price');
};

module.exports = {
  createPayment,
  getStudentPayments,
  getCoursePayments,
  updatePaymentStatus,
  getAllPayments
};