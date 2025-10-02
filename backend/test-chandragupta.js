import fetch from 'node-fetch';

const chandraguptaText = `Early life
The story of Chandragupta's early life and rise to power is of great interest. According to Buddhist traditions, Chandragupta's father was the chief of Pippalivana, lying between the modern Terai region in Nepal and Gorakhpur, UP. He was defeated and killed in a battle with the ruler of the neighbouring kingdom. This had reduced Chandragupta's mother to a state of poverty. She was compelled to seek shelter in Pataliputra. A cowherd of a nearby village adopted him. Here Kautilya (a brahman who had promised to destroy the Nanda dynasty) found him.`;

async function testChandragupta() {
  try {
    console.log('Testing with Chandragupta text...\n');
    
    const response = await fetch('http://localhost:3001/api/convert-manga', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        paragraph: chandraguptaText,
        lessonId: 'chandragupta-early-life'
      })
    });

    const result = await response.text();
    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = JSON.parse(result);
      console.log('\n✅ SUCCESS! Generated', data.panels?.length, 'panels:');
      data.panels?.forEach((panel, i) => {
        console.log(`\nPanel ${i + 1}:`);
        console.log('Character:', panel.character);
        console.log('Caption:', panel.caption);
        console.log('Scene:', panel.scene_description);
      });
    } else {
      console.log('❌ Error Response:', result);
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testChandragupta();