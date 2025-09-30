const mongoose = require('mongoose');

const UserAchievementSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  achievement_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement', required: true },
  earned_at: { type: Date, default: Date.now }
});

UserAchievementSchema.index({ user_id: 1, achievement_id: 1 }, { unique: true });

module.exports = mongoose.model('UserAchievement', UserAchievementSchema);