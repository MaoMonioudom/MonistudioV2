const Feature = require('../models/featureModel');
const { deleteImage } = require('../config/cloudinary');

// @desc    Get all features
// @route   GET /api/features
// @access  Public
const getFeatures = async (req, res) => {
  try {
    const { page, limit, serviceId, showOnHome, excludeId, sort } = req.query;

    const filter = {};
    if (serviceId) filter.serviceId = serviceId;
    if (showOnHome !== undefined) filter.showOnHome = showOnHome === 'true';
    if (excludeId) filter._id = { $ne: excludeId };

    const sortOption = sort === 'title' ? { title: 1 } : { createdAt: -1 };

    // Paginated mode: only when the caller opts in via page/limit.
    if (page || limit) {
      const pageNum = Math.max(parseInt(page, 10) || 1, 1);
      const limitNum = Math.max(parseInt(limit, 10) || 12, 1);

      const [features, total] = await Promise.all([
        Feature.find(filter)
          .populate('serviceId', 'title')
          .sort(sortOption)
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum),
        Feature.countDocuments(filter),
      ]);

      return res.status(200).json({
        features,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      });
    }

    const features = await Feature.find(filter).populate('serviceId', 'title').sort(sortOption);
    res.status(200).json(features);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single feature
// @route   GET /api/features/:id
// @access  Public
const getFeature = async (req, res) => {
    try {
        const feature = await Feature.findById(req.params.id).populate('serviceId', 'title');
        if (!feature) {
            res.status(404);
            throw new Error('Feature not found');
        }
        res.status(200).json(feature);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a feature
// @route   POST /api/features
// @access  Private (Admin only)
const createFeature = async (req, res) => {
  try {
    const { title, description, serviceId, detailDescription } = req.body;
    let imageUrl = req.body.imageUrl;
    let moreImages = [];

    // Handle primary image
    if (req.files && req.files['image']) {
      imageUrl = req.files['image'][0].path;
    }

    // Handle additional images
    if (req.files && req.files['moreImages']) {
      req.files['moreImages'].forEach((file) => {
        moreImages.push(file.path);
      });
    }

    if (!title || !description) {
      res.status(400);
      throw new Error('Please add title and description');
    }

    const feature = await Feature.create({
      title,
      description,
      imageUrl,
      serviceId: serviceId || null,
      detailDescription: detailDescription || '',
      moreImages: moreImages,
    });
    res.status(201).json(feature);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a feature
// @route   PUT /api/features/:id
// @access  Private (Admin only)
const updateFeature = async (req, res) => {
  try {
    const feature = await Feature.findById(req.params.id);

    if (!feature) {
      res.status(404);
      throw new Error('Feature not found');
    }

    let imageUrl = req.body.imageUrl || feature.imageUrl;
    let moreImages = feature.moreImages || [];

    // Keep only explicitly retained existing additional images when provided.
    if (Object.prototype.hasOwnProperty.call(req.body, 'existingMoreImages')) {
      let keptExistingImages = [];

      if (Array.isArray(req.body.existingMoreImages)) {
        keptExistingImages = req.body.existingMoreImages;
      } else if (typeof req.body.existingMoreImages === 'string') {
        try {
          const parsed = JSON.parse(req.body.existingMoreImages);
          keptExistingImages = Array.isArray(parsed) ? parsed : [];
        } catch (parseError) {
          keptExistingImages = [];
        }
      }

      const removedImages = (feature.moreImages || []).filter(
        (img) => !keptExistingImages.includes(img)
      );

      for (const removedImage of removedImages) {
        await deleteImage(removedImage);
      }

      moreImages = keptExistingImages;
    }

    // Update primary image
    if (req.files && req.files['image']) {
      if (feature.imageUrl) {
        // Delete old image
        await deleteImage(feature.imageUrl);
      }
      imageUrl = req.files['image'][0].path;
    }

    // Add new additional images
    if (req.files && req.files['moreImages']) {
      req.files['moreImages'].forEach((file) => {
        moreImages.push(file.path);
      });
    }

    const updatedData = {
      ...req.body,
      imageUrl,
      moreImages,
    };

    const updatedFeature = await Feature.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
      }
    );
    res.status(200).json(updatedFeature);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a feature
// @route   DELETE /api/features/:id
// @access  Private (Admin only)
const deleteFeature = async (req, res) => {
  try {
    const feature = await Feature.findById(req.params.id);

    if (!feature) {
      res.status(404);
      throw new Error('Feature not found');
    }

    if (feature.imageUrl) {
        await deleteImage(feature.imageUrl);
    }
    
    await feature.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getFeatures,
  getFeature,
  createFeature,
  updateFeature,
  deleteFeature,
};
