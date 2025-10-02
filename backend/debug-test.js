import dotenv from 'dotenv';
import { client } from './geminiClient.js';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

async function testSetup() {
  console.log('🔍 Testing Anime Lessons Setup...\n');
  
  // 1. Check environment variables
  console.log('1. Environment Variables:');
  console.log('   GEMINI_KEY:', process.env.GEMINI_KEY ? '✅ Set' : '❌ Missing');
  console.log('   SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('   SUPABASE_KEY:', process.env.SUPABASE_KEY ? '✅ Set' : '❌ Missing');
  
  // 2. Test Gemini API
  console.log('\n2. Testing Gemini API:');
  try {
    const model = client.getGenerativeModel({ model: "models/gemini-2.0-flash" });
    const result = await model.generateContent("Say 'Hello from Gemini!'");
    console.log('   ✅ Gemini API working:', result.response.text());
  } catch (error) {
    console.log('   ❌ Gemini API error:', error.message);
  }
  
  // 3. Check dataset.json
  console.log('\n3. Testing dataset.json:');
  try {
    const datasetPath = path.join(process.cwd(), '..', 'dataset.json');
    const data = await fs.readFile(datasetPath, 'utf8');
    const dataset = JSON.parse(data);
    console.log(`   ✅ Dataset loaded: ${dataset.length} examples`);
  } catch (error) {
    console.log('   ❌ Dataset error:', error.message);
  }
  
  // 4. Test manga conversion
  console.log('\n4. Testing manga conversion:');
  try {
    const model = client.getGenerativeModel({ model: "models/gemini-2.0-flash" });
    const testPrompt = `Convert this into 2 manga panels: "The Roman Empire was vast and powerful."
    Return JSON: [{"panel": 1, "scene": "scene description", "caption": "text", "character": "narrator"}]`;
    
    const result = await model.generateContent(testPrompt);
    const text = result.response.text().replace(/```json|```/g, '');
    const panels = JSON.parse(text);
    console.log('   ✅ Manga conversion working:', panels.length, 'panels generated');
  } catch (error) {
    console.log('   ❌ Manga conversion error:', error.message);
  }
}

testSetup();