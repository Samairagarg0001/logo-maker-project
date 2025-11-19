const mongoose = require('mongoose');

const LogoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // 👈 ADD THIS! This creates the Database Index for scaling.
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  logoData: { 
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Logo', LogoSchema);