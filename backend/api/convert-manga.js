import { client } from '../geminiClient.js';
import { createClient } from '@supabase/supabase-js';
import { generateMangaImageUrl } from '../imageGenerator.js';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Load examples from dataset.json
async function loadExamples() {
  try {
    const datasetPath = path.join(process.cwd(), '..', 'dataset.json');
    const data = await fs.readFile(datasetPath, 'utf8');
    const dataset = JSON.parse(data);
    
    // Pick 2-3 random examples
    const shuffled = dataset.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  } catch (error) {
    console.error('Error loading dataset:', error);
    return [];
  }
}

// Save new result to dataset.json
async function saveToDataset(chapter, paragraph, panels) {
  try {
    const datasetPath = path.join(process.cwd(), '..', 'dataset.json');
    const data = await fs.readFile(datasetPath, 'utf8');
    const dataset = JSON.parse(data);
    
    const newEntry = {
      chapter,
      paragraph,
      panels: panels.map(p => p.scene_description)
    };
    
    dataset.push(newEntry);
    await fs.writeFile(datasetPath, JSON.stringify(dataset, null, 2));
  } catch (error) {
    console.error('Error saving to dataset:', error);
  }
}

export async function convertManga(req, res) {
  try {
    const { paragraph, lessonId } = req.body;

    // 1️⃣ Load examples and generate engaging manga-style history story
    const examples = await loadExamples();
    const model = client.getGenerativeModel({ model: "gemini-pro" });
    
    // Build few-shot prompt with examples
    let exampleText = "Here are some examples of converting history paragraphs into manga panels:\n\n";
    examples.forEach((example, i) => {
      exampleText += `Example ${i + 1}:\nHistory: "${example.paragraph}"\nPanels: ${JSON.stringify(example.panels)}\n\n`;
    });
    
    const scriptPrompt = `${exampleText}Now convert this history text into an engaging 4-6 panel manga story following the same style. Make it dramatic, interesting and amazing to read like a comic book. Each panel should have:
- A dramatic scene description for image generation
- Engaging dialogue or narration (8-15 words)
- Historical accuracy but presented in exciting way

Return JSON: [{"panel": 1, "scene": "detailed visual scene for AI image", "caption": "engaging text", "character": "who is speaking/narrating"}]

History text: ${paragraph}`;

    const scriptResult = await model.generateContent(scriptPrompt);
    const scriptText = scriptResult.response.text().replace(/```json|```/g, '');
    const panels = JSON.parse(scriptText);

    // 2️⃣ Generate AI images for each panel
    const imageModel = client.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const enhancedPanels = await Promise.all(panels.map(async (panel, index) => {
      // Create detailed image prompt for manga/anime style
      const imagePrompt = `Create a black and white manga/anime style illustration: ${panel.scene}. Historical setting, dramatic composition, detailed characters, cinematic angle, high contrast ink art style, professional manga artwork`;
      
      try {
        // Generate manga-style image URL
        const imageUrl = generateMangaImageUrl(panel.scene, panel.panel);
        
        // Insert into Supabase
        const { data, error } = await supabase
          .from('lessons')
          .insert({
            lesson_id: lessonId,
            panel_order: panel.panel,
            caption: panel.caption,
            image_url: imageUrl,
            scene_description: panel.scene,
            character: panel.character || 'Narrator'
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
          character: panel.character || 'Narrator'
        };
      }
    }));

    // Save new result to dataset for future examples
    await saveToDataset(lessonId, paragraph, enhancedPanels);
    
    res.json({ 
      success: true, 
      panels: enhancedPanels,
      message: `Created ${panels.length} manga panels for lesson ${lessonId}`
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}