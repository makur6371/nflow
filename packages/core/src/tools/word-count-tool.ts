/**
 * 字数控制工具
 */

import { BaseTool, ToolParams, ToolResult } from './base-tool';

export interface WordCountParams extends ToolParams {
  content?: string;
  action: 'check' | 'expand' | 'compress' | 'report';
  targetWordCount?: number;
}

export interface WordCountResult extends ToolResult {
  currentCount?: number;
  targetCount?: number;
  status?: 'insufficient' | 'optimal' | 'excess';
  shortage?: number;
  excess?: number;
  adjustedContent?: string;
  report?: {
    totalChapters: number;
    totalWords: number;
    averageWords: number;
   达标率: number;
  };
}

export class WordCountTool extends BaseTool<WordCountParams, WordCountResult> {
  // 字数配置（基于番茄小说平台要求）
  private config = {
    target: 2200,      // 目标字数
    min: 2000,         // 最小字数
    max: 2400,         // 最大字数（自动修复阈值）
    absoluteMax: 3000  // 绝对最大字数
  };

  constructor() {
    super(
      'word-count-tool',
      'Word Count Controller',
      'Control and manage chapter word count',
      '📏'
    );
  }

  async execute(params: WordCountParams): Promise<WordCountResult> {
    try {
      switch (params.action) {
        case 'check':
          return this.checkWordCount(params.content || '');
        case 'expand':
          return this.expandContent(params.content || '', params.targetWordCount);
        case 'compress':
          return this.compressContent(params.content || '', params.targetWordCount);
        case 'report':
          return this.generateReport();
        default:
          return this.failure('Invalid action');
      }
    } catch (error) {
      return this.failure(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * 统计字数
   */
  private countWords(text: string): number {
    // 统计中文字符（不包括空格和标点）
    return text.replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5]/g, '').length;
  }

  /**
   * 检查字数
   */
  private async checkWordCount(content: string): Promise<WordCountResult> {
    const count = this.countWords(content);

    if (count < this.config.min) {
      return this.success({
        currentCount: count,
        targetCount: this.config.target,
        status: 'insufficient',
        shortage: this.config.min - count
      });
    } else if (count > this.config.max) {
      return this.success({
        currentCount: count,
        targetCount: this.config.target,
        status: 'excess',
        excess: count - this.config.max
      });
    } else {
      return this.success({
        currentCount: count,
        targetCount: this.config.target,
        status: 'optimal'
      });
    }
  }

  /**
   * 扩展内容
   */
  private async expandContent(content: string, target?: number): Promise<WordCountResult> {
    const current = this.countWords(content);
    const targetCount = target || this.config.target;
    const needed = targetCount - current;

    if (needed <= 0) {
      return this.success({ currentCount: current, status: 'optimal' });
    }

    // 导入 AI 客户端
    const { AIClient } = await import('../ai/client');

    // 获取 iflow 配置
    const config = this.getAIClientConfig();
    if (!config) {
      return this.failure('AI client not configured. Please set up iflow authentication.');
    }

    const aiClient = new AIClient(config);
    const expanded = await aiClient.expandContent(content, targetCount);

    return this.success({
      currentCount: this.countWords(expanded),
      targetCount: targetCount,
      status: this.countWords(expanded) >= this.config.min ? 'optimal' : 'insufficient',
      adjustedContent: expanded
    });
  }

  /**
   * 压缩内容
   */
  private async compressContent(content: string, target?: number): Promise<WordCountResult> {
    const current = this.countWords(content);
    const targetCount = target || this.config.target;
    const excess = current - targetCount;

    if (excess <= 0) {
      return this.success({ currentCount: current, status: 'optimal' });
    }

    // 导入 AI 客户端
    const { AIClient } = await import('../ai/client');

    // 获取 iflow 配置
    const config = this.getAIClientConfig();
    if (!config) {
      return this.failure('AI client not configured. Please set up iflow authentication.');
    }

    const aiClient = new AIClient(config);
    const compressed = await aiClient.compressContent(content, targetCount);

    return this.success({
      currentCount: this.countWords(compressed),
      targetCount: targetCount,
      status: this.countWords(compressed) <= this.config.max ? 'optimal' : 'excess',
      adjustedContent: compressed
    });
  }

  /**
   * 获取 AI 客户端配置
   */
  private getAIClientConfig(): { apiKey: string; baseUrl: string; model: string } | null {
    // 从环境变量或配置文件读取
    const apiKey = process.env.IFLOW_API_KEY || process.env.NFLOW_API_KEY;
    const baseUrl = process.env.IFLOW_BASE_URL || 'https://apis.iflow.cn/v1';
    const model = process.env.IFLOW_MODEL || 'Qwen3-Coder';

    if (!apiKey) {
      return null;
    }

    return { apiKey, baseUrl, model };
  }

  /**
   * 生成字数报告
   */
  private async generateReport(): Promise<WordCountResult> {
    // TODO: 从数据库获取所有章节数据
    const report = {
      totalChapters: 0,
      totalWords: 0,
      averageWords: 0,
      达标率: 0
    };

    return this.success({ report });
  }
}