export const buildMockPaymentResponse = ({ courseId, amount }) => ({
  courseId,
  amount,
  status: 'pending',
  provider: 'mock',
});
