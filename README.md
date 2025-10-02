# Anime Lessons - History to Manga Converter

Convert boring history paragraphs into engaging manga-style panels using AI.

## Features
- Converts text to 4-6 manga panels with AI-generated scenes
- Few-shot learning from example dataset
- Supabase integration for data storage
- React frontend with Node.js backend

## Setup

### Prerequisites
- Node.js (v16+)
- Supabase account
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Anime_lessons
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

### Environment Variables

Create `backend/.env` file:
```env
GEMINI_KEY=your_gemini_api_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
PORT=3001
```

**Get API Keys:**
- **Gemini API**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Supabase**: Create project at [supabase.com](https://supabase.com)

### Database Setup

Create this table in Supabase:
```sql
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  lesson_id TEXT,
  panel_order INTEGER,
  caption TEXT,
  image_url TEXT,
  scene_description TEXT,
  character TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Running the Application

1. **Start Backend**
```bash
cd backend
npm start
```

2. **Start Frontend** (new terminal)
```bash
cd frontend
npm start
```

3. **Open** http://localhost:3000

## Usage

1. Enter a history paragraph
2. Click "Convert to Manga"
3. View generated manga panels
4. New examples automatically added to `dataset.json`

## Project Structure
```
Anime_lessons/
├── backend/          # Node.js API server
├── frontend/         # React application
├── dataset.json      # Training examples for AI
└── README.md
```

## API Endpoints

- `POST /api/convert-manga` - Convert text to manga panels
- `GET /api/lessons/:id` - Get lesson panels

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request