const express = require('express');
const router = express.Router();
const {
  getTeamMembers,
  getAllTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMembers,
} = require('../controllers/teamMemberController');
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getTeamMembers);
router.get('/all', getAllTeamMembers);
router.get('/:id', getTeamMember);

// Admin routes (protected)
router.post('/', protect, upload.single('image'), createTeamMember);
router.put('/reorder', protect, reorderTeamMembers);
router.put('/:id', protect, upload.single('image'), updateTeamMember);
router.delete('/:id', protect, deleteTeamMember);

module.exports = router;
