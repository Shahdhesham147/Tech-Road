const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: String,
  location: { country: String, city: String },
  current_skills: [
    {
      skill_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
      name: String,
      proficiency: String
    }
  ],
  career_discovery_data: Object,
  learning_preferences: Object
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);