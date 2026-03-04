const ContactBanner = require('../models/contactBannerModel');
const { deleteImage } = require('../config/cloudinary');

// @desc    Get all contact banners (active only)
// @route   GET /api/contact-banners
// @access  Public
const getContactBanners = async (req, res) => {
  try {
    const banners = await ContactBanner.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact banners (including inactive) for admin
// @route   GET /api/contact-banners/all
// @access  Private (Admin)
const getAllContactBanners = async (req, res) => {
  try {
    const banners = await ContactBanner.find().sort({ order: 1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single contact banner
// @route   GET /api/contact-banners/:id
// @access  Public
const getContactBanner = async (req, res) => {
  try {
    const banner = await ContactBanner.findById(req.params.id);
    if (!banner) {
      res.status(404);
      throw new Error('Contact banner not found');
    }
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a contact banner
// @route   POST /api/contact-banners
// @access  Private (Admin only)
const createContactBanner = async (req, res) => {
  try {
    const { title, link, order, isActive } = req.body;
    let imageUrl = req.body.imageUrl;

    // Handle image upload
    if (req.file) {
      imageUrl = req.file.path;
    }

    if (!imageUrl) {
      res.status(400);
      throw new Error('Please add an image');
    }

    const banner = await ContactBanner.create({
      title: title || '',
      imageUrl,
      link: link || '',
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a contact banner
// @route   PUT /api/contact-banners/:id
// @access  Private (Admin only)
const updateContactBanner = async (req, res) => {
  try {
    const banner = await ContactBanner.findById(req.params.id);

    if (!banner) {
      res.status(404);
      throw new Error('Contact banner not found');
    }

    let imageUrl = req.body.imageUrl || banner.imageUrl;

    // Update image if new one is uploaded
    if (req.file) {
      if (banner.imageUrl) {
        // Delete old image
        await deleteImage(banner.imageUrl);
      }
      imageUrl = req.file.path;
    }

    const updatedBanner = await ContactBanner.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title !== undefined ? req.body.title : banner.title,
        imageUrl,
        link: req.body.link !== undefined ? req.body.link : banner.link,
        order: req.body.order !== undefined ? req.body.order : banner.order,
        isActive: req.body.isActive !== undefined ? req.body.isActive : banner.isActive,
      },
      { new: true }
    );

    res.status(200).json(updatedBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a contact banner
// @route   DELETE /api/contact-banners/:id
// @access  Private (Admin only)
const deleteContactBanner = async (req, res) => {
  try {
    const banner = await ContactBanner.findById(req.params.id);

    if (!banner) {
      res.status(404);
      throw new Error('Contact banner not found');
    }

    // Delete image from Cloudinary
    if (banner.imageUrl) {
      await deleteImage(banner.imageUrl);
    }

    await ContactBanner.findByIdAndDelete(req.params.id);

    res.status(200).json({ id: req.params.id, message: 'Contact banner deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reorder contact banners
// @route   PUT /api/contact-banners/reorder
// @access  Private (Admin only)
const reorderContactBanners = async (req, res) => {
  try {
    const { bannerOrders } = req.body;

    if (!bannerOrders || !Array.isArray(bannerOrders)) {
      res.status(400);
      throw new Error('Please provide banner orders');
    }

    // Update each banner's order
    const updatePromises = bannerOrders.map(({ id, order }) =>
      ContactBanner.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    const updatedBanners = await ContactBanner.find().sort({ order: 1 });
    res.status(200).json(updatedBanners);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getContactBanners,
  getAllContactBanners,
  getContactBanner,
  createContactBanner,
  updateContactBanner,
  deleteContactBanner,
  reorderContactBanners,
};
