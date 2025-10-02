import fetch from 'node-fetch';

const testText = "Napoleon Bonaparte was born in Corsica in 1769. He rose through the military ranks during the French Revolution and became Emperor of France in 1804.";

async function testAPI() {
  try {
    console.log('Testing API with text:', testText);
    
    const response = await fetch('http://localhost:3001/api/convert-manga', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        paragraph: testText,
        lessonId: 'test-lesson-001'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('\n✅ API Response:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testAPI();