const express = require('express');
const router = express.Router();
const {
  getContactBanners,
  getAllContactBanners,
  getContactBanner,
  createContactBanner,
  updateContactBanner,
  deleteContactBanner,
  reorderContactBanners,
} = require('../controllers/contactBannerController');
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getContactBanners);
router.get('/all', getAllContactBanners);
router.get('/:id', getContactBanner);

// Admin routes (protected)
router.post('/', protect, upload.single('image'), createContactBanner);
router.put('/reorder', protect, reorderContactBanners);
router.put('/:id', protect, upload.single('image'), updateContactBanner);
router.delete('/:id', protect, deleteContactBanner);

module.exports = router;
