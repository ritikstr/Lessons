import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testGemini() {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key exists:', !!process.env.GEMINI_KEY);
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    
    // Try working model names
    const modelNames = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];
    
    for (const modelName of modelNames) {
      try {
        console.log(`\nTrying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ ${modelName} works!`);
        console.log('Response:', text);
        break;
      } catch (err) {
        console.log(`❌ ${modelName} failed:`, err.message);
      }
    }
  } catch (error) {
    console.log('❌ General error:', error.message);
  }
}

testGemini();