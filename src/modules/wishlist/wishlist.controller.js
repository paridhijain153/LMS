export const addToWishlist = async (req, res) => {
  res.status(200).json({ success: true, message: 'Add to wishlist endpoint ready' });
};

export const removeFromWishlist = async (req, res) => {
  res.status(200).json({ success: true, message: 'Remove from wishlist endpoint ready' });
};

export const getWishlist = async (req, res) => {
  res.status(200).json({ success: true, message: 'Wishlist endpoint ready' });
};
