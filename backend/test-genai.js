import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function testGenAI() {
  try {
    const client = new GoogleGenAI(process.env.GEMINI_KEY);
    console.log('Client methods:', Object.getOwnPropertyNames(client));
    console.log('Client prototype:', Object.getOwnPropertyNames(Object.getPrototypeOf(client)));
    
    // Try different method names
    if (client.generateContent) {
      console.log('Has generateContent method');
    }
    if (client.generateText) {
      console.log('Has generateText method');
    }
    if (client.models) {
      console.log('Has models property');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGenAI();