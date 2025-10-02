import { createClient } from '@supabase/supabase-js';
import { generateMangaImageUrl } from '../imageGenerator.js';
import dotenv from 'dotenv';

dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function convertMangaFallback(req, res) {
  try {
    const { paragraph, lessonId } = req.body;

    // Fallback: Create panels without Gemini API
    const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const panels = sentences.slice(0, 4).map((sentence, index) => ({
      panel: index + 1,
      scene: `Historical scene showing: ${sentence.trim()}`,
      caption: sentence.trim().substring(0, 60) + (sentence.length > 60 ? '...' : ''),
      character: index % 2 === 0 ? 'Narrator' : 'Character'
    }));

    const enhancedPanels = await Promise.all(panels.map(async (panel) => {
      const imageUrl = generateMangaImageUrl(panel.scene, panel.panel);
      
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          lesson_id: lessonId,
          panel_order: panel.panel,
          caption: panel.caption,
          image_url: imageUrl,
          scene_description: panel.scene,
          character: panel.character
        })
        .select();

      return data ? data[0] : panel;
    }));

    res.json({ 
      success: true, 
      panels: enhancedPanels,
      message: `Created ${panels.length} manga panels (fallback mode)`
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}