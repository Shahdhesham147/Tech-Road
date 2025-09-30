const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  name_ar: String,
  description: String,
  description_ar: String,
  icon_url: String,
  avg_duration_months: Number,
  career_outlook_summary: String,
  career_outlook_summary_ar: String,
  key_skills_overview: [
    {
      skill_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
      proficiency_target: String
    }
  ],
  is_active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Track', TrackSchema);