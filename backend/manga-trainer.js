import fs from 'fs/promises';

class MangaTrainer {
  constructor() {
    this.patterns = [];
    this.loadPatterns();
  }

  async loadPatterns() {
    try {
      const data = await fs.readFile('../dataset.json', 'utf8');
      const dataset = JSON.parse(data);
      
      // Extract patterns from successful conversions
      this.patterns = dataset.map(item => ({
        keywords: this.extractKeywords(item.paragraph),
        structure: this.analyzeStructure(item.panels),
        style: this.extractStyle(item.panels)
      }));
    } catch (error) {
      console.error('Error loading patterns:', error);
    }
  }

  extractKeywords(text) {
    // Extract historical names, places, events
    const keywords = text.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g) || [];
    return keywords.filter(k => k.length > 3);
  }

  analyzeStructure(panels) {
    return {
      panelCount: panels.length,
      hasCharacterIntro: panels[0].includes('young') || panels[0].includes('born'),
      hasConflict: panels.some(p => p.includes('battle') || p.includes('war')),
      hasResolution: panels[panels.length - 1].includes('became') || panels[panels.length - 1].includes('established')
    };
  }

  extractStyle(panels) {
    return {
      visualElements: panels.filter(p => p.includes('scene') || p.includes('showing')).length,
      dramaticWords: panels.join(' ').match(/dramatic|epic|fierce|powerful|wise/gi)?.length || 0
    };
  }

  generateMangaPanels(text) {
    const keywords = this.extractKeywords(text);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    
    return sentences.slice(0, 4).map((sentence, i) => {
      const mainKeyword = keywords[i] || 'character';
      return {
        panel: i + 1,
        scene: this.createScene(sentence, mainKeyword),
        caption: this.createCaption(sentence),
        character: this.identifyCharacter(sentence, keywords)
      };
    });
  }

  createScene(sentence, keyword) {
    const sceneTemplates = [
      `Dramatic manga scene showing ${keyword} in ${this.extractContext(sentence)}`,
      `Close-up of ${keyword} with intense expression during ${this.extractAction(sentence)}`,
      `Wide shot of ${this.extractLocation(sentence)} with ${keyword} in the center`,
      `Action sequence of ${this.extractAction(sentence)} with dynamic angles`
    ];
    
    return sceneTemplates[Math.floor(Math.random() * sceneTemplates.length)];
  }

  createCaption(sentence) {
    // Simplify and dramatize the sentence
    return sentence.trim().substring(0, 60) + '...';
  }

  identifyCharacter(sentence, keywords) {
    const character = keywords.find(k => sentence.includes(k));
    return character || 'Narrator';
  }

  extractContext(sentence) {
    const contexts = ['ancient times', 'battlefield', 'royal court', 'village', 'palace'];
    return contexts[Math.floor(Math.random() * contexts.length)];
  }

  extractAction(sentence) {
    if (sentence.includes('battle')) return 'fierce battle';
    if (sentence.includes('born')) return 'birth';
    if (sentence.includes('defeated')) return 'victory';
    return 'important moment';
  }

  extractLocation(sentence) {
    const locations = sentence.match(/[A-Z][a-z]+(?:pur|bad|ganj|abad)/g);
    return locations?.[0] || 'ancient city';
  }
}

export { MangaTrainer };