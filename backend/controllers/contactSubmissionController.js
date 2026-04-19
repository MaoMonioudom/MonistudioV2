const ContactSubmission = require('../models/contactSubmissionModel');

// Submit a contact form
const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.',
      });
    }

    // Create new contact submission
    const submission = new ContactSubmission({
      name,
      email,
      message,
    });

    await submission.save();

    res.status(201).json({
      success: true,
      message: 'Message submitted successfully!',
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form.',
      error: error.message,
    });
  }
};

// Get all contact submissions (Admin)
const getContactSubmissions = async (req, res) => {
  try {
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact submissions.',
      error: error.message,
    });
  }
};

// Mark submission as read/unread (toggle)
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // Get current submission to toggle isRead
    const currentSubmission = await ContactSubmission.findById(id);
    if (!currentSubmission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found.',
      });
    }

    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      { isRead: !currentSubmission.isRead },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Submission marked as read.',
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking submission as read.',
      error: error.message,
    });
  }
};

// Delete a contact submission
const deleteContactSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await ContactSubmission.findByIdAndDelete(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully.',
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting submission.',
      error: error.message,
    });
  }
};

module.exports = {
  submitContactForm,
  getContactSubmissions,
  markAsRead,
  deleteContactSubmission,
};
