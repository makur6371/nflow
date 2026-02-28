/**
 * 大纲代理
 */

import { getAgentDefinition } from './agent-registry';
import { AIClient } from '../ai/client';
import { OutlineTool } from '../tools/outline-tool';

export interface OutlineAgentParams {
  genre?: string;
  theme?: string;
  chapterCount?: number;
  style?: string;
  description?: string;
}

export interface OutlineAgentResult {
  success: boolean;
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
  error?: string;
}

export class OutlineAgent {
  private definition = getAgentDefinition('outline-agent');
  private aiClient: AIClient;
  private outlineTool: OutlineTool;

  constructor(aiClient: AIClient) {
    this.aiClient = aiClient;
    this.outlineTool = new OutlineTool();
  }

  async generateOutline(params: OutlineAgentParams): Promise<OutlineAgentResult> {
    try {
      // 调用 AI 生成大纲
      const outline = await this.aiClient.generateOutline({
        genre: params.genre || '玄幻',
        theme: params.theme || '成长',
        chapterCount: params.chapterCount || 10,
        description: params.description || ''
      });

      return {
        success: true,
        outline
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async generateDetailedOutline(params: OutlineAgentParams): Promise<OutlineAgentResult> {
    try {
      // 使用大纲工具生成详细大纲
      const result = await this.outlineTool.execute({
        genre: params.genre || '玄幻',
        theme: params.theme || '成长',
        chapterCount: params.chapterCount || 10,
        style: params.style || 'standard',
        description: params.description || ''
      });

      if (result.success) {
        return {
          success: true,
          outline: result.outline
        };
      } else {
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}