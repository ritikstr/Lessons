import { client } from './geminiClient.js';
import dotenv from 'dotenv';

dotenv.config();

async function testConvert() {
  try {
    const model = client.getGenerativeModel({ model: "models/gemini-2.0-flash" });
    
    const prompt = `Convert this history text into an engaging 4-6 panel manga story. Return JSON: [{"panel": 1, "scene": "detailed visual scene", "caption": "engaging text", "character": "who is speaking"}]

History text: The Mauryan Dynasty marked a new era in the history of India. Chandragupta Maurya rose from poverty to establish the first empire.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    console.log('✅ Gemini Response:');
    console.log(text);
    
    const cleaned = text.replace(/```json|```/g, '');
    const panels = JSON.parse(cleaned);
    
    console.log('✅ Parsed Panels:');
    console.log(JSON.stringify(panels, null, 2));
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testConvert();