import fetch from 'node-fetch';

async function testSimple() {
  try {
    const response = await fetch('http://localhost:3001/api/convert-manga-simple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        paragraph: "Napoleon was born in Corsica in 1769. He became Emperor of France.",
        lessonId: 'test-simple'
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS!');
      console.log('Panels:', result.panels.length);
      result.panels.forEach((p, i) => {
        console.log(`Panel ${i+1}: ${p.caption}`);
      });
    } else {
      console.log('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSimple();