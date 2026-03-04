const mongoose = require('mongoose');

const contactBannerSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      default: '',
    },
    imageUrl: {
      type: String,
      required: [true, 'Please add an image'],
    },
    link: {
      type: String,
      required: false,
      default: '',
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

module.exports = mongoose.model('ContactBanner', contactBannerSchema);
