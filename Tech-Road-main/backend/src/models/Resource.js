const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  title_ar: String,
  description: String,
  description_ar: String,
  type: String,
  url: String,
  author: String,
  platform: String,
  associated_skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  language: String,
  is_free: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Resource', ResourceSchema);