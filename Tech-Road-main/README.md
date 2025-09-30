# Tech-Road MVP

An AI-powered career development platform that provides personalized career coaching, skill roadmap generation, and progress tracking.

## 🎯 Project Overview

Tech-Road sis designed for the contest submission with a 6-week development timeline. The platform delivers four core features:
# front_end 
1. **AI Career Coach** - GPT-powered career analysis and recommendations
2. **Career Discovery** - Interactive questionnaire for students without clear direction
3. **Skill Roadmap Generator** - AI-generated personalized learning paths
4. **Skill Tracker** - Gamified progress tracking with achievements

## 🏗️ Architecture

- **Backend**: Flask (Python) + MongoDB
- **AI**: OpenAI GPT-4
- **Auth**: JWT Authentication
- **Storage**: Local file system / Cloud storage
- **Deployment**: Static hosting (Frontend) + Cloud hosting (Backend)

## 📁 Project Structure

```
skillsnap-ai-plus/
├── frontend/                    # HTML/CSS/JS/Bootstrap frontend
│   ├── public/                  # HTML pages
│   │   ├── index.html          # Landing page
│   │   ├── career-discovery.html # Career discovery questionnaire
│   │   ├── ai-coach.html       # AI career coach interface
│   │   ├── dashboard.html      # User progress dashboard
│   │   └── roadmap.html        # Interactive roadmap visualization
│   └── src/                    # Frontend assets
│       ├── css/                # Custom stylesheets
│       │   ├── style.css       # Global styles
│       │   ├── career-discovery.css
│       │   ├── dashboard.css
│       │   ├── roadmap.css
│       │   └── ai-coach.css
│       ├── js/                 # JavaScript modules
│       │   ├── main.js         # Main application logic
│       │   ├── career-discovery.js
│       │   ├── dashboard.js
│       │   ├── roadmap.js
│       │   └── ai-coach.js
│       └── assets/             # Static assets (images, icons)
├── backend/                    # Flask backend API
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   │   ├── auth.py        # Authentication routes
│   │   │   ├── career_discovery.py
│   │   │   ├── ai_coach.py
│   │   │   └── roadmap.py
│   │   ├── models/            # Database models
│   │   │   ├── seeders/
|   |   |   |   |── 
│   │   │   |   |── 
│   │   │   └── setup_db.py
│   │   ├── services/          # Business logic services
│   │   │   ├── ai_roadmap_generator.py
│   │   │   ├── career_analyzer.py
│   │   │   └── skill_tracker.py
│   │   ├── utils/             # Utility functions
│   │   └── main.py            # Flask application entry point
│   ├── requirements.txt       # Python dependencies
│   └── .env.example          # Environment variables template
├── docs/                      # Project documentation
│   ├── api-specification.md   # Complete API documentation
│   ├── career-discovery-feature.md
│   ├── ai-personalized-roadmap-system.md
│   ├── team-charter.md
│   └── sprint-planning-template.md
├── scripts/                   # Setup and deployment scripts
│   └── setup.sh              # Development environment setup
├── config/                    # Configuration files
│   └── .env.backend.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Modern web browser
- MongoDB (local or Atlas)
- OpenAI API key

### Environment Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd skillsnap-ai-plus
```

2. **Set up the backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Configure environment variables:**
```bash
# Copy and edit the environment file
cp .env.example .env

# Add your API keys and configuration:
# OPENAI_API_KEY=your_openai_api_key
# MONGODB_URI=mongodb://localhost:27017/skillsnap
# JWT_SECRET_KEY=your_jwt_secret
```

4. **Start the backend server:**
```bash
python src/main.py
```

5. **Serve the frontend:**
```bash
# Option 1: Simple HTTP server (Python)
cd ../frontend/public
python -m http.server 8080

# Option 2: Live Server (VS Code extension)
# Right-click on index.html and select "Open with Live Server"

# Option 3: Any static file server
# Serve the frontend/public directory
```

6. **Access the application:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000

## 🔧 Development Workflow

### Team Roles

- **Full-Stack Developer (Team Lead)**: Backend API, database, AI integrations
- **Frontend Developer**: HTML/CSS/JS implementation, UI/UX, API integration
- **UI/UX Designer**: Design system, user experience, visual assets
- **AI Engineer**: Prompt engineering, AI service integration, data processing

### Development Phases

**Week 1**: Project setup, basic HTML structure, backend foundation

**Week 2**: User authentication, career discovery questionnaire

**Week 3**: AI career coach integration, CV analysis

**Week 4**: Personalized roadmap generation, visualization

**Week 5**: Dashboard, progress tracking, skill assessment

