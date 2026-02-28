import { Command } from 'commander';
import * as readline from 'readline';
import { AIClient, initDatabase, NovelRepository } from '@nflow/core';

export const writeCommand = new Command('write')
  .description('Write novel chapters')
  .option('-t, --title <title>', 'Chapter title')
  .option('-o, --order <number>', 'Chapter order number')
  .action(async (options) => {
    try {
      await initDatabase('novel-data.json');
      const repo = new NovelRepository();

      // 获取 AI 客户端配置
      const config = getAIClientConfig();
      if (!config) {
        console.error('Error: AI client not configured. Please set ILOW_API_KEY environment variable.');
        process.exit(1);
      }

      const aiClient = new AIClient(config);

      // 询问章节信息
      const title = options.title || await askQuestion('章节标题：');
      const order = options.order ? parseInt(options.order) : repo.getAllChapters().length + 1;
      const summary = await askQuestion('章节摘要：');

      console.log('\n✍️  Writing chapter...\n');

      // 生成上下文信息
      const context = buildContext(repo);

      // 写作章节
      const content = await aiClient.writeChapter({
        title,
        summary,
        context,
        targetWordCount: 2200
      });

      // 保存到数据库
      const chapter = repo.saveChapter({
        title,
        orderIndex: order,
        summary,
        content,
        status: 'completed'
      });

      const wordCount = content.replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5]/g, '').length;

      console.log(`✓ Chapter written: ${chapter.title}`);
      console.log(`  Order: ${chapter.orderIndex}`);
      console.log(`  Word count: ${wordCount}`);
      console.log(`  Status: ${chapter.status}`);
      console.log();

    } catch (error) {
      console.error('Error writing chapter:', error);
      process.exit(1);
    }
  });

function buildContext(repo: NovelRepository): string {
  const chapters = repo.getAllChapters();
  const characters = repo.getAllCharacters();
  const worldSettings = repo.getAllWorldSettings();

  let context = '';

  if (chapters.length > 0) {
    context += '已完成章节：\n';
    chapters.forEach((ch: any) => {
      context += `第${ch.orderIndex}章：${ch.title} - ${ch.summary}\n`;
    });
    context += '\n';
  }

  if (characters.length > 0) {
    context += '主要人物：\n';
    characters.forEach((char: any) => {
      context += `${char.name}（${char.role}）：${char.personality}\n`;
    });
    context += '\n';
  }

  if (worldSettings.length > 0) {
    context += '世界观设定：\n';
    worldSettings.forEach((setting: any) => {
      context += `${setting.category} - ${setting.key}: ${setting.value}\n`;
    });
    context += '\n';
  }

  return context || '这是一个新的开始。';
}

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