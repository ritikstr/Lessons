import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export async function convertMangaSimple(req, res) {
  try {
    const { paragraph, lessonId } = req.body;

    const prompt = `Convert this history text into 4 manga panels. Return JSON only:

History: "${paragraph}"

Format: [{"panel": 1, "scene": "manga scene description", "caption": "dialogue text", "character": "character name"}]`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'API Error');
    }

    const text = data.candidates[0].content.parts[0].text;
    const cleanText = text.replace(/```json|```/g, '').trim();
    const panels = JSON.parse(cleanText);

    // Generate images for each panel
    const result = await Promise.all(panels.map(async (panel) => {
      try {
        // Generate image using Gemini Imagen
        const imageResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage?key=${process.env.GEMINI_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `Manga style black and white illustration: ${panel.scene}. Historical setting, dramatic composition, detailed characters, cinematic angle, high contrast ink art style`,
            config: {
              numberOfImages: 1,
              aspectRatio: "3:4",
              negativePrompt: "color, realistic photo, blurry"
            }
          })
        });

        let imageUrl = `https://via.placeholder.com/800x600?text=Panel+${panel.panel}`;
        
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          if (imageData.candidates && imageData.candidates[0]) {
            imageUrl = `data:image/jpeg;base64,${imageData.candidates[0].image.data}`;
          }
        }

        return {
          lesson_id: lessonId,
          panel_order: panel.panel,
          caption: panel.caption,
          image_url: imageUrl,
          scene_description: panel.scene,
          character: panel.character
        };
      } catch (error) {
        console.error(`Error generating image for panel ${panel.panel}:`, error);
        return {
          lesson_id: lessonId,
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
      panels: result,
      message: `Created ${panels.length} manga panels`
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}