**Week 6**: Polish, testing, deployment preparation

### Git Workflow

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature development branches
- `hotfix/*` - Critical bug fixes

## 📊 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile

### Career Discovery
- `POST /career-discovery/start` - Start assessment
- `POST /career-discovery/{id}/responses` - Submit responses
- `GET /career-discovery/{id}/progress` - Get progress
- `POST /career-discovery/{id}/analyze` - Generate recommendations

### AI Career Coach
- `POST /ai-coach/analyze-cv` - Analyze uploaded CV
- `POST /ai-coach/skill-gap-analysis` - Analyze skill gaps
- `GET /ai-coach/career-advice` - Get career advice
- `POST /ai-coach/interview-prep` - Interview preparation

### Roadmap Management
- `POST /roadmap/generate-personalized` - Generate AI roadmap
- `GET /roadmap/user-roadmaps` - Get user roadmaps
- `PUT /roadmap/{id}/progress` - Update progress
- `GET /roadmap/{id}/visualization` - Get roadmap data

### Skill Tracking
- `GET /skills/catalog` - Get skills catalog
- `POST /skills/assess` - Record skill assessment
- `GET /skills/progress` - Get progress dashboard
- `POST /skills/achievement` - Record achievement

## 🎨 Frontend Features

### Landing Page (index.html)
- Hero section with value proposition
- Feature overview cards
- Call-to-action buttons
- Responsive design

### Career Discovery (career-discovery.html)
- Multi-stage assessment questionnaire
- Progress tracking sidebar
- Interactive ranking system
- AI-powered recommendations

### AI Coach (ai-coach.html)
- CV upload and analysis
- Skill gap analysis
- Career advice sections
- Interview preparation tools

### Dashboard (dashboard.html)
- Progress overview cards
- Interactive charts (Chart.js)
- Skill progress tracking
- Achievement system
- AI recommendations

### Roadmap (roadmap.html)
- Interactive timeline visualization
- Phase navigation
- Skill cards with progress
- Current project tracking
- AI insights panel

## 🧪 Testing

### Frontend Testing
```bash
# Open each HTML file in browser and test:
# - Responsive design (mobile/desktop)
# - Interactive elements
# - Form submissions
# - Navigation between pages
```

### Backend Testing
```bash
cd backend
source venv/bin/activate
python -m pytest tests/ -v
```

### API Testing
```bash
# Use tools like Postman or curl to test API endpoints
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🚀 Deployment

### Frontend Deployment (Static Hosting)

**Option 1: Netlify**
```bash
# Build command: Not needed (static files)
# Publish directory: frontend/public
```

**Option 2: Vercel**
```bash
# Deploy the frontend/public directory
vercel --prod
```

**Option 3: GitHub Pages**
```bash
# Push frontend/public contents to gh-pages branch
git subtree push --prefix frontend/public origin gh-pages
```

### Backend Deployment (Cloud Hosting)

**Option 1: Render**
```bash
# Connect GitHub repository
# Build command: pip install -r requirements.txt
# Start command: python src/main.py
```

**Option 2: Railway**
```bash
# Connect GitHub repository
# Railway will auto-detect Flask app
```

**Option 3: Heroku**
```bash
# Add Procfile: web: python src/main.py
heroku create skillsnap-ai-backend
git push heroku main
```

## 📝 Environment Variables

### Backend (.env)
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_API_BASE=https://api.openai.com/v1

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillsnap

# Authentication
JWT_SECRET_KEY=your_jwt_secret_key_here
JWT_EXPIRATION_HOURS=24

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_FOLDER=uploads

# CORS Configuration
CORS_ORIGINS=http://localhost:8080,https://your-frontend-domain.com

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

## 🔧 Configuration

### Frontend Configuration
Update API endpoints in JavaScript files:
```javascript
// In src/js/main.js
const API_BASE_URL = 'http://localhost:5000/api'; // Development
// const API_BASE_URL = 'https://your-backend-domain.com/api'; // Production
```

### CORS Setup
Ensure backend allows frontend domain:
```python
# In backend/src/main.py
CORS(app, origins=['http://localhost:8080', 'https://your-frontend-domain.com'])
```

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is developed for contest submission. All rights reserved.

## 🆘 Support & Documentation

- **API Documentation**: `/docs/api-specification.md`
- **Feature Specifications**: `/docs/` directory
- **Team Guidelines**: `/docs/team-charter.md`
- **Development Setup**: This README

## 🔗 Live Demo

- **Frontend**: 
- **Backend API**: 

---

**Built with ❤️ for the Tech-Road Contest**
