require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const Track = require('../models/Track');
const Skill = require('../models/Skill');
const Resource = require('../models/Resource');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');

const { seedData } = require('./data');

// -------------------- UTILS --------------------
async function upsertMany(model, data, uniqueField) {
  let inserted = 0;
  let updated = 0;

  for (const item of data) {
    const existing = await model.findOne({ [uniqueField]: item[uniqueField] });
    if (existing) {
      await model.updateOne({ _id: existing._id }, { $set: item });
      updated++;
    } else {
      await model.create(item);
      inserted++;
    }
  }
  console.log(`✅ ${model.modelName}: ${inserted} inserted, ${updated} updated`);
  return await model.find();
}

// -------------------- SEEDERS --------------------
const seedSkills = async () => {
  return await upsertMany(Skill, seedData.skills, 'name');
};

const seedTracks = async (skills) => {
  // Add skill references to tracks
  const tracksWithSkills = seedData.tracks.map(track => {
    let key_skills_overview = [];
    
    if (track.name === "Frontend Development") {
      key_skills_overview = [
        { skill_id: skills.find(s => s.name === "HTML")._id, proficiency_target: "intermediate" },
        { skill_id: skills.find(s => s.name === "CSS")._id, proficiency_target: "intermediate" },
        { skill_id: skills.find(s => s.name === "JavaScript")._id, proficiency_target: "advanced" },
        { skill_id: skills.find(s => s.name === "React")._id, proficiency_target: "intermediate" }
      ];
    } else if (track.name === "Backend Development") {
      key_skills_overview = [
        { skill_id: skills.find(s => s.name === "JavaScript")._id, proficiency_target: "advanced" },
        { skill_id: skills.find(s => s.name === "Node.js")._id, proficiency_target: "advanced" },
        { skill_id: skills.find(s => s.name === "MongoDB")._id, proficiency_target: "intermediate" },
        { skill_id: skills.find(s => s.name === "Express.js")._id, proficiency_target: "intermediate" }
      ];
    } else if (track.name === "Data Science") {
      key_skills_overview = [
        { skill_id: skills.find(s => s.name === "Python")._id, proficiency_target: "advanced" },
        { skill_id: skills.find(s => s.name === "Problem Solving")._id, proficiency_target: "advanced" }
      ];
    } else if (track.name === "Full Stack Development") {
      key_skills_overview = [
        { skill_id: skills.find(s => s.name === "HTML")._id, proficiency_target: "intermediate" },
        { skill_id: skills.find(s => s.name === "CSS")._id, proficiency_target: "intermediate" },
        { skill_id: skills.find(s => s.name === "JavaScript")._id, proficiency_target: "advanced" },
        { skill_id: skills.find(s => s.name === "React")._id, proficiency_target: "advanced" },
        { skill_id: skills.find(s => s.name === "Node.js")._id, proficiency_target: "advanced" },
        { skill_id: skills.find(s => s.name === "MongoDB")._id, proficiency_target: "intermediate" }
      ];
    }
    
    return { ...track, key_skills_overview };
  });
  
  return await upsertMany(Track, tracksWithSkills, 'name');
};

const seedResources = async (skills) => {
  // Add skill associations to resources
  const resourcesWithSkills = seedData.resources.map(resource => {
    let associated_skills = [];
    
    if (resource.title === "MDN Web Docs") {
      associated_skills = [
        skills.find(s => s.name === "HTML")._id,
        skills.find(s => s.name === "CSS")._id,
        skills.find(s => s.name === "JavaScript")._id
      ];
    } else if (resource.title === "React Official Documentation") {
      associated_skills = [skills.find(s => s.name === "React")._id];
    } else if (resource.title === "Python for Everybody") {
      associated_skills = [skills.find(s => s.name === "Python")._id];
    } else if (resource.title === "Git Handbook") {
      associated_skills = [skills.find(s => s.name === "Git")._id];
    } else if (resource.title === "Node.js Complete Guide") {
      associated_skills = [skills.find(s => s.name === "Node.js")._id];
    }
    
    return { ...resource, associated_skills };
  });
  
  return await upsertMany(Resource, resourcesWithSkills, 'title');
};

const seedAchievements = async () => {
  return await upsertMany(Achievement, seedData.achievements, 'name');
};

const seedUsers = async () => {
  return await upsertMany(User, seedData.users, 'email');
};

const seedUserProfiles = async (users, skills, tracks) => {
  let inserted = 0;

  // Create sample profiles for the first few users
  const sampleProfiles = [
    {
      user_id: users[0]._id,
      bio: "طالب هندسة مهتم بتطوير الويب",
      location: { country: "Egypt", city: "Cairo" },
      current_skills: [
        { skill_id: skills.find(s => s.name === "HTML")._id, name: "HTML", proficiency: "intermediate" },
        { skill_id: skills.find(s => s.name === "CSS")._id, name: "CSS", proficiency: "beginner" }
      ],
      career_discovery_data: {
        chosen_track: {
          track_id: tracks.find(t => t.name === "Frontend Development")._id,
          name: "Frontend Development"
        }
      },
      learning_preferences: {
        style: "visual",
        weekly_commitment_hours: 15
      }
    },
    {
      user_id: users[1]._id,
      bio: "خريجة حاسوب تسعى لتطوير مهاراتها في البرمجة",
      location: { country: "Jordan", city: "Amman" },
      current_skills: [
        { skill_id: skills.find(s => s.name === "Python")._id, name: "Python", proficiency: "intermediate" }
      ],
      career_discovery_data: {
        chosen_track: {
          track_id: tracks.find(t => t.name === "Data Science")._id,
          name: "Data Science"
        }
      },
      learning_preferences: {
        style: "reading_writing",
        weekly_commitment_hours: 20
      }
    }
  ];

  for (const profile of sampleProfiles) {
    const existing = await UserProfile.findOne({ user_id: profile.user_id });
    if (!existing) {
      await UserProfile.create(profile);
      inserted++;
    }
  }

  // Create basic profiles for remaining users
  for (let i = 2; i < users.length; i++) {
    const existing = await UserProfile.findOne({ user_id: users[i]._id });
    if (!existing) {
      const basicProfile = {
        user_id: users[i]._id,
        bio: "",
        location: { country: "", city: "" },
        current_skills: [],
        career_discovery_data: {},
        learning_preferences: { style: "visual", weekly_commitment_hours: 10 }
      };
      await UserProfile.create(basicProfile);
      inserted++;
    }
  }

  const allProfiles = await UserProfile.find();
  console.log(`✅ Added ${inserted} new user profiles (total: ${allProfiles.length})`);
  return allProfiles;
};

// -------------------- MAIN --------------------
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    await connectDB();

    const skills = await seedSkills();
    const tracks = await seedTracks(skills);
    const resources = await seedResources(skills);
    const achievements = await seedAchievements();
    const users = await seedUsers();
    const profiles = await seedUserProfiles(users, skills, tracks);

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('💥 Seeding failed:', err);
    process.exit(1);
  }
};

// Run directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
