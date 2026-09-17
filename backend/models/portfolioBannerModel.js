const mongoose = require('mongoose');

const portfolioBannerSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      default: '',
    },
    subtitle: {
      type: String,
      required: false,
      default: '',
    },
    imageUrl: {
      type: String,
      required: [true, 'Please add an image'],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PortfolioBanner', portfolioBannerSchema);
