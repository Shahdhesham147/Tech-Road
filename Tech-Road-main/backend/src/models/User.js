const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: Object, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  email_verified: { type: Boolean, default: false },
  role: { type: String, enum: ['student', 'admin'], default: 'student' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
