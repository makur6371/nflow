/**
 * 章节节奏表
 * 
 * 分析和控制章节的节奏
 */

import { NovelRepository } from '../database/repository';

export interface RhythmPoint {
  position: number; // 0-1, 章节中的位置
  type: 'slow' | 'medium' | 'fast' | 'climax' | 'transition';
  intensity: number; // 0-10, 强度
  description: string;
}

export interface ChapterRhythm {
  chapterId: string;
  chapterTitle: string;
  overallPace: 'slow' | 'medium' | 'fast' | 'varied';
  rhythmPoints: RhythmPoint[];
  averageIntensity: number;
  wordCount: number;
  estimatedReadingTime: number; // 分钟
}

export interface RhythmAnalysis {
  score: number; // 0-100
  issues: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    position: number;
  }>;
  suggestions: string[];
}

export class RhythmManager {
  private repository: NovelRepository;

  constructor(repository: NovelRepository) {
    this.repository = repository;
  }

  /**
   * 分析章节节奏
   */
  analyzeChapterRhythm(chapterId: string): ChapterRhythm {
    const chapter = this.repository.getChapter(chapterId);
    
    if (!chapter) {
      throw new Error('Chapter not found');
    }

    const content = chapter.content;
    const paragraphs = content.split('\n\n');
    
    // 分析节奏点
    const rhythmPoints = this.analyzeRhythmPoints(paragraphs);
    
    // 计算整体节奏
    const overallPace = this.calculateOverallPace(rhythmPoints);
    
    // 计算平均强度
    const averageIntensity = this.calculateAverageIntensity(rhythmPoints);
    
    // 估算阅读时间
    const wordCount = content.replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5]/g, '').length;
    const estimatedReadingTime = Math.ceil(wordCount / 400); // 假设每分钟读400字

    return {
      chapterId,
      chapterTitle: chapter.title,
      overallPace,
      rhythmPoints,
      averageIntensity,
      wordCount,
      estimatedReadingTime
    };
  }

  /**
   * 分析节奏质量
   */
  analyzeRhythmQuality(rhythm: ChapterRhythm): RhythmAnalysis {
    const issues: any[] = [];
    const suggestions: string[] = [];

    // 检查节奏单调
    if (this.isMonotonous(rhythm)) {
      issues.push({
        type: 'monotonous',
        description: '节奏过于单调，缺乏变化',
        severity: 'medium',
        position: 0
      });
      suggestions.push('建议在章节中增加节奏变化，交替使用快慢节奏');
    }

    // 检查高潮位置
    const climaxPosition = this.findClimaxPosition(rhythm);
    if (climaxPosition < 0.7) {
      issues.push({
        type: 'early-climax',
        description: '高潮过早出现，可能导致后续节奏疲软',
        severity: 'medium',
        position: climaxPosition
      });
      suggestions.push('建议将高潮延迟到章节中后部分（70%左右）');
    }

    // 检查节奏过快
    if (this.isTooFast(rhythm)) {
      issues.push({
        type: 'too-fast',
        description: '节奏过快，可能影响读者理解',
        severity: 'low',
        position: 0
      });
      suggestions.push('建议在关键情节前增加过渡和铺垫');
    }

    // 检查节奏过慢
    if (this.isTooSlow(rhythm)) {
      issues.push({
        type: 'too-slow',
        description: '节奏过慢，可能导致读者失去兴趣',
        severity: 'low',
        position: 0
      });
      suggestions.push('建议删减冗长描写，加快节奏');
    }

    // 检查缺乏过渡
    if (this.lacksTransitions(rhythm)) {
      issues.push({
        type: 'lack-transitions',
        description: '缺乏节奏过渡，可能导致情节跳跃',
        severity: 'medium',
        position: 0
      });
      suggestions.push('建议在不同节奏之间添加过渡段落');
    }

    // 计算分数
    const score = this.calculateRhythmScore(rhythm, issues);

    return {
      score,
      issues,
      suggestions
    };
  }

  /**
   * 可视化节奏表
   */
  visualizeRhythm(rhythm: ChapterRhythm): string {
    let result = `\n章节节奏表：${rhythm.chapterTitle}\n`;
    result += `${'='.repeat(50)}\n\n`;
    result += `整体节奏：${this.formatPace(rhythm.overallPace)}\n`;
    result += `平均强度：${rhythm.averageIntensity.toFixed(1)}/10\n`;
    result += `字数：${rhythm.wordCount}\n`;
    result += `预估阅读时间：${rhythm.estimatedReadingTime}分钟\n\n`;
    
    result += '节奏曲线：\n';
    result += `${'-'.repeat(50)}\n`;
    
    // 生成节奏曲线
    const curve = this.generateRhythmCurve(rhythm.rhythmPoints);
    result += curve;
    
    result += `${'-'.repeat(50)}\n\n`;
    
    result += '详细节奏点：\n';
    rhythm.rhythmPoints.forEach((point, index) => {
      const position = (point.position * 100).toFixed(0).padStart(3, '0');
      const intensityBar = '█'.repeat(Math.floor(point.intensity));
      result += `  [${position}%] ${intensityBar} ${point.type} (${point.intensity}/10) - ${point.description}\n`;
    });

    return result;
  }

  /**
   * 优化节奏
   */
  optimizeRhythm(rhythm: ChapterRhythm, targetRhythm?: ChapterRhythm): ChapterRhythm {
    const optimizedRhythm = { ...rhythm };
    
    // 如果提供了目标节奏，进行调整
    if (targetRhythm) {
      optimizedRhythm.rhythmPoints = this.adjustRhythmToTarget(
        rhythm.rhythmPoints,
        targetRhythm.rhythmPoints
      );
    } else {
      // 根据最佳实践调整
      optimizedRhythm.rhythmPoints = this.optimizeRhythmByBestPractices(rhythm.rhythmPoints);
    }
    
    // 重新计算整体节奏和平均强度
    optimizedRhythm.overallPace = this.calculateOverallPace(optimizedRhythm.rhythmPoints);
    optimizedRhythm.averageIntensity = this.calculateAverageIntensity(optimizedRhythm.rhythmPoints);
    
    return optimizedRhythm;
  }

  /**
   * 比较两章的节奏
   */
  compareRhythm(chapterId1: string, chapterId2: string): string {
    const rhythm1 = this.analyzeChapterRhythm(chapterId1);
    const rhythm2 = this.analyzeChapterRhythm(chapterId2);

    let result = `\n节奏对比：${rhythm1.chapterTitle} vs ${rhythm2.chapterTitle}\n`;
    result += `${'='.repeat(50)}\n\n`;
    
    result += `整体节奏对比：\n`;
    result += `  ${rhythm1.chapterTitle}：${this.formatPace(rhythm1.overallPace)}\n`;
    result += `  ${rhythm2.chapterTitle}：${this.formatPace(rhythm2.overallPace)}\n\n`;
    
    result += `平均强度对比：\n`;
    result += `  ${rhythm1.chapterTitle}：${rhythm1.averageIntensity.toFixed(1)}/10\n`;
    result += `  ${rhythm2.chapterTitle}：${rhythm2.averageIntensity.toFixed(1)}/10\n\n`;
    
    const intensityDiff = rhythm2.averageIntensity - rhythm1.averageIntensity;
    result += `强度差异：${intensityDiff > 0 ? '+' : ''}${intensityDiff.toFixed(1)}\n\n`;
    
    // 建议
    if (Math.abs(intensityDiff) > 2) {
      result += `建议：两章节奏差异较大，${intensityDiff > 0 ? '第二章节奏明显更强' : '第一章节奏明显更强'}，考虑调整\n`;
    } else {
      result += `建议：两章节奏较为接近，节奏过渡自然\n`;
    }
    
    return result;
  }

  // 私有方法

  private analyzeRhythmPoints(paragraphs: string[]): RhythmPoint[] {
    const points: RhythmPoint[] = [];
    
    paragraphs.forEach((paragraph, index) => {
      const position = index / paragraphs.length;
      const rhythmPoint = this.analyzeParagraphRhythm(paragraph, position);
      points.push(rhythmPoint);
    });
    
    return points;
  }

  private analyzeParagraphRhythm(paragraph: string, position: number): RhythmPoint {
    // 简单的节奏分析
    // 实际应用中可以使用更复杂的NLP技术
    
    const sentences = paragraph.split(/[。！？]/);
    const avgSentenceLength = paragraph.length / sentences.length;
    
    // 根据句子长度判断节奏
    let type: RhythmPoint['type'];
    let intensity: number;
    
    if (avgSentenceLength > 30) {
      type = 'slow';
      intensity = 3;
    } else if (avgSentenceLength > 15) {
      type = 'medium';
      intensity = 5;
    } else {
      type = 'fast';
      intensity = 7;
    }
    
    // 检查是否有感叹号或问号（表示情感强烈）
    if (paragraph.includes('！') || paragraph.includes('？')) {
      intensity += 2;
    }
    
    // 检查是否有引号（表示对话，节奏较快）
    if (paragraph.includes('"') || paragraph.includes('"') || paragraph.includes('"')) {
      intensity += 1;
    }
    
    // 限制强度范围
    intensity = Math.min(10, Math.max(1, intensity));
    
    // 描述
    const description = this.generateRhythmDescription(type, intensity);
    
    return {
      position,
      type,
      intensity,
      description
    };
  }

  private generateRhythmDescription(type: RhythmPoint['type'], intensity: number): string {
    if (intensity >= 8) {
      return `高强度${type === 'fast' ? '激烈' : type === 'slow' ? '深沉' : '紧张'}段落`;
    } else if (intensity >= 5) {
      return `中等强度${type === 'fast' ? '活跃' : type === 'slow' ? '舒缓' : '平稳'}段落`;
    } else {
      return `低强度${type === 'fast' ? '轻快' : type === 'slow' ? '平静' : '温和'}段落`;
    }
  }

  private calculateOverallPace(rhythmPoints: RhythmPoint[]): ChapterRhythm['overallPace'] {
    if (rhythmPoints.length === 0) return 'medium';
    
    const slowCount = rhythmPoints.filter(p => p.type === 'slow').length;
    const fastCount = rhythmPoints.filter(p => p.type === 'fast').length;
    const total = rhythmPoints.length;
    
    const slowRatio = slowCount / total;
    const fastRatio = fastCount / total;
    
    if (fastRatio > 0.6) return 'fast';
    if (slowRatio > 0.6) return 'slow';
    if (Math.abs(fastRatio - slowRatio) < 0.1) return 'varied';
    return 'medium';
  }

  private calculateAverageIntensity(rhythmPoints: RhythmPoint[]): number {
    if (rhythmPoints.length === 0) return 5;
    
    const sum = rhythmPoints.reduce((acc, point) => acc + point.intensity, 0);
    return sum / rhythmPoints.length;
  }

  private formatPace(pace: ChapterRhythm['overallPace']): string {
    const map: Record<ChapterRhythm['overallPace'], string> = {
      slow: '缓慢',
      medium: '中等',
      fast: '快速',
      varied: '多变'
    };
    return map[pace];
  }

  private isMonotonous(rhythm: ChapterRhythm): boolean {
    const types = new Set(rhythm.rhythmPoints.map(p => p.type));
    return types.size <= 2;
  }

  private findClimaxPosition(rhythm: ChapterRhythm): number {
    const climaxPoint = rhythm.rhythmPoints
      .filter(p => p.type === 'climax' || p.intensity >= 8)
      .sort((a, b) => b.intensity - a.intensity)[0];
    
    return climaxPoint ? climaxPoint.position : 0;
  }

  private isTooFast(rhythm: ChapterRhythm): boolean {
    const fastRatio = rhythm.rhythmPoints.filter(p => p.type === 'fast').length / rhythm.rhythmPoints.length;
    return fastRatio > 0.8;
  }

  private isTooSlow(rhythm: ChapterRhythm): boolean {
    const slowRatio = rhythm.rhythmPoints.filter(p => p.type === 'slow').length / rhythm.rhythmPoints.length;
    return slowRatio > 0.8;
  }

  private lacksTransitions(rhythm: ChapterRhythm): boolean {
    // 检查是否有足够的过渡点
    const transitionCount = rhythm.rhythmPoints.filter(p => p.type === 'transition').length;
    return transitionCount === 0;
  }

  private calculateRhythmScore(rhythm: ChapterRhythm, issues: any[]): number {
    let score = 100;
    
    // 根据问题严重程度扣分
    issues.forEach(issue => {
      if (issue.severity === 'high') score -= 15;
      else if (issue.severity === 'medium') score -= 10;
      else score -= 5;
    });
    
    // 根据节奏多样性加分
    const typeCount = new Set(rhythm.rhythmPoints.map(p => p.type)).size;
    score += typeCount * 5;
    
    return Math.min(100, Math.max(0, score));
  }

  private generateRhythmCurve(rhythmPoints: RhythmPoint[]): string {
    const width = 50;
    let curve = '';
    
    for (let i = 0; i < width; i++) {
      const position = i / width;
      const point = this.findClosestPoint(rhythmPoints, position);
      
      if (point) {
        const bar = '█'.repeat(Math.ceil(point.intensity / 10 * 10));
        curve += bar.padEnd(10) + ' ';
      } else {
        curve += ' '.repeat(10) + ' ';
      }
      
      if ((i + 1) % 10 === 0) curve += '\n';
    }
    
    return curve;
  }

  private findClosestPoint(points: RhythmPoint[], position: number): RhythmPoint | undefined {
    return points.reduce((closest, point) => {
      const currentDist = Math.abs(point.position - position);
      const closestDist = closest ? Math.abs(closest.position - position) : Infinity;
      return currentDist < closestDist ? point : closest;
    }, undefined as RhythmPoint | undefined);
  }

  private adjustRhythmToTarget(currentPoints: RhythmPoint[], targetPoints: RhythmPoint[]): RhythmPoint[] {
    // 简单的节奏调整
    // 实际应用中可能需要更复杂的算法
    return currentPoints.map((point, index) => {
      const targetPoint = targetPoints[index];
      if (targetPoint) {
        return {
          ...point,
          type: targetPoint.type,
          intensity: (point.intensity + targetPoint.intensity) / 2
        };
      }
      return point;
    });
  }

  private optimizeRhythmByBestPractices(points: RhythmPoint[]): RhythmPoint[] {
    // 根据最佳实践优化节奏
    // 实际应用中可以加入更多规则
    
    const optimized = [...points];
    
    // 确保有高潮
    const maxIntensityPoint = optimized.reduce((max, point) => 
      point.intensity > max.intensity ? point : max
    );
    
    if (maxIntensityPoint.intensity < 8) {
      maxIntensityPoint.intensity = 9;
      maxIntensityPoint.type = 'climax';
    }
    
    // 确保高潮位置合理
    const climaxIndex = optimized.indexOf(maxIntensityPoint);
    const idealClimaxPosition = Math.floor(optimized.length * 0.7);
    
    if (Math.abs(climaxIndex - idealClimaxPosition) > optimized.length * 0.2) {
      // 交换位置
      const temp = optimized[idealClimaxPosition];
      optimized[idealClimaxPosition] = maxIntensityPoint;
      optimized[climaxIndex] = temp;
    }
    
    return optimized;
  }
}