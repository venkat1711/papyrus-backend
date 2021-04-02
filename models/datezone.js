const mongoose = require('mongoose');

const datezoneSchema = new mongoose.Schema(
  {
    name: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Datezone', datezoneSchema);
