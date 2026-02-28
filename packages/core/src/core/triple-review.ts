/**
 * 三重自审查机制
 * 
 * 包括三个阶段的审查：
 * 1. 写作前：上下文注入
 * 2. 写作中：实时检查
 * 3. 写作后：全面审查
 */

import { NovelRepository } from '../database/repository';
import { AIClient } from '../ai/client';

export interface FullContext {
  fullOutline: string;
  chapterPlan: string;
  basicSettings: string;
  characterProfiles: string;
  worldSettings: string;
  completedChaptersSummary: string;
  currentPlotState: string;
  foreshadowings: string;
  timeline: string;
  characterRelationships: string;
}

export interface CheckResult {
  passed: boolean;
  issues: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  suggestions: string[];
}

export interface FullReviewResult {
  score: number;
  dimensions: {
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
  overallAssessment: string;
}

/**
 * 写作前：上下文注入
 */
export class PreWritingContext {
  private repository: NovelRepository;

  constructor(repository: NovelRepository) {
    this.repository = repository;
  }

  /**
   * 注入完整的上下文信息
   */
  async injectFullContext(chapterNumber: number): Promise<FullContext> {
    const metadata = this.repository.getProjectMetadata();
    const characters = this.repository.getAllCharacters();
    const chapters = this.repository.getAllChapters();
    const worldSettings = this.repository.getAllWorldSettings();
    const pendingForeshadowings = this.repository.getPendingForeshadowings();

    return {
      fullOutline: metadata.outline || '',
      chapterPlan: this.getChapterPlan(chapterNumber),
      basicSettings: this.getBasicSettings(metadata),
      characterProfiles: this.getCharacterProfiles(characters),
      worldSettings: this.getWorldSettings(worldSettings),
      completedChaptersSummary: this.getCompletedChaptersSummary(chapters, chapterNumber),
      currentPlotState: this.getCurrentPlotState(metadata),
      foreshadowings: this.getForeshadowings(pendingForeshadowings),
      timeline: this.getTimeline(chapters),
      characterRelationships: this.getCharacterRelationships(characters)
    };
  }

  private getChapterPlan(chapterNumber: number): string {
    // 从大纲中提取章节规划
    return `第 ${chapterNumber} 章规划`;
  }

  private getBasicSettings(metadata: any): string {
    return JSON.stringify({
      genre: metadata.genre,
      theme: metadata.theme,
      style: metadata.style
    }, null, 2);
  }

  private getCharacterProfiles(characters: any[]): string {
    return characters.map(c => ({
      name: c.name,
      role: c.role,
      personality: c.personality,
      traits: c.traits
    })).join('\n\n');
  }

  private getWorldSettings(settings: any[]): string {
    return settings.map(s => `${s.category}: ${s.key} = ${s.value}`).join('\n');
  }

  private getCompletedChaptersSummary(chapters: any[], currentChapter: number): string {
    const completed = chapters.filter(c => c.orderIndex < currentChapter);
    return completed.map(c => `第${c.orderIndex}章: ${c.title} - ${c.summary}`).join('\n');
  }

  private getCurrentPlotState(metadata: any): string {
    return metadata.currentPlotState || '故事开始';
  }

  private getForeshadowings(foreshadowings: any[]): string {
    return foreshadowings.map(f => `- ${f.description}`).join('\n');
  }

  private getTimeline(chapters: any[]): string {
    return chapters.map(c => `第${c.orderIndex}章: ${c.title}`).join(' -> ');
  }

  private getCharacterRelationships(characters: any[]): string {
    return characters.map(c => `${c.name}: ${JSON.stringify(c.relationships)}`).join('\n');
  }
}

/**
 * 写作中：实时检查
 */
export class RealTimeChecker {
  private repository: NovelRepository;
  private aiClient: AIClient;

  constructor(repository: NovelRepository, aiClient: AIClient) {
    this.repository = repository;
    this.aiClient = aiClient;
  }

  /**
   * 实时检查文本片段
   */
  async checkWhileWriting(segment: string, context: FullContext): Promise<CheckResult> {
    const checks = await Promise.all([
      this.checkCharacterConsistency(segment, context),
      this.checkPlotLogic(segment, context),
      this.checkWorldSetting(segment, context),
      this.checkTimeline(segment, context),
      this.checkForeshadowing(segment, context)
    ]);

    const allIssues = checks.flatMap(c => c.issues);
    const allSuggestions = checks.flatMap(c => c.suggestions);

    return {
      passed: allIssues.filter(i => i.severity === 'high').length === 0,
      issues: allIssues,
      suggestions: allSuggestions
    };
  }

