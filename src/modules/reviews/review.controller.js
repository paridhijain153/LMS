export const addReview = async (req, res) => {
  res.status(201).json({ success: true, message: 'Add review endpoint ready' });
};

export const getCourseReviews = async (req, res) => {
  res.status(200).json({ success: true, message: 'List reviews endpoint ready' });
};
