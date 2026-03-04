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

// Public routes
router.get('/', getTeamMembers);
router.get('/all', getAllTeamMembers);
router.get('/:id', getTeamMember);

// Admin routes
router.post('/', upload.single('image'), createTeamMember);
router.put('/reorder', reorderTeamMembers);
router.put('/:id', upload.single('image'), updateTeamMember);
router.delete('/:id', deleteTeamMember);

module.exports = router;
