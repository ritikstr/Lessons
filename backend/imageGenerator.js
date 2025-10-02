import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); 

// Removed the placeholder-only function. The primary function will now handle
// the actual AI image generation.

/**
 * Generates an image using the Imagen model in black and white manga style.
 *
 * NOTE: The function name is set to 'generateMangaImageUrl' to match the 
 * function call in the main 'convertManga' file.
 * * @param {string} scene - The scene description to use as the base for the prompt.
 * @returns {Promise<string|null>} The image data URL (base64) or null on failure.
 */
// Generate a simple base64 placeholder image
function generatePlaceholderImage(text) {
    // Create a simple SVG placeholder
    const svg = `
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
            <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#666" text-anchor="middle" dy=".3em">${text}</text>
        </svg>
    `;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export async function generateMangaImageUrl(scene) {
    const imagePrompt = `Black and white manga style illustration: ${scene}. Detailed ink art, dramatic composition, historical setting, anime character design, high contrast, clean lines, professional manga artwork, no text, no captions.`;
    
    console.log('Generating image for scene:', scene.substring(0, 50) + '...');

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${process.env.GEMINI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Generate an image: ${imagePrompt}`
                    }]
                }]
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Image API Response:', data);
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                const imagePart = data.candidates[0].content.parts.find(part => part.inlineData);
                if (imagePart && imagePart.inlineData) {
                    console.log('✅ Image generated successfully');
                    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
                }
            }
        } else {
            const errorText = await response.text();
            console.error('❌ Image API Error:', response.status, errorText);
        }

        console.log('Using placeholder image');
        return generatePlaceholderImage('Manga Panel');
    } catch (error) {
        console.error('❌ Error generating image:', error.message);
        return generatePlaceholderImage('Image Failed');
    }
}