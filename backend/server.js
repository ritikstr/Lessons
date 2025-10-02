import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { convertManga } from './api/convert-manga.js';
import { convertMangaFallback } from './api/convert-manga-fallback.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Manga API Server Running' }));
app.post('/api/convert-manga', convertMangaFallback);
app.post('/api/convert-manga-ai', convertManga);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});