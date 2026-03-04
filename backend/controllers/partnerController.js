const Partner = require('../models/partnerModel');
const { deleteImage } = require('../config/cloudinary');

// @desc    Get all partners (active only)
// @route   GET /api/partners
// @access  Public
const getPartners = async (req, res) => {
  try {
    const partners = await Partner.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all partners (including inactive) for admin
// @route   GET /api/partners/all
// @access  Private (Admin)
const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ order: 1 });
    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single partner
// @route   GET /api/partners/:id
// @access  Public
const getPartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      res.status(404);
      throw new Error('Partner not found');
    }
    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a partner
// @route   POST /api/partners
// @access  Private (Admin only)
const createPartner = async (req, res) => {
  try {
    const { name, website, order, isActive } = req.body;
    let logoUrl = req.body.logoUrl;

    // Handle image upload
    if (req.file) {
      logoUrl = req.file.path;
    }

    if (!name) {
      res.status(400);
      throw new Error('Please add a company/organization name');
    }

    if (!logoUrl) {
      res.status(400);
      throw new Error('Please add a logo');
    }

    const partner = await Partner.create({
      name,
      logoUrl,
      website: website || '',
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json(partner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a partner
// @route   PUT /api/partners/:id
// @access  Private (Admin only)
const updatePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      res.status(404);
      throw new Error('Partner not found');
    }

    let logoUrl = req.body.logoUrl || partner.logoUrl;

    // Update image if new one is uploaded
    if (req.file) {
      if (partner.logoUrl) {
        // Delete old image
        await deleteImage(partner.logoUrl);
      }
      logoUrl = req.file.path;
    }

    const updatedPartner = await Partner.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name || partner.name,
        logoUrl,
        website: req.body.website !== undefined ? req.body.website : partner.website,
        order: req.body.order !== undefined ? req.body.order : partner.order,
        isActive: req.body.isActive !== undefined ? req.body.isActive : partner.isActive,
      },
      { new: true }
    );

    res.status(200).json(updatedPartner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a partner
// @route   DELETE /api/partners/:id
// @access  Private (Admin only)
const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      res.status(404);
      throw new Error('Partner not found');
    }

    // Delete image from Cloudinary
    if (partner.logoUrl) {
      await deleteImage(partner.logoUrl);
    }

    await Partner.findByIdAndDelete(req.params.id);

    res.status(200).json({ id: req.params.id, message: 'Partner deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reorder partners
// @route   PUT /api/partners/reorder
// @access  Private (Admin only)
const reorderPartners = async (req, res) => {
  try {
    const { partnerOrders } = req.body;

    if (!partnerOrders || !Array.isArray(partnerOrders)) {
      res.status(400);
      throw new Error('Please provide partner orders');
    }

    // Update each partner's order
    const updatePromises = partnerOrders.map(({ id, order }) =>
      Partner.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    const updatedPartners = await Partner.find().sort({ order: 1 });
    res.status(200).json(updatedPartners);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getPartners,
  getAllPartners,
  getPartner,
  createPartner,
  updatePartner,
  deletePartner,
  reorderPartners,
};
