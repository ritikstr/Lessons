import { MangaTrainer } from '../manga-trainer.js';
import { generateMangaImageUrl } from '../imageGenerator.js';

const trainer = new MangaTrainer();

export async function convertMangaLocal(req, res) {
  try {
    const { paragraph, lessonId } = req.body;

    console.log('Using local manga conversion...');
    
    // Generate panels using local training
    const panels = trainer.generateMangaPanels(paragraph);
    
    // Enhance panels with images
    const enhancedPanels = panels.map((panel, index) => ({
      lesson_id: lessonId,
      panel_order: panel.panel,
      caption: panel.caption,
      image_url: generateMangaImageUrl(panel.scene, panel.panel),
      scene_description: panel.scene,
      character: panel.character
    }));

    res.json({ 
      success: true, 
      panels: enhancedPanels,
      message: `Created ${panels.length} manga panels using local training`,
      method: 'local'
    });

  } catch (error) {
    console.error('Local conversion error:', error);
    res.status(500).json({ error: error.message });
  }
}