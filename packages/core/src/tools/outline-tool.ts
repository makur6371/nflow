/**
 * 大纲生成工具
 */

import { BaseTool, ToolParams, ToolResult } from './base-tool';
import { AIClient } from '../ai/client';

export interface OutlineParams extends ToolParams {
  genre?: string;
  theme?: string;
  chapterCount?: number;
  style?: string;
  description?: string;
}

export interface OutlineResult extends ToolResult {
  outline?: {
    title: string;
    summary: string;
    chapters: Array<{
      number: number;
      title: string;
      summary: string;
      keyEvents: string[];
    }>;
  };
}

export class OutlineTool extends BaseTool<OutlineParams, OutlineResult> {
  private aiClient: AIClient;

  constructor() {
    super(
      'outline-tool',
      'Outline Generator',
      'Generate detailed chapter outlines for novels',
      '📋'
    );
    // 获取 AI 客户端配置
    const config = this.getAIClientConfig();
    if (config) {
      this.aiClient = new AIClient(config);
    } else {
      throw new Error('AI client not configured');
    }
  }

  async execute(params: OutlineParams): Promise<OutlineResult> {
    try {
      // 调用 AI 生成大纲
      const outline = await this.aiClient.generateOutline({
        genre: params.genre || '玄幻',
        theme: params.theme || '成长',
        chapterCount: params.chapterCount || 10,
        description: params.description || ''
      });

      return this.success(outline);
    } catch (error) {
      return this.failure(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * 获取 AI 客户端配置
   */
  private getAIClientConfig(): { apiKey: string; baseUrl: string; model: string } | null {
    const apiKey = process.env.IFLOW_API_KEY || process.env.NFLOW_API_KEY;
    const baseUrl = process.env.IFLOW_BASE_URL || 'https://apis.iflow.cn/v1';
    const model = process.env.IFLOW_MODEL || 'Qwen3-Coder';

    if (!apiKey) return null;
    return { apiKey, baseUrl, model };
  }
}
