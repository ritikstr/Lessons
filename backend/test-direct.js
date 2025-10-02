import { client } from './geminiClient.js';
import dotenv from 'dotenv';

dotenv.config();

async function testDirect() {
  try {
    console.log('Testing Gemini client directly...');
    console.log('API Key exists:', !!process.env.GEMINI_KEY);
    
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Say hello");
    
    console.log('✅ Direct test successful:', result.response.text());
  } catch (error) {
    console.error('❌ Direct test failed:', error.message);
  }
}

testDirect();