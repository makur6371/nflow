/**
 * 一致性检查工具
 */

import { BaseTool, ToolParams, ToolResult } from './base-tool';

export interface ConsistencyParams extends ToolParams {
  chapterContent?: string;
  chapterNumber?: number;
  checkTypes?: ('character' | 'plot' | 'setting' | 'timeline' | 'foreshadowing')[];
}

export interface ConsistencyResult extends ToolResult {
  issues?: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    location?: string;
  }[];
  score?: number;
}

export class ConsistencyCheckTool extends BaseTool<ConsistencyParams, ConsistencyResult> {
  constructor() {
    super(
      'consistency-check',
      'Consistency Checker',
      'Check character, plot, and world consistency',
      '✅'
    );
  }

  async execute(params: ConsistencyParams): Promise<ConsistencyResult> {
    try {
      const checkTypes = params.checkTypes || ['character', 'plot', 'setting', 'timeline', 'foreshadowing'];
      const issues: any[] = [];

      // TODO: 实现各类型的一致性检查
      for (const type of checkTypes) {
        switch (type) {
          case 'character':
            issues.push(...(await this.checkCharacterConsistency(params)));
            break;
          case 'plot':
            issues.push(...(await this.checkPlotConsistency(params)));
            break;
          case 'setting':
            issues.push(...(await this.checkSettingConsistency(params)));
            break;
          case 'timeline':
            issues.push(...(await this.checkTimelineConsistency(params)));
            break;
          case 'foreshadowing':
            issues.push(...(await this.checkForeshadowing(params)));
            break;
        }
      }

      // 计算一致性得分
      const score = this.calculateScore(issues);

      return this.success({ issues, score });
    } catch (error) {
      return this.failure(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async checkCharacterConsistency(params: ConsistencyParams): Promise<any[]> {
    if (!params.chapterContent) return [];

    const issues: any[] = [];
    const { NovelRepository } = await import('../database/repository');
    const repository = new NovelRepository();
    const characters = repository.getAllCharacters();

    // 检查每个已创建的人物
    for (const character of characters) {
      if (params.chapterContent.includes(character.name)) {
        // 检查人物表现是否符合设定
        const hasIssue = await this.checkCharacterBehavior(
          params.chapterContent,
          character
        );

        if (hasIssue) {
          issues.push({
            type: 'character_ooc',
            description: `人物 ${character.name} 的表现与设定不一致`,
            severity: 'medium' as const,
            character: character.name
          });
        }
      }
    }

    return issues;
  }

  private async checkPlotConsistency(params: ConsistencyParams): Promise<any[]> {
    if (!params.chapterContent) return [];

    const issues: any[] = [];

    // 检查情节逻辑
    // 这里可以添加更复杂的情节逻辑检查
    // 例如：检查是否有逻辑漏洞、情节是否连贯等

    return issues;
  }

  private async checkSettingConsistency(params: ConsistencyParams): Promise<any[]> {
    if (!params.chapterContent) return [];

    const issues: any[] = [];
    const { NovelRepository } = await import('../database/repository');
    const repository = new NovelRepository();
    const settings = repository.getAllWorldSettings();

    // 检查世界观设定
    for (const setting of settings) {
      if (params.chapterContent.includes(setting.key)) {
        // 检查是否违反设定
        // 这里可以添加更详细的设定检查逻辑
      }
    }

    return issues;
  }

  private async checkTimelineConsistency(params: ConsistencyParams): Promise<any[]> {
    if (!params.chapterContent) return [];

    const issues: any[] = [];
    const { NovelRepository } = await import('../database/repository');
    const repository = new NovelRepository();
    const chapters = repository.getAllChapters();

    // 检查时间线
    // 这里可以添加时间线检查逻辑
    // 例如：检查事件顺序是否正确、是否有时间矛盾等

    return issues;
  }

  private async checkForeshadowing(params: ConsistencyParams): Promise<any[]> {
    if (!params.chapterContent) return [];

    const issues: any[] = [];
    const { NovelRepository } = await import('../database/repository');
    const repository = new NovelRepository();
    const pendingForeshadowings = repository.getPendingForeshadowings();

    // 检查伏笔
    // 这里可以添加伏笔检查逻辑
    // 例如：检查是否有未呼应的伏笔、伏笔是否恰当等

    return issues;
  }

  /**
   * 检查人物行为是否符合设定
   */
  private async checkCharacterBehavior(
    chapterContent: string,
    character: any
  ): Promise<boolean> {
    // 这里可以使用 AI 来检查人物行为
    // 目前只是基础检查
    return false;
  }

  private calculateScore(issues: any[]): number {
    // 基于问题数量和严重程度计算得分
    const highSeverityCount = issues.filter(i => i.severity === 'high').length;
    const mediumSeverityCount = issues.filter(i => i.severity === 'medium').length;
    const lowSeverityCount = issues.filter(i => i.severity === 'low').length;

    let score = 100;
    score -= highSeverityCount * 20;
    score -= mediumSeverityCount * 10;
    score -= lowSeverityCount * 5;

    return Math.max(0, score);
  }
}