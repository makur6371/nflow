import { Command } from 'commander';
import { AIClient, initDatabase, NovelRepository } from '@nflow/core';

export const polishCommand = new Command('polish')
  .description('Polish novel prose')
  .option('-c, --chapter <number>', 'Chapter number to polish')
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

      // 获取要润色的章节
      let chapter;
      if (options.chapter) {
        chapter = repo.getChapterByOrderIndex(parseInt(options.chapter));
      } else {
        const chapters = repo.getAllChapters();
        if (chapters.length === 0) {
          console.log('\nNo chapters found. Use "nflow write" to create one.\n');
          return;
        }
        chapter = chapters[chapters.length - 1]; // 润色最后一章
      }

      if (!chapter) {
        console.log('\nChapter not found.\n');
        return;
      }

      console.log(`\n✨ Polishing chapter: ${chapter.title}\n`);

      // 润色内容
      const polishedContent = await aiClient.polishText(chapter.content);

      // 更新章节
      repo.updateChapter(chapter.id, {
        content: polishedContent
      });

      const originalCount = chapter.content.replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5]/g, '').length;
      const polishedCount = polishedContent.replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5]/g, '').length;

      console.log(`✓ Chapter polished: ${chapter.title}`);
      console.log(`  Original word count: ${originalCount}`);
      console.log(`  Polished word count: ${polishedCount}`);
      console.log();

    } catch (error) {
      console.error('Error polishing chapter:', error);
      process.exit(1);
    }
  });

function getAIClientConfig(): { apiKey: string; baseUrl: string; model: string } | null {
  const apiKey = process.env.IFLOW_API_KEY || process.env.NFLOW_API_KEY;
  const baseUrl = process.env.IFLOW_BASE_URL || 'https://apis.iflow.cn/v1';
  const model = process.env.IFLOW_MODEL || 'Qwen3-Coder';

  if (!apiKey) return null;
  return { apiKey, baseUrl, model };
}