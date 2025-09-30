const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');

// Debug: Check if environment variables are loaded
console.log('🔧 Environment check:', {
  MONGODB_URI: process.env.MONGODB_URI ? 'Loaded ✅' : 'Missing ❌',
  PORT: process.env.PORT || 'Default'
});

const connectDB = require('./src/config/db');
const { User, Resource } = require('./src/models');

const app = express();

// Middleware
app.use(express.json());

// Connect to DB
connectDB();

// Example route
app.get('/', (req, res) => {
  res.send('SkillSnap AI+ API is running...');
});

// Example: Fetch all users
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));