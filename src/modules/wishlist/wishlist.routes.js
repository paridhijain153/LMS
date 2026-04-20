const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/auth.middleware');
const { addToWishlist, getWishlist, removeFromWishlist } = require('./wishlist.controller');

router.get('/', protect, getWishlist);
router.post('/:courseId', protect, addToWishlist);
router.delete('/:courseId', protect, removeFromWishlist);

module.exports = router;