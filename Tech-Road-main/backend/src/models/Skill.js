const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  name_ar: String,
  description: String,
  description_ar: String,
  category: String,
  related_tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }],
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  is_active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Skill', SkillSchema);