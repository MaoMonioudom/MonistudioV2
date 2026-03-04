const express = require('express');
const router = express.Router();
const {
  getPartners,
  getAllPartners,
  getPartner,
  createPartner,
  updatePartner,
  deletePartner,
  reorderPartners,
} = require('../controllers/partnerController');
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPartners);
router.get('/all', getAllPartners);
router.get('/:id', getPartner);

// Admin routes (protected)
router.post('/', protect, upload.single('logo'), createPartner);
router.put('/reorder', protect, reorderPartners);
router.put('/:id', protect, upload.single('logo'), updatePartner);
router.delete('/:id', protect, deletePartner);

module.exports = router;
