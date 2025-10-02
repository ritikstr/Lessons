import fetch from 'node-fetch';

async function testBasic() {
  try {
    const response = await fetch('http://localhost:3001/');
    const result = await response.json();
    console.log('✅ Server is running:', result);
  } catch (error) {
    console.error('❌ Server error:', error.message);
  }
}

testBasic();