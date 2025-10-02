// Simple image URL generator for manga-style placeholders
export function generateMangaImageUrl(scene, panelNumber) {
  // Create a more detailed placeholder that represents the scene
  const cleanScene = scene.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 100);
  const encodedScene = encodeURIComponent(cleanScene);
  
  // Use different placeholder services for variety
  const services = [
    `https://via.placeholder.com/800x600/1a1a1a/ffffff?text=Panel+${panelNumber}%0A${encodedScene}`,
    `https://dummyimage.com/800x600/000/fff&text=Panel+${panelNumber}+${encodedScene}`,
    `https://via.placeholder.com/800x600/2c2c2c/white?text=Manga+Panel+${panelNumber}%0A${encodedScene}`
  ];
  
  return services[panelNumber % services.length];
}

// Future: Add real AI image generation here
export async function generateRealMangaImage(scene, style = 'manga') {
  // This would integrate with services like:
  // - Stability AI
  // - DALL-E API  
  // - Midjourney API
  // - Local Stable Diffusion
  
  const prompt = `Black and white manga style illustration: ${scene}. Detailed ink art, dramatic composition, historical setting, anime character design, high contrast`;
  
  // For now, return enhanced placeholder
  return generateMangaImageUrl(scene, Math.floor(Math.random() * 3) + 1);
}