import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

console.log('Environment check:');
console.log('GEMINI_KEY loaded:', !!process.env.GEMINI_KEY);
console.log('Key starts with:', process.env.GEMINI_KEY?.substring(0, 10));

// Test direct API call
async function testDirectAPI() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Say hello" }] }]
      })
    });

    console.log('API Response Status:', response.status);
    const result = await response.text();
    console.log('API Response:', result.substring(0, 200));
    
  } catch (error) {
    console.error('API Error:', error.message);
  }
}

testDirectAPI();