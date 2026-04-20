export const sendEmail = async ({ to, subject, html }) => {
  // TODO: integrate nodemailer transporter for OTP and notifications
  return { to, subject, delivered: false, preview: html };
};
