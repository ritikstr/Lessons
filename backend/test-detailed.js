import fetch from 'node-fetch';

async function testDetailed() {
  try {
    const response = await fetch('http://localhost:3001/api/convert-manga', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        paragraph: "Napoleon was born in 1769.",
        lessonId: 'test-001'
      })
    });

    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', text);
    
    if (response.ok) {
      const result = JSON.parse(text);
      console.log('\n✅ Success! Generated panels:', result.panels?.length || 0);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDetailed();