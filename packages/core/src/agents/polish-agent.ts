/**
 * 润色代理
 */

import { getAgentDefinition } from './agent-registry';
import { AIClient } from '../ai/client';
import { NovelRepository } from '../database/repository';

export interface PolishAgentParams {
  text: string;
  style?: 'literary' | 'concise' | 'descriptive';
  chapterId?: string;
}

export interface PolishAgentResult {
  success: boolean;
  originalText?: string;
  polishedText?: string;
  changes?: string[];
  error?: string;
}

export class PolishAgent {
  private definition = getAgentDefinition('polish-agent');
  private aiClient: AIClient;
  private repository: NovelRepository;

  constructor(aiClient: AIClient, repository: NovelRepository) {
    this.aiClient = aiClient;
    this.repository = repository;
  }

  async polishText(params: PolishAgentParams): Promise<PolishAgentResult> {
    try {
      // 调用 AI 润色文本
      const polishedText = await this.aiClient.polishText(params.text);

      // 生成修改摘要
      const changes = this.detectChanges(params.text, polishedText);

      return {
        success: true,
        originalText: params.text,
        polishedText,
        changes
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async polishChapter(chapterId: string, style?: 'literary' | 'concise' | 'descriptive'): Promise<PolishAgentResult> {
    try {
      // 获取章节
      const chapter = this.repository.getChapter(chapterId);

      if (!chapter) {
        return {
          success: false,
          error: 'Chapter not found'
        };
      }

      // 润色章节内容
      const result = await this.polishText({
        text: chapter.content,
        style: style || 'literary',
        chapterId
      });

      if (result.success && result.polishedText) {
        // 更新章节
        this.repository.updateChapter(chapterId, {
          content: result.polishedText
        });
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private detectChanges(original: string, polished: string): string[] {
    const changes: string[] = [];

    // 简单的变化检测
    if (original.length !== polished.length) {
      changes.push(`字数变化: ${original.length} → ${polished.length}`);
    }

    // 检测句子结构变化
    const originalSentences = original.split(/[。！？]/);
    const polishedSentences = polished.split(/[。！？]/);

    if (originalSentences.length !== polishedSentences.length) {
      changes.push(`句子数量变化: ${originalSentences.length} → ${polishedSentences.length}`);
    }

    // 检测词汇丰富度
    const originalWords = new Set(original.split(/\s+/));
    const polishedWords = new Set(polished.split(/\s+/));

    if (polishedWords.size > originalWords.size) {
      changes.push(`词汇丰富度提升: +${polishedWords.size - originalWords.size} 个独特词汇`);
    }

    if (changes.length === 0) {
      changes.push('文本润色完成，无明显结构变化');
    }

    return changes;
  }
}