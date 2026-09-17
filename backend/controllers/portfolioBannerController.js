const PortfolioBanner = require('../models/portfolioBannerModel');
const { deleteImage } = require('../config/cloudinary');

// @desc    Get all portfolio banners (active only)
// @route   GET /api/portfolio-banners
// @access  Public
const getPortfolioBanners = async (req, res) => {
  try {
    const banners = await PortfolioBanner.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all portfolio banners (including inactive) for admin
// @route   GET /api/portfolio-banners/all
// @access  Private (Admin)
const getAllPortfolioBanners = async (req, res) => {
  try {
    const banners = await PortfolioBanner.find().sort({ order: 1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single portfolio banner
// @route   GET /api/portfolio-banners/:id
// @access  Public
const getPortfolioBanner = async (req, res) => {
  try {
    const banner = await PortfolioBanner.findById(req.params.id);
    if (!banner) {
      res.status(404);
      throw new Error('Portfolio banner not found');
    }
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a portfolio banner
// @route   POST /api/portfolio-banners
// @access  Private (Admin only)
const createPortfolioBanner = async (req, res) => {
  try {
    const { title, subtitle, order, isActive } = req.body;
    let imageUrl = req.body.imageUrl;

    // Handle image upload
    if (req.file) {
      imageUrl = req.file.path;
    }

    if (!imageUrl) {
      res.status(400);
      throw new Error('Please add an image');
    }

    const banner = await PortfolioBanner.create({
      title: title || '',
      subtitle: subtitle || '',
      imageUrl,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a portfolio banner
// @route   PUT /api/portfolio-banners/:id
// @access  Private (Admin only)
const updatePortfolioBanner = async (req, res) => {
  try {
    const banner = await PortfolioBanner.findById(req.params.id);

    if (!banner) {
      res.status(404);
      throw new Error('Portfolio banner not found');
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

    const updatedBanner = await PortfolioBanner.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title !== undefined ? req.body.title : banner.title,
        subtitle: req.body.subtitle !== undefined ? req.body.subtitle : banner.subtitle,
        imageUrl,
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

// @desc    Delete a portfolio banner
// @route   DELETE /api/portfolio-banners/:id
// @access  Private (Admin only)
const deletePortfolioBanner = async (req, res) => {
  try {
    const banner = await PortfolioBanner.findById(req.params.id);

    if (!banner) {
      res.status(404);
      throw new Error('Portfolio banner not found');
    }

    // Delete image from Cloudinary
    if (banner.imageUrl) {
      await deleteImage(banner.imageUrl);
    }

    await PortfolioBanner.findByIdAndDelete(req.params.id);

    res.status(200).json({ id: req.params.id, message: 'Portfolio banner deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reorder portfolio banners
// @route   PUT /api/portfolio-banners/reorder
// @access  Private (Admin only)
const reorderPortfolioBanners = async (req, res) => {
  try {
    const { bannerOrders } = req.body;

    if (!bannerOrders || !Array.isArray(bannerOrders)) {
      res.status(400);
      throw new Error('Please provide banner orders');
    }

    const updatePromises = bannerOrders.map(({ id, order }) =>
      PortfolioBanner.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    const updatedBanners = await PortfolioBanner.find().sort({ order: 1 });
    res.status(200).json(updatedBanners);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getPortfolioBanners,
  getAllPortfolioBanners,
  getPortfolioBanner,
  createPortfolioBanner,
  updatePortfolioBanner,
  deletePortfolioBanner,
  reorderPortfolioBanners,
};
