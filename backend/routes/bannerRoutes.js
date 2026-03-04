const express = require('express');
const router = express.Router();
const {
  getBanners,
  getAllBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
} = require('../controllers/bannerController');
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getBanners);
router.get('/all', getAllBanners);
router.get('/:id', getBanner);

// Admin routes (protected)
router.post('/', protect, upload.single('image'), createBanner);
router.put('/reorder', protect, reorderBanners);
router.put('/:id', protect, upload.single('image'), updateBanner);
router.delete('/:id', protect, deleteBanner);

module.exports = router;
