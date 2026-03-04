const TeamMember = require('../models/teamMemberModel');
const { deleteImage } = require('../config/cloudinary');

// @desc    Get all team members (active only)
// @route   GET /api/team-members
// @access  Public
const getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all team members (including inactive) for admin
// @route   GET /api/team-members/all
// @access  Private (Admin)
const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ order: 1 });
    res.status(200).json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single team member
// @route   GET /api/team-members/:id
// @access  Public
const getTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      res.status(404);
      throw new Error('Team member not found');
    }
    res.status(200).json(teamMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a team member
// @route   POST /api/team-members
// @access  Private (Admin only)
const createTeamMember = async (req, res) => {
  try {
    const { name, role, bio, order, isActive } = req.body;
    let imageUrl = req.body.imageUrl;

    // Handle image upload
    if (req.file) {
      imageUrl = req.file.path;
    }

    if (!name) {
      res.status(400);
      throw new Error('Please add a name');
    }

    if (!role) {
      res.status(400);
      throw new Error('Please add a role');
    }

    if (!imageUrl) {
      res.status(400);
      throw new Error('Please add an image');
    }

    const teamMember = await TeamMember.create({
      name,
      role,
      bio: bio || '',
      imageUrl,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json(teamMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a team member
// @route   PUT /api/team-members/:id
// @access  Private (Admin only)
const updateTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      res.status(404);
      throw new Error('Team member not found');
    }

    let imageUrl = req.body.imageUrl || teamMember.imageUrl;

    // Update image if new one is uploaded
    if (req.file) {
      if (teamMember.imageUrl) {
        // Delete old image
        await deleteImage(teamMember.imageUrl);
      }
      imageUrl = req.file.path;
    }

    const updatedTeamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name || teamMember.name,
        role: req.body.role || teamMember.role,
        bio: req.body.bio !== undefined ? req.body.bio : teamMember.bio,
        imageUrl,
        order: req.body.order !== undefined ? req.body.order : teamMember.order,
        isActive: req.body.isActive !== undefined ? req.body.isActive : teamMember.isActive,
      },
      { new: true }
    );

    res.status(200).json(updatedTeamMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a team member
// @route   DELETE /api/team-members/:id
// @access  Private (Admin only)
const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      res.status(404);
      throw new Error('Team member not found');
    }

    // Delete image from Cloudinary
    if (teamMember.imageUrl) {
      await deleteImage(teamMember.imageUrl);
    }

    await TeamMember.findByIdAndDelete(req.params.id);

    res.status(200).json({ id: req.params.id, message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reorder team members
// @route   PUT /api/team-members/reorder
// @access  Private (Admin only)
const reorderTeamMembers = async (req, res) => {
  try {
    const { memberOrders } = req.body;

    if (!memberOrders || !Array.isArray(memberOrders)) {
      res.status(400);
      throw new Error('Please provide member orders');
    }

    // Update each member's order
    const updatePromises = memberOrders.map(({ id, order }) =>
      TeamMember.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    const updatedMembers = await TeamMember.find().sort({ order: 1 });
    res.status(200).json(updatedMembers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTeamMembers,
  getAllTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMembers,
};
