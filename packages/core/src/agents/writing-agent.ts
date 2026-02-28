/**
 * 写作代理
 */

import { getAgentDefinition } from './agent-registry';
import { AIClient } from '../ai/client';
import { NovelRepository } from '../database/repository';
import { PreWritingContext } from '../core/triple-review';
import { AutoFixer } from '../core/auto-fixer';

export interface WritingAgentParams {
  title: string;
  summary: string;
  orderIndex: number;
  targetWordCount?: number;
}

export interface WritingAgentResult {
  success: boolean;
  chapter?: any;
  content?: string;
  wordCount?: number;
  error?: string;
}

export class WritingAgent {
  private definition = getAgentDefinition('writing-agent');
  private aiClient: AIClient;
  private repository: NovelRepository;
  private preWritingContext: PreWritingContext;
  private autoFixer: AutoFixer;

  constructor(aiClient: AIClient, repository: NovelRepository) {
    this.aiClient = aiClient;
    this.repository = repository;
    this.preWritingContext = new PreWritingContext(repository);
    this.autoFixer = new AutoFixer(repository, aiClient);
  }

  async writeChapter(params: WritingAgentParams): Promise<WritingAgentResult> {
    try {
      const targetWordCount = params.targetWordCount || 2200;

      // 1. 注入完整上下文（写作前审查）
      const fullContext = await this.preWritingContext.injectFullContext(params.orderIndex);
      const contextText = this.buildContextString(fullContext);

      // 2. 调用 AI 生成内容
      const content = await this.aiClient.writeChapter({
        title: params.title,
        summary: params.summary,
        context: contextText,
        targetWordCount
      });

      // 3. 计算字数
      const wordCount = content.replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5]/g, '').length;

      // 4. 检查字数并自动调整
      let finalContent = content;
      if (Math.abs(wordCount - targetWordCount) > 100) {
        if (wordCount < targetWordCount) {
          finalContent = await this.aiClient.expandContent(content, targetWordCount);
        } else {
          finalContent = await this.aiClient.compressContent(content, targetWordCount);
        }
      }

      // 5. 保存到数据库
      const chapter = this.repository.saveChapter({
        title: params.title,
        orderIndex: params.orderIndex,
        summary: params.summary,
        content: finalContent,
        status: 'completed'
      });

      const finalWordCount = finalContent.replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5]/g, '').length;

      return {
        success: true,
        chapter,
        content: finalContent,
        wordCount: finalWordCount
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private buildContextString(fullContext: any): string {
    return `
大纲: ${fullContext.fullOutline}
人物: ${fullContext.characterProfiles}
世界观: ${fullContext.worldSettings}
已完成章节: ${fullContext.completedChaptersSummary}
`.trim();
  }

  async writeChapterWithQualityControl(params: WritingAgentParams): Promise<WritingAgentResult> {
    try {
      // 先写入章节
      const result = await this.writeChapter(params);

      if (!result.success || !result.chapter) {
        return result;
      }

      // 获取章节并检查质量
      const chapter = result.chapter;
      const review = await this.aiClient.reviewContent(chapter.content);

      // 如果分数过低，使用自动修复
      if (review.score < 70) {
        console.log(`Chapter quality score: ${review.score}, applying auto-fix...`);

        const context = await this.preWritingContext.injectFullContext(chapter.orderIndex);

        // 转换为 Issue 格式
        const issues = review.issues.map(issue => ({
          type: issue.type,
          description: issue.description,
          severity: issue.severity
        }));

        const fixResult = await this.autoFixer.autoFix(chapter.content, issues, context);
        chapter.content = fixResult.content;

        // 更新章节
        this.repository.updateChapter(chapter.id, { content: chapter.content });
      }

      return {
        success: true,
        chapter,
        content: chapter.content,
        wordCount: result.wordCount
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}