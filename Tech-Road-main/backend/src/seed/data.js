// Seed data definitions for Tech-Road database
const seedData = {
  skills: [
    { name: "HTML", category: "Frontend", difficulty: "beginner", description: "HyperText Markup Language for web structure" },
    { name: "CSS", category: "Frontend", difficulty: "beginner", description: "Cascading Style Sheets for web styling" },
    { name: "JavaScript", category: "Programming", difficulty: "intermediate", description: "Programming language for web interactivity" },
    { name: "React", category: "Frontend", difficulty: "intermediate", description: "JavaScript library for building user interfaces" },
    { name: "Node.js", category: "Backend", difficulty: "intermediate", description: "JavaScript runtime for server-side development" },
    { name: "Python", category: "Programming", difficulty: "beginner", description: "High-level programming language" },
    { name: "MongoDB", category: "Database", difficulty: "intermediate", description: "NoSQL document database" },
    { name: "Git", category: "Tools", difficulty: "beginner", description: "Version control system" },
    { name: "Problem Solving", category: "Soft Skills", difficulty: "intermediate", description: "Analytical and logical thinking skills" },
    { name: "Communication", category: "Soft Skills", difficulty: "beginner", description: "Effective communication and teamwork" },
    { name: "Express.js", category: "Backend", difficulty: "intermediate", description: "Web framework for Node.js" },
    { name: "REST APIs", category: "Backend", difficulty: "intermediate", description: "RESTful API design and development" }
  ],

  tracks: [
    {
      name: "Frontend Development",
      description: "Learn to build user interfaces and client-side applications",
      category: "Web Development",
      difficulty: "beginner",
      estimated_duration_weeks: 16,
      icon: "🎨",
      color: "#3B82F6"
    },
    {
      name: "Backend Development", 
      description: "Learn server-side programming and database management",
      category: "Web Development",
      difficulty: "intermediate",
      estimated_duration_weeks: 20,
      icon: "⚙️",
      color: "#10B981"
    },
    {
      name: "Full Stack Development",
      description: "Complete web development covering both frontend and backend",
      category: "Web Development", 
      difficulty: "intermediate",
      estimated_duration_weeks: 24,
      icon: "🚀",
      color: "#8B5CF6"
    },
    {
      name: "Data Science",
      description: "Learn data analysis, machine learning, and statistical modeling",
      category: "Data & Analytics",
      difficulty: "intermediate",
      estimated_duration_weeks: 22,
      icon: "📊",
      color: "#F59E0B"
    }
  ],

  resources: [
    {
      title: "MDN Web Docs",
      description: "Comprehensive documentation for web technologies",
      type: "documentation",
      url: "https://developer.mozilla.org/",
      difficulty: "beginner",
      estimated_time_hours: 0,
      is_free: true
    },
    {
      title: "React Official Documentation",
      description: "Official React.js documentation and tutorials",
      type: "documentation", 
      url: "https://reactjs.org/docs/",
      difficulty: "intermediate",
      estimated_time_hours: 0,
      is_free: true
    },
    {
      title: "Python for Everybody",
      description: "Complete Python course for beginners",
      type: "course",
      url: "https://www.coursera.org/specializations/python",
      difficulty: "beginner",
      estimated_time_hours: 40,
      is_free: false
    },
    {
      title: "Git Handbook",
      description: "Complete guide to Git version control",
      type: "tutorial",
      url: "https://guides.github.com/introduction/git-handbook/",
      difficulty: "beginner",
      estimated_time_hours: 3,
      is_free: true
    },
    {
      title: "Node.js Complete Guide",
      description: "Comprehensive Node.js course covering all fundamentals",
      type: "course",
      url: "https://nodejs.org/en/docs/",
      difficulty: "intermediate",
      estimated_time_hours: 30,
      is_free: true
    }
  ],

  achievements: [
    {
      name: "First Steps",
      description: "Complete your profile setup",
      icon: "👋",
      criteria: { type: "profile_completion", target: 100 },
      points: 50
    },
    {
      name: "Skill Explorer", 
      description: "Add your first skill to your profile",
      icon: "🔍",
      criteria: { type: "skills_added", target: 1 },
      points: 100
    },
    {
      name: "Track Chooser",
      description: "Select your first learning track",
      icon: "🎯",
      criteria: { type: "track_selected", target: 1 },
      points: 150
    },
    {
      name: "Skill Master",
      description: "Reach advanced level in any skill",
      icon: "🏆",
      criteria: { type: "skill_proficiency", target: "advanced" },
      points: 500
    },
    {
      name: "Consistent Learner",
      description: "Learn for 7 consecutive days",
      icon: "📚",
      criteria: { type: "daily_streak", target: 7 },
      points: 300
    }
  ],

  users: [
    { 
      name: { first: "أحمد", last: "محمد" }, 
      email: "ahmed.mohamed@example.com", 
      password: "password123", 
      email_verified: true, 
      role: "student" 
    },
    { 
      name: { first: "فاطمة", last: "علي" }, 
      email: "fatima.ali@example.com", 
      password: "password123", 
      email_verified: true, 
      role: "student" 
    },
    { 
      name: { first: "محمد", last: "حسن" }, 
      email: "mohamed.hassan@example.com", 
      password: "password123", 
      email_verified: false, 
      role: "student" 
    },
    { 
      name: 'laila mohamed', 
      email: 'laila.mohamed.fikry@gmail.com', 
      role: 'student' 
    },
    { 
      name: 'shahd hesham', 
      email: 'shahdhisham047@gmail.com', 
      role: 'student' 
    },
    { 
      name: 'taha ali', 
      email: 'ta6717452@gmail.com', 
      role: 'student' 
    },
    { 
      name: 'abdelrahman said', 
      email: 'abdelrahman.said.ai@gmail.com', 
      role: 'student' 
    }
  ]
};

module.exports = { seedData };
