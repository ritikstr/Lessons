import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { convertManga } from './api/convert-manga.js';
import { convertMangaMock } from './api/convert-manga-mock.js';
import { convertMangaLocal } from './api/convert-manga-local.js';
import { convertMangaSimple } from './api/convert-manga-simple.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Manga API Server Running' }));
app.post('/api/convert-manga', convertManga);
app.post('/api/convert-manga-mock', convertMangaMock);
app.post('/api/convert-manga-local', convertMangaLocal);
app.post('/api/convert-manga-simple', convertMangaSimple);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});