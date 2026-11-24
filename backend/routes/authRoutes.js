const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getDemoUsers,
  demoLogin,
  getProfile,
  toggleFavorite,
  getFavorites,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/demo-users', getDemoUsers);
router.post('/demo-login/:userId', demoLogin);
router.get('/profile/:id', getProfile);

// Favorites (Protected)
router.post('/favorites/:listingId', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);

module.exports = router;
