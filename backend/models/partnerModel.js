const mongoose = require('mongoose');

const partnerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a company/organization name'],
    },
    logoUrl: {
      type: String,
      required: [true, 'Please add a logo'],
    },
    website: {
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

module.exports = mongoose.model('Partner', partnerSchema);
