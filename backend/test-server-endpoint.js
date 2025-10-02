import fetch from 'node-fetch';

async function testServerEndpoint() {
  try {
    console.log('Testing server endpoint...');
    
    const response = await fetch('http://localhost:3001/api/convert-manga', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        paragraph: "Test text",
        lessonId: 'test-123'
      })
    });

    console.log('Status:', response.status);
    const result = await response.text();
    console.log('Response:', result);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testServerEndpoint();