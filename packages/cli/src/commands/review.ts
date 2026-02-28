import { Command } from 'commander';
import { AIClient, initDatabase, NovelRepository } from '@nflow/core';

export const reviewCommand = new Command('review')
  .description('Review novel content')
  .option('-c, --chapter <number>', 'Chapter number to review')
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

      // 获取要审核的章节
      let chapter;
      if (options.chapter) {
        chapter = repo.getChapterByOrderIndex(parseInt(options.chapter));
      } else {
        const chapters = repo.getAllChapters();
        if (chapters.length === 0) {
          console.log('\nNo chapters found. Use "nflow write" to create one.\n');
          return;
        }
        chapter = chapters[chapters.length - 1]; // 审核最后一章
      }

      if (!chapter) {
        console.log('\nChapter not found.\n');
        return;
      }

      console.log(`\n🔍 Reviewing chapter: ${chapter.title}\n`);

      // 审核内容
      const review = await aiClient.reviewContent(chapter.content);

      console.log(`📊 Quality Score: ${review.score}/100\n`);
      console.log('Dimensions:');
      console.log(`  • 人物一致性: ${review.dimensions.characterConsistency}/100`);
      console.log(`  • 情节逻辑: ${review.dimensions.plotLogic}/100`);
      console.log(`  • 世界观设定: ${review.dimensions.worldSetting}/100`);
      console.log(`  • 时间线: ${review.dimensions.timeline}/100`);
      console.log(`  • 伏笔呼应: ${review.dimensions.foreshadowing}/100`);

      if (review.issues.length > 0) {
        console.log('\n⚠️  Issues found:');
        review.issues.forEach((issue, index) => {
          const icon = issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🟢';
          console.log(`  ${icon} ${index + 1}. [${issue.type}] ${issue.description}`);
        });
      } else {
        console.log('\n✓ No issues found!');
      }

      console.log();

      // 根据分数给出建议
      if (review.score >= 90) {
        console.log('🎉 Excellent! Ready for publication.');
      } else if (review.score >= 80) {
        console.log('✓ Good quality. Can continue writing.');
      } else if (review.score >= 70) {
        console.log('⚠️  Fair quality. Consider polishing.');
      } else {
        console.log('❌ Needs improvement. Consider revising.');
      }
      console.log();

    } catch (error) {
      console.error('Error reviewing chapter:', error);
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