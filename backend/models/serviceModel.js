const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
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
      // Optional
    },
    showOnHome: {
      type: Boolean,
      default: false, // Admin must explicitly select which services to show
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
