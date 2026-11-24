const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getReceivedEnquiries,
  getSentEnquiries,
  respondToEnquiry,
  markEnquiriesRead,
} = require('../controllers/enquiryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createEnquiry);
router.get('/received', getReceivedEnquiries);
router.get('/sent', getSentEnquiries);
router.patch('/:id/respond', respondToEnquiry);
router.patch('/mark-read', markEnquiriesRead);

module.exports = router;
