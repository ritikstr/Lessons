import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const models = [
  'gemini-1.5-flash',
  'gemini-1.5-pro', 
  'gemini-pro',
  'gemini-2.0-flash-exp',
  'gemini-exp-1206'
];

async function testModels() {
  console.log('Testing available models...\n');
  
  for (const model of models) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Hello" }] }]
        })
      });

      if (response.ok) {
        console.log(`✅ ${model} - WORKS`);
      } else {
        console.log(`❌ ${model} - ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${model} - ERROR`);
    }
  }
}

testModels();