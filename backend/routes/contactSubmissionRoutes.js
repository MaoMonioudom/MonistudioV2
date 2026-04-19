const express = require('express');
const router = express.Router();
const {
  submitContactForm,
  getContactSubmissions,
  markAsRead,
  deleteContactSubmission,
} = require('../controllers/contactSubmissionController');
const { protect } = require('../middleware/authMiddleware');

// Public route - Submit contact form
router.post('/', submitContactForm);

// Admin routes - Require authentication
router.get('/', protect, getContactSubmissions);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteContactSubmission);

module.exports = router;
