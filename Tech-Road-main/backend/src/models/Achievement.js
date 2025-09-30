const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  name_ar: String,
  description: String,
  description_ar: String,
  badge_icon_url: String,
  criteria: mongoose.Schema.Types.Mixed,
  points_awarded: Number,
  is_active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Achievement', AchievementSchema);