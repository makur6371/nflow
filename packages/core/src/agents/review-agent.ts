/**
 * 审核代理
 */

import { getAgentDefinition } from './agent-registry';
import { AIClient } from '../ai/client';
import { NovelRepository } from '../database/repository';
import { ConsistencyCheckTool } from '../tools/consistency-check';
import { PostWritingReviewer } from '../core/triple-review';

export interface ReviewAgentParams {
  chapterId?: string;
  content?: string;
  orderIndex?: number;
}

export interface ReviewAgentResult {
  success: boolean;
  review?: {
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
  };
  error?: string;
}

export class ReviewAgent {
  private definition = getAgentDefinition('review-agent');
  private aiClient: AIClient;
  private repository: NovelRepository;
  private consistencyCheck: ConsistencyCheckTool;
  private postWritingReviewer: PostWritingReviewer;

  constructor(aiClient: AIClient, repository: NovelRepository) {
    this.aiClient = aiClient;
    this.repository = repository;
    this.consistencyCheck = new ConsistencyCheckTool();
    this.postWritingReviewer = new PostWritingReviewer(repository, aiClient);
  }

  async reviewChapter(params: ReviewAgentParams): Promise<ReviewAgentResult> {
    try {
      let content: string;
      let chapterId: string;

      if (params.content) {
        content = params.content;
        chapterId = params.chapterId || '';
      } else if (params.chapterId) {
        const chapter = this.repository.getChapter(params.chapterId);
        if (!chapter) {
          return {
            success: false,
            error: 'Chapter not found'
          };
        }
        content = chapter.content;
        chapterId = params.chapterId;
      } else {
        return {
          success: false,
          error: 'Either chapterId or content is required'
        };
      }

      // 使用写作后审查器进行全面审查
      const context = await this.buildContext(chapterId);
      const fullReview = await this.postWritingReviewer.fullReview(content, context);

      // 转换为标准格式
      const review = {
        score: fullReview.score,
        dimensions: {
          characterConsistency: fullReview.dimensions.characterConsistency,
          plotLogic: fullReview.dimensions.plotLogic,
          worldSetting: fullReview.dimensions.worldSetting,
          timeline: fullReview.dimensions.timeline,
          foreshadowing: fullReview.dimensions.foreshadowing
        },
        issues: fullReview.issues
      };

      return {
        success: true,
        review
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async quickReview(content: string): Promise<ReviewAgentResult> {
    try {
      // 调用 AI 进行快速审核
      const review = await this.aiClient.reviewContent(content);

      // 确保 dimensions 有正确的类型
      const dimensions = {
        characterConsistency: review.dimensions?.characterConsistency || 0,
        plotLogic: review.dimensions?.plotLogic || 0,
        worldSetting: review.dimensions?.worldSetting || 0,
        timeline: review.dimensions?.timeline || 0,
        foreshadowing: review.dimensions?.foreshadowing || 0
      };

      return {
        success: true,
        review: {
          score: review.score || 0,
          dimensions,
          issues: review.issues || []
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async detailedReview(chapterId: string): Promise<ReviewAgentResult> {
    try {
      const chapter = this.repository.getChapter(chapterId);

      if (!chapter) {
        return {
          success: false,
          error: 'Chapter not found'
        };
      }

      // 获取上下文信息
      const context = {
        characters: this.repository.getAllCharacters(),
        worldSettings: this.repository.getAllWorldSettings(),
        foreshadowings: this.repository.getPendingForeshadowings()
      };

      // 进行一致性检查
      const consistencyResult = await this.consistencyCheck.execute({
        content: chapter.content,
        context,
        chapterId
      });

      // 进行 AI 审核
      const aiReview = await this.aiClient.reviewContent(chapter.content);

      // 合并结果
      const allIssues = [
        ...(aiReview.issues || []),
        ...(consistencyResult.success && consistencyResult.issues ? consistencyResult.issues : [])
      ];

      // 确保 dimensions 有正确的类型
      const dimensions = {
        characterConsistency: aiReview.dimensions?.characterConsistency || 0,
        plotLogic: aiReview.dimensions?.plotLogic || 0,
        worldSetting: aiReview.dimensions?.worldSetting || 0,
        timeline: aiReview.dimensions?.timeline || 0,
        foreshadowing: aiReview.dimensions?.foreshadowing || 0
      };

      return {
        success: true,
        review: {
          score: aiReview.score || 0,
          dimensions,
          issues: allIssues
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async buildContext(chapterId: string): Promise<any> {
    const metadata = this.repository.getProjectMetadata();
    const characters = this.repository.getAllCharacters();
    const chapters = this.repository.getAllChapters();
    const worldSettings = this.repository.getAllWorldSettings();
    const pendingForeshadowings = this.repository.getPendingForeshadowings();

    return {
      fullOutline: metadata.outline || '',
      chapterPlan: '',
      basicSettings: '',
      characterProfiles: '',
      worldSettings: '',
      completedChaptersSummary: '',
      currentPlotState: '',
      foreshadowings: '',
      timeline: '',
      characterRelationships: ''
    };
  }
}