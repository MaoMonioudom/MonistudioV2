const express = require('express');
const router = express.Router();
const {
  getFeatures,
  getFeature,
  createFeature,
  updateFeature,
  deleteFeature,
} = require('../controllers/featureController');
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getFeatures);
router.get('/:id', getFeature);

// Admin routes (protected)
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'moreImages', maxCount: 10 },
  ]),
  createFeature
);
router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'moreImages', maxCount: 10 },
  ]),
  updateFeature
);
router.delete('/:id', protect, deleteFeature);

module.exports = router;
