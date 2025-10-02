import { createClient } from '@supabase/supabase-js';
import { generateMangaImageUrl } from '../imageGenerator.js';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Mock manga conversion (works without Gemini API)
export async function convertMangaMock(req, res) {
  try {
    const { paragraph, lessonId } = req.body;

    // Mock panels based on input
    const mockPanels = [
      {
        panel: 1,
        scene: `Historical scene showing the beginning of: ${paragraph.substring(0, 50)}...`,
        caption: "The story begins with great events unfolding...",
        character: "Narrator"
      },
      {
        panel: 2, 
        scene: `Characters discussing the main events from: ${paragraph.substring(0, 50)}...`,
        caption: "Important decisions were made that changed history!",
        character: "Historical Figure"
      },
      {
        panel: 3,
        scene: `Epic conclusion showing the impact of: ${paragraph.substring(0, 50)}...`,
        caption: "And thus, history was forever changed...",
        character: "Narrator"
      }
    ];

    // Generate images and save to database
    const enhancedPanels = await Promise.all(mockPanels.map(async (panel, index) => {
      try {
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

        if (error) throw error;
        return data[0];
      } catch (err) {
        console.error(`Error processing panel ${index + 1}:`, err);
        return {
          panel_order: panel.panel,
          caption: panel.caption,
          image_url: `https://via.placeholder.com/800x600?text=Panel+${panel.panel}`,
          scene_description: panel.scene,
          character: panel.character
        };
      }
    }));

    res.json({ 
      success: true, 
      panels: enhancedPanels,
      message: `Created ${mockPanels.length} manga panels (MOCK MODE - Fix Gemini API key)`
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}