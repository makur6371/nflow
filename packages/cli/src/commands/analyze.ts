import { Command } from 'commander';
import { initDatabase, NovelRepository } from '@nflow/core';

export const analyzeCommand = new Command('analyze')
  .description('Analyze existing novels or content')
  .option('-f, --file <path>', 'Analyze a novel file')
  .option('-c, --chapter <id>', 'Analyze a specific chapter')
  .option('--structure', 'Analyze story structure')
  .option('--characters', 'Analyze character relationships')
  .option('--outline', 'Generate outline from content')
  .action(async (options) => {
    try {
      await initDatabase('novel-data.json');
      const repository = new NovelRepository();

      if (options.file) {
        analyzeFile(options.file, options);
      } else if (options.chapter) {
        analyzeChapter(repository, options.chapter, options);
      } else {
        console.log('\n📚 Content Analysis\n');
        console.log('Usage: nflow analyze [options]\n');
        console.log('Options:');
        console.log('  -f, --file <path>      Analyze a novel file');
        console.log('  -c, --chapter <id>     Analyze a specific chapter');
        console.log('  --structure            Analyze story structure');
        console.log('  --characters           Analyze character relationships');
        console.log('  --outline              Generate outline from content\n');
        console.log('Examples:');
        console.log('  nflow analyze --file novel.txt');
        console.log('  nflow analyze --chapter 1 --structure');
        console.log('  nflow analyze --chapter 1 --characters\n');
      }
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

function analyzeFile(filePath: string, options: any): void {
  const fs = require('fs');
  
  if (!fs.existsSync(filePath)) {
    console.log(`\n❌ File not found: ${filePath}\n`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const wordCount = content.replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5]/g, '').length;

  console.log(`\n📚 Analyzing: ${filePath}\n`);
  console.log(`${'='.repeat(50)}\n`);
  console.log(`File Size: ${fs.statSync(filePath).size} bytes`);
  console.log(`Word Count: ${wordCount}`);
  console.log(`Estimated Reading Time: ${Math.ceil(wordCount / 400)} minutes\n`);

  // 简单的内容分析
  const paragraphs = content.split('\n\n');
  console.log(`Paragraphs: ${paragraphs.length}`);
  console.log(`Avg Words/Paragraph: ${Math.round(wordCount / paragraphs.length)}\n`);

  // 字符频率分析
  const charCount: Record<string, number> = {};
  for (const char of content) {
    if (char.trim() && /[\u4e00-\u9fa5]/.test(char)) {
      charCount[char] = (charCount[char] || 0) + 1;
    }
  }

  const topChars = Object.entries(charCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  console.log('Top 10 Most Frequent Characters:');
  topChars.forEach(([char, count]) => {
    console.log(`  ${char}: ${count} times`);
  });

  console.log(`\n${'='.repeat(50)}\n`);
}

function analyzeChapter(repository: NovelRepository, chapterId: string, options: any): void {
  const chapter = repository.getChapter(chapterId);
  
  if (!chapter) {
    console.log(`\n❌ Chapter ${chapterId} not found.\n`);
    return;
  }

  console.log(`\n📖 Analyzing Chapter: ${chapter.title}\n`);
  console.log(`${'='.repeat(50)}\n`);
  console.log(`Order: ${chapter.orderIndex}`);
  console.log(`Word Count: ${chapter.wordCount}`);
  console.log(`Status: ${chapter.status}`);
  console.log(`Summary: ${chapter.summary}\n`);

  if (options.structure) {
    console.log('📐 Structure Analysis:\n');
    analyzeStructure(chapter.content);
  }

  if (options.characters) {
    console.log('👥 Character Analysis:\n');
    analyzeCharacters(chapter.content, repository);
  }

  if (options.outline) {
    console.log('📋 Generated Outline:\n');
    generateOutline(chapter.content);
  }

  console.log(`${'='.repeat(50)}\n`);
}

function analyzeStructure(content: string): void {
  const paragraphs = content.split('\n\n');
  const sentences = content.split(/[。！？]/);
  
  console.log(`Paragraphs: ${paragraphs.length}`);
  console.log(`Sentences: ${sentences.length}`);
  console.log(`Avg Words/Sentence: ${Math.round(content.length / sentences.length)}`);

  // 简单的三幕式分析
  const oneThird = Math.floor(paragraphs.length / 3);
  console.log('\nStructure Distribution:');
  console.log(`  First Act (0-${oneThird}): ${oneThird} paragraphs`);
  console.log(`  Second Act (${oneThird}-${oneThird * 2}): ${oneThird} paragraphs`);
  console.log(`  Third Act (${oneThird * 2}-${paragraphs.length}): ${paragraphs.length - oneThird * 2} paragraphs\n`);
}

function analyzeCharacters(content: string, repository: NovelRepository): void {
  const characters = repository.getAllCharacters();
  const mentionedCharacters = characters.filter(char => 
    content.includes(char.name)
  );

  console.log(`Total Characters in Database: ${characters.length}`);
  console.log(`Mentioned in Chapter: ${mentionedCharacters.length}\n`);

  if (mentionedCharacters.length > 0) {
    mentionedCharacters.forEach(char => {
      const mentions = (content.match(new RegExp(char.name, 'g')) || []).length;
      console.log(`  • ${char.name}: ${mentions} mentions [${char.role}]`);
    });
    console.log();
  }
}

function generateOutline(content: string): void {
  const paragraphs = content.split('\n\n');
  
  console.log('Chapter Outline:');
  paragraphs.forEach((para, index) => {
    const preview = para.substring(0, 50);
    console.log(`  ${index + 1}. ${preview}${para.length > 50 ? '...' : ''}`);
  });
  console.log();
}