import dotenv from 'dotenv';
import { client } from './geminiClient.js';

dotenv.config();

async function testModels() {
  console.log('Testing different Gemini models...\n');
  
  const models = [
    'gemini-1.5-flash',
    'gemini-1.5-pro', 
    'gemini-pro',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-pro'
  ];
  
  for (const modelName of models) {
    try {
      console.log(`Testing: ${modelName}`);
      const model = client.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello");
      console.log(`✅ ${modelName} works: ${result.response.text()}\n`);
      break; // Stop at first working model
    } catch (error) {
      console.log(`❌ ${modelName} failed: ${error.message}\n`);
    }
  }
}

testModels();