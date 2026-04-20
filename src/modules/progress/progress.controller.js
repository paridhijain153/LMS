export const markTopicCompleted = async (req, res) => {
  res.status(200).json({ success: true, message: 'Mark topic complete endpoint ready' });
};

export const getCourseProgress = async (req, res) => {
  res.status(200).json({ success: true, message: 'Get progress endpoint ready' });
};
