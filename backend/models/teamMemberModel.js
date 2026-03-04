const mongoose = require('mongoose');

const teamMemberSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    role: {
      type: String,
      required: [true, 'Please add a role'],
    },
    bio: {
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

module.exports = mongoose.model('TeamMember', teamMemberSchema);
