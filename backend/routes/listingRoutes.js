const express = require('express');
const router = express.Router();
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  updateListingStatus,
  deleteListing,
  getMyListings,
} = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getListings).post(protect, createListing);
router.get('/seller/me', protect, getMyListings);
router.route('/:id').get(getListingById).put(protect, updateListing).delete(protect, deleteListing);
router.patch('/:id/status', protect, updateListingStatus);

module.exports = router;
