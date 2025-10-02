import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

async function verifyKey() {
  const apiKey = process.env.GEMINI_KEY;
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API Key is valid!');
      console.log('Available models:');
      data.models?.forEach(model => {
        console.log(`- ${model.name}`);
      });
    } else {
      console.log('❌ API Key failed:');
      console.log(data);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

verifyKey();