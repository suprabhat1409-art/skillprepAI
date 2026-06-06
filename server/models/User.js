const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: false, select: false },
  googleId: { type: String, default: null },
  avatar: { type: String, default: null },
  skills: { type: [String], default: [] },
  targetRole: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);