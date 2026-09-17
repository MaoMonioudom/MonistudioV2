const express = require('express');
const router = express.Router();
const {
  getPortfolioBanners,
  getAllPortfolioBanners,
  getPortfolioBanner,
  createPortfolioBanner,
  updatePortfolioBanner,
  deletePortfolioBanner,
  reorderPortfolioBanners,
} = require('../controllers/portfolioBannerController');
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPortfolioBanners);
router.get('/all', getAllPortfolioBanners);
router.get('/:id', getPortfolioBanner);

// Admin routes (protected)
router.post('/', protect, upload.single('image'), createPortfolioBanner);
router.put('/reorder', protect, reorderPortfolioBanners);
router.put('/:id', protect, upload.single('image'), updatePortfolioBanner);
router.delete('/:id', protect, deletePortfolioBanner);

module.exports = router;
