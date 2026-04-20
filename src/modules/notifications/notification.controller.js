export const getMyNotifications = async (req, res) => {
  res.status(200).json({ success: true, message: 'Get notifications endpoint ready' });
};

export const markNotificationRead = async (req, res) => {
  res.status(200).json({ success: true, message: 'Mark notification as read endpoint ready' });
};