  private async checkCharacterConsistency(segment: string, context: FullContext): Promise<CheckResult> {
    const characters = this.repository.getAllCharacters();
    const issues: any[] = [];
    const suggestions: string[] = [];

    // 检查提到的人物是否一致
    for (const character of characters) {
      if (segment.includes(character.name)) {
        // 这里可以添加更复杂的一致性检查逻辑
        // 目前只是基础检查
      }
    }

    return { passed: issues.length === 0, issues, suggestions };
  }

  private async checkPlotLogic(segment: string, context: FullContext): Promise<CheckResult> {
    const issues: any[] = [];
    const suggestions: string[] = [];

    // 检查情节逻辑
    // 这里可以添加更复杂的逻辑检查

    return { passed: issues.length === 0, issues, suggestions };
  }

  private async checkWorldSetting(segment: string, context: FullContext): Promise<CheckResult> {
    const issues: any[] = [];
    const suggestions: string[] = [];

    // 检查世界观设定
    const settings = this.repository.getAllWorldSettings();
    for (const setting of settings) {
      if (segment.includes(setting.key)) {
        // 检查是否违反设定
      }
    }

    return { passed: issues.length === 0, issues, suggestions };
  }

  private async checkTimeline(segment: string, context: FullContext): Promise<CheckResult> {
    const issues: any[] = [];
    const suggestions: string[] = [];

    // 检查时间线
    // 这里可以添加时间线检查逻辑

    return { passed: issues.length === 0, issues, suggestions };
  }

  private async checkForeshadowing(segment: string, context: FullContext): Promise<CheckResult> {
    const issues: any[] = [];
    const suggestions: string[] = [];

    // 检查伏笔
    // 这里可以添加伏笔检查逻辑

    return { passed: issues.length === 0, issues, suggestions };
  }
}

/**
 * 写作后：全面审查
 */
export class PostWritingReviewer {
  private repository: NovelRepository;
  private aiClient: AIClient;

  constructor(repository: NovelRepository, aiClient: AIClient) {
    this.repository = repository;
    this.aiClient = aiClient;
  }

  /**
   * 全面审查章节内容
   */
  async fullReview(chapter: string, context: FullContext): Promise<FullReviewResult> {
    // 使用 AI 审核内容
    const review = await this.aiClient.reviewContent(chapter);

    return {
      score: review.score,
      dimensions: {
        characterConsistency: review.dimensions.characterConsistency || 0,
        plotLogic: review.dimensions.plotLogic || 0,
        worldSetting: review.dimensions.worldSetting || 0,
        timeline: review.dimensions.timeline || 0,
        foreshadowing: review.dimensions.foreshadowing || 0
      },
      issues: review.issues,
      overallAssessment: this.getOverallAssessment(review.score)
    };
  }

  /**
   * 审查整体结构
   */
  async reviewOverallStructure(chapter: string, context: FullContext): Promise<number> {
    // 审查章节结构
    return 80; // 示例分数
  }

  /**
   * 审查人物发展
   */
  async reviewCharacterDevelopment(chapter: string, context: FullContext): Promise<number> {
    // 审查人物发展
    return 80; // 示例分数
  }

  /**
   * 审查情节推进
   */
  async reviewPlotProgression(chapter: string, context: FullContext): Promise<number> {
    // 审查情节推进
    return 80; // 示例分数
  }

  /**
   * 审查写作质量
   */
  async reviewWritingQuality(chapter: string, context: FullContext): Promise<number> {
    // 审查写作质量
    return 80; // 示例分数
  }

  /**
   * 审查一致性
   */
  async reviewConsistency(chapter: string, context: FullContext): Promise<number> {
    // 审查一致性
    return 80; // 示例分数
  }

  /**
   * 审查伏笔呼应
   */
  async reviewForeshadowing(chapter: string, context: FullContext): Promise<number> {
    // 审查伏笔呼应
    return 80; // 示例分数
  }

  private getOverallAssessment(score: number): string {
    if (score >= 90) return '优秀，可以直接发布';
    if (score >= 80) return '良好，可以继续';
    if (score >= 70) return '一般，建议优化';
    if (score >= 60) return '及格，需要修改';
    return '不及格，必须重写';
  }
}
