const express = require('express');
const router = express.Router();
const {
  getTeamActivities,
  getTeamActivity,
  createTeamActivity,
  updateTeamActivity,
  deleteTeamActivity,
} = require('../controllers/teamActivityController');
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getTeamActivities);
router.get('/:id', getTeamActivity);

// Admin routes (protected)
router.post('/', protect, upload.single('image'), createTeamActivity);
router.put('/:id', protect, upload.single('image'), updateTeamActivity);
router.delete('/:id', protect, deleteTeamActivity);

module.exports = router;
