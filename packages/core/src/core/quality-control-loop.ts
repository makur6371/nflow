/**
 * 质量把控闭环流程
 * 
 * 实现"审核→设定检查→继续写作"的循环机制
 */

import { NovelRepository } from '../database/repository';
import { AIClient } from '../ai/client';
import { ConsistencyCheckTool } from '../tools/consistency-check';
import { AutoFixer } from './auto-fixer';
import { FullContext, PostWritingReviewer } from './triple-review';

export interface LoopLog {
  step: string;
  iteration: number;
  result: any;
  timestamp: string;
}

export interface QualityControlResult {
  content: string;
  score: number;
  iterations: number;
  log: LoopLog[];
  passed: boolean;
}

export interface ReviewResult {
  score: number;
  details: {
    characterConsistency: number;
    plotLogic: number;
    worldSetting: number;
    timeline: number;
    foreshadowing: number;
  };
  issues: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export interface ConsistencyResult {
  hasIssues: boolean;
  issues: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

/**
 * 质量把控闭环控制器
 */
export class QualityControlLoop {
  private repository: NovelRepository;
  private aiClient: AIClient;
  private reviewer: PostWritingReviewer;
  private autoFixer: AutoFixer;
  private maxIterations: number;

  constructor(
    repository: NovelRepository,
    aiClient: AIClient,
    maxIterations: number = 3
  ) {
    this.repository = repository;
    this.aiClient = aiClient;
    this.reviewer = new PostWritingReviewer(repository, aiClient);
    this.autoFixer = new AutoFixer(repository, aiClient);
    this.maxIterations = maxIterations;
  }

  /**
   * 执行质量把控闭环流程
   */
  async execute(chapter: string, context: FullContext): Promise<QualityControlResult> {
    let currentChapter = chapter;
    const log: LoopLog[] = [];
    let iteration = 0;

    while (iteration < this.maxIterations) {
      iteration++;

      // 步骤1：质量审核
      const review = await this.reviewChapter(currentChapter, context);
      log.push({
        step: 'review',
        iteration,
        result: review,
        timestamp: new Date().toISOString()
      });

      // 如果质量达标（80分以上），退出循环
      if (review.score >= 80) {
        break;
      }

      // 步骤2：设定一致性检查
      const consistency = await this.checkConsistency(currentChapter, context);
      log.push({
        step: 'consistency',
        iteration,
        result: consistency,
        timestamp: new Date().toISOString()
      });

      // 步骤3：自动修复（如果有问题）
      if (consistency.hasIssues) {
        const fixed = await this.autoFix(currentChapter, consistency.issues, context);
        currentChapter = fixed.content;
        log.push({
          step: 'auto_fix',
          iteration,
          result: fixed,
          timestamp: new Date().toISOString()
        });
      }

      // 步骤4：润色
      const polished = await this.polishChapter(currentChapter);
      currentChapter = polished;
      log.push({
        step: 'polish',
        iteration,
        result: { length: currentChapter.length },
        timestamp: new Date().toISOString()
      });
    }

    // 最终质量评分
    const finalScore = await this.reviewChapter(currentChapter, context);

    return {
      content: currentChapter,
      score: finalScore.score,
      iterations: iteration,
      log: log,
      passed: finalScore.score >= 80
    };
  }

  /**
   * 质量审核
   */
  private async reviewChapter(chapter: string, context: FullContext): Promise<ReviewResult> {
    // 使用 AI 审核内容
    const review = await this.aiClient.reviewContent(chapter);

    return {
      score: review.score,
      details: {
        characterConsistency: review.dimensions.characterConsistency || 0,
        plotLogic: review.dimensions.plotLogic || 0,
        worldSetting: review.dimensions.worldSetting || 0,
        timeline: review.dimensions.timeline || 0,
        foreshadowing: review.dimensions.foreshadowing || 0
      },
      issues: review.issues
    };
  }

  /**
   * 设定一致性检查
   */
  private async checkConsistency(chapter: string, context: FullContext): Promise<ConsistencyResult> {
    const issues: any[] = [];

    // 检查人物一致性
    const characterIssues = await this.checkCharacters(chapter, context);
    issues.push(...characterIssues);

    // 检查时间线
    const timelineIssues = await this.checkTimelineConsistency(chapter, context);
    issues.push(...timelineIssues);

    // 检查世界观设定
    const settingIssues = await this.checkWorldSettings(chapter, context);
    issues.push(...settingIssues);

    return {
      hasIssues: issues.length > 0,
      issues: issues
    };
  }

  /**
   * 检查人物一致性
   */
  private async checkCharacters(chapter: string, context: FullContext): Promise<any[]> {
    const characters = this.repository.getAllCharacters();
    const issues: any[] = [];

    for (const character of characters) {
      if (chapter.includes(character.name)) {
        // 检查人物表现是否符合设定
        // 这里可以添加更复杂的检查逻辑
      }
    }

    return issues;
  }

  /**
   * 检查时间线一致性
   */
  private async checkTimelineConsistency(chapter: string, context: FullContext): Promise<any[]> {
    const issues: any[] = [];

    // 检查时间线
    // 这里可以添加时间线检查逻辑

    return issues;
  }

  /**
   * 检查世界观设定
   */
  private async checkWorldSettings(chapter: string, context: FullContext): Promise<any[]> {
    const settings = this.repository.getAllWorldSettings();
    const issues: any[] = [];

    for (const setting of settings) {
      if (chapter.includes(setting.key)) {
        // 检查是否违反设定
        // 这里可以添加更复杂的检查逻辑
      }
    }

    return issues;
  }

  /**
   * 自动修复
   */
  private async autoFix(
    chapter: string,
    issues: any[],
    context: FullContext
  ): Promise<{ content: string; log: any[] }> {
    return await this.autoFixer.autoFix(chapter, issues, context);
  }

  /**
   * 润色章节
   */
  private async polishChapter(chapter: string): Promise<string> {
    return await this.aiClient.polishText(chapter);
  }
}