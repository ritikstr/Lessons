import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import { generateMangaImageUrl } from '../imageGenerator.js';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Helper function to load examples from dataset.json.
 * @returns {Promise<Array>} A list of 2-3 random examples.
 */
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

/**
 * Helper function to save a new result to dataset.json.
 * @param {string} chapter - The lesson ID/chapter identifier.
 * @param {string} paragraph - The original history text.
 * @param {Array} panels - The generated panels data.
 */
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

/**
 * Express handler to convert history text into illustrated manga panels.
 * This is the main refactored function.
 */
export async function convertManga(req, res) {
    try {
        const { paragraph, lessonId } = req.body;

        // --- 1️⃣ Generate manga panels using the imported Gemini client (SDK) ---
        const prompt = `Convert this history text into 4 manga panels. Return JSON only:

History: "${paragraph}"

Format: [{"panel": 1, "scene": "manga scene description", "caption": "dialogue text", "character": "character name"}]`;

        // Using direct fetch API call
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        // The SDK's JSON mode is highly reliable, but a quick clean is a good fallback
        const cleanText = text.replace(/```json|```/g, '').trim(); 
        let panels;
        try {
            panels = JSON.parse(cleanText);
            // Basic validation check
            if (!Array.isArray(panels) || panels.length === 0) {
                throw new Error("AI returned empty or invalid panel array.");
            }
        } catch (e) {
            console.error('Failed to parse JSON from Gemini:', cleanText);
            throw new Error('Failed to generate valid manga panel structure from AI.');
        }


        // --- 2️⃣ Generate AI images and save to Supabase ---
        
        const enhancedPanels = await Promise.all(panels.map(async (panel, index) => {
            // Detailed image prompt for the style
            const imagePrompt = `Manga style black and white illustration: ${panel.scene}. Historical setting, dramatic composition, detailed characters, cinematic angle, high contrast ink art style, professional manga artwork, no text, no captions.`;
            
            let imageUrl = `https://via.placeholder.com/800x600?text=Panel+${panel.panel}`;
            
            try {
                // Use the imported helper function which should wrap the Image API
                const generatedUrl = await generateMangaImageUrl(imagePrompt); 
                
                if (generatedUrl) {
                    imageUrl = generatedUrl;
                } else {
                    throw new Error("Image generation failed to return a URL.");
                }

            } catch (err) {
                console.warn(`Could not generate image for panel ${index + 1}: ${err.message}. Using placeholder.`, err);
            }
            
            // Insert into Supabase
            try {
                const { data, error } = await supabase
                    .from('lessons')
                    .insert({
                        lesson_id: lessonId,
                        panel_order: panel.panel,
                        image_url: imageUrl,
                        scene_description: panel.scene
                    })
                    .select();

                if (error) throw error;
                return data[0];
            } catch (err) {
                console.error(`Error saving panel data to Supabase for panel ${index + 1}:`, err);
                // Return a structured object even if Supabase insert fails
                 return {
                    panel_order: panel.panel,
                    image_url: imageUrl,
                    scene_description: panel.scene,
                    caption: panel.caption,
                    character: panel.character || 'Narrator'
                };
            }
        }));

        // Save new result to dataset for future examples
        await saveToDataset(lessonId, paragraph, enhancedPanels);
        
        res.json({ 
            success: true, 
            panels: enhancedPanels,
            message: `Created ${enhancedPanels.length} manga panels for lesson ${lessonId}`
        });

    } catch (error) {
        console.error('Conversion Error:', error);
        
        // General error response suggests checking the key setup for the client
        res.status(500).json({ 
            error: 'An internal server error occurred during manga conversion.',
            details: error.message,
            suggestion: "If this persists, check that your **GEMINI_KEY** in the `.env` file is correct and accessible by the imported **`client`** object."
        });
    }
}