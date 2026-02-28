import { Command } from 'commander';
import * as readline from 'readline';
import { AIClient, initDatabase, NovelRepository } from '@nflow/core';

export const outlineCommand = new Command('outline')
  .description('Generate novel outline')
  .option('-g, --genre <genre>', 'Genre (e.g., 玄幻, 科幻, 都市)')
  .option('-t, --theme <theme>', 'Theme')
  .option('-c, --chapters <count>', 'Number of chapters', '10')
  .action(async (options) => {
    try {
      // 初始化数据库
      await initDatabase('novel-data.json');
      const repo = new NovelRepository();

      // 获取 AI 客户端配置
      const config = getAIClientConfig();
      if (!config) {
        console.error('Error: AI client not configured. Please set ILOW_API_KEY environment variable.');
        console.log('\nSetup iflow authentication:');
        console.log('1. Get your API key from https://iflow.cn');
        console.log('2. Set environment variable: set ILOW_API_KEY=your-key');
        process.exit(1);
      }

      const aiClient = new AIClient(config);

      // 询问小说描述
      const description = await askQuestion('请描述你的小说创意：');

      console.log('\n📝 Generating outline...\n');

      // 生成大纲
      const outline = await aiClient.generateOutline({
        genre: options.genre,
        theme: options.theme,
        chapterCount: parseInt(options.chapters),
        description
      });

      console.log(`📖 Title: ${outline.title}`);
      console.log(`📄 Summary: ${outline.summary}\n`);
      console.log('📚 Chapters:');
      outline.chapters.forEach((chapter: any) => {
        console.log(`  ${chapter.number}. ${chapter.title}`);
        console.log(`     ${chapter.summary}`);
      });

      // 保存到数据库
      const projectMetadata = repo.getProjectMetadata();
      console.log(`\n✓ Outline saved to project: ${projectMetadata.projectName}\n`);

    } catch (error) {
      console.error('Error generating outline:', error);
      process.exit(1);
    }
  });

function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function getAIClientConfig(): { apiKey: string; baseUrl: string; model: string } | null {
  const apiKey = process.env.IFLOW_API_KEY || process.env.NFLOW_API_KEY;
  const baseUrl = process.env.IFLOW_BASE_URL || 'https://apis.iflow.cn/v1';
  const model = process.env.IFLOW_MODEL || 'Qwen3-Coder';

  if (!apiKey) return null;
  return { apiKey, baseUrl, model };
}