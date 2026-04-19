const mongoose = require('mongoose');

const featureSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: false,
    },
    detailDescription: {
      type: String, // Extended description for the detail page
      required: false,
    },
    moreImages: [{
      type: String, // Array of URLs for additional images
    }],
    showOnHome: {
      type: Boolean,
      default: false, // Admin must explicitly select which features to show
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Feature', featureSchema);
