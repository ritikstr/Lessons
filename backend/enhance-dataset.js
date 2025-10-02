import fs from 'fs/promises';

// Add more training examples
const newExamples = [
  {
    "chapter": "Chandragupta Maurya",
    "paragraph": "Chandragupta's father was killed in battle, leaving his mother in poverty. She fled to Pataliputra where a cowherd adopted the young prince. Here, the wise Kautilya discovered him.",
    "panels": [
      "A fierce battle scene with Chandragupta's father, the chief of Pippalivana, falling to enemy swords",
      "Chandragupta's mother, tears in her eyes, carrying baby Chandragupta through dusty roads toward Pataliputra",
      "A kind cowherd finding the mother and child, offering them shelter in his humble village home",
      "Kautilya, the wise brahman, recognizing something special in young Chandragupta's eyes"
    ]
  },
  {
    "chapter": "Alexander's Invasion",
    "paragraph": "Alexander crossed the Indus in 326 BCE and defeated King Porus at the Battle of Hydaspes. However, his soldiers refused to march further east.",
    "panels": [
      "Alexander's massive army crossing the rushing waters of the Indus River on boats and rafts",
      "The epic clash between Alexander's cavalry and King Porus riding his war elephant",
      "Alexander's exhausted soldiers sitting around campfires, shaking their heads in refusal",
      "Alexander looking eastward with frustration as his dream of conquering India fades"
    ]
  }
];

async function enhanceDataset() {
  try {
    const data = await fs.readFile('../dataset.json', 'utf8');
    const dataset = JSON.parse(data);
    
    dataset.push(...newExamples);
    
    await fs.writeFile('../dataset.json', JSON.stringify(dataset, null, 2));
    console.log('✅ Dataset enhanced with', newExamples.length, 'new examples');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

enhanceDataset();