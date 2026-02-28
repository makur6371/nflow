/**
 * 自动修复工具
 * 
 * 自动检测并修复常见问题
 */

import { NovelRepository } from '../database/repository';
import { AIClient } from '../ai/client';
import { FullContext } from './triple-review';

export interface Issue {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  location?: string;
  character?: string;
  conflictKey?: string;
  foreshadowingId?: string;
  problemParagraph?: string;
  targetWordCount?: number;
}

export interface Fix {
  content: string;
  action: string;
}

export interface FixLog {
  type: string;
  description: string;
  action: string;
  success: boolean;
  error?: string;
}

export interface FixResult {
  content: string;
  log: FixLog[];
  success: boolean;
}

/**
 * 自动修复器
 */
export class AutoFixer {
  private repository: NovelRepository;
  private aiClient: AIClient;

  constructor(repository: NovelRepository, aiClient: AIClient) {
    this.repository = repository;
    this.aiClient = aiClient;
  }

  /**
   * 自动修复入口
   */
  async autoFix(chapter: string, issues: Issue[], context: FullContext): Promise<FixResult> {
    let fixedChapter = chapter;
    const fixLog: FixLog[] = [];

    for (const issue of issues) {
      try {
        const fix = await this.fixIssue(fixedChapter, issue, context);
        fixedChapter = fix.content;
        fixLog.push({
          type: issue.type,
          description: issue.description,
          action: fix.action,
          success: true
        });
      } catch (error) {
        fixLog.push({
          type: issue.type,
          description: issue.description,
          action: 'failed',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return {
      content: fixedChapter,
      log: fixLog,
      success: fixLog.every(log => log.success)
    };
  }

  /**
   * 修复单个问题
   */
  private async fixIssue(chapter: string, issue: Issue, context: FullContext): Promise<Fix> {
    switch (issue.type) {
      case 'word_count_insufficient':
        return await this.fixWordCount(chapter, issue);
      case 'word_count_excess':
        return await this.fixWordCountExcess(chapter, issue);
      case 'character_ooc':
        return await this.fixCharacterOOC(chapter, issue);
      case 'timeline_error':
        return await this.fixTimeline(chapter, issue);
      case 'setting_conflict':
        return await this.fixSettingConflict(chapter, issue);
      case 'foreshadowing_missed':
        return await this.fixForeshadowing(chapter, issue);
      default:
        throw new Error(`Unknown issue type: ${issue.type}`);
    }
  }

  /**
   * 修复字数不足
   */
  private async fixWordCount(chapter: string, issue: Issue): Promise<Fix> {
    const target = issue.targetWordCount || 2200;
    const expanded = await this.aiClient.expandContent(chapter, target);

    return {
      content: expanded,
      action: `字数从${chapter.length}扩展到${expanded.length}`
    };
  }

  /**
   * 修复字数超标
   */
  private async fixWordCountExcess(chapter: string, issue: Issue): Promise<Fix> {
    const target = issue.targetWordCount || 2200;
    const compressed = await this.aiClient.compressContent(chapter, target);

    return {
      content: compressed,
      action: `字数从${chapter.length}压缩到${compressed.length}`
    };
  }

  /**
   * 修复人物OOC（Out Of Character）
   */
  private async fixCharacterOOC(chapter: string, issue: Issue): Promise<Fix> {
    if (!issue.character) {
      throw new Error('Character name is required for OOC fix');
    }

    const character = this.repository.getCharacterByName(issue.character);
    if (!character) {
      throw new Error(`Character not found: ${issue.character}`);
    }

    const prompt = `
当前章节中，${issue.character}的表现与设定不符。

人物设定：
- 性格：${character.personality}
- 背景：${character.background}
- 性格特征：${character.traits?.join(', ') || '无'}

问题段落：
${issue.problemParagraph || '未提供具体段落'}

请修改这段内容，使人物表现符合设定。
`;

    const fixed = await this.aiClient.generateText(prompt, { maxTokens: 1000 });

    if (issue.problemParagraph) {
      return {
        content: chapter.replace(issue.problemParagraph, fixed),
        action: `修正${issue.character}的行为表现`
      };
    }

    return {
      content: fixed,
      action: `修正${issue.character}的行为表现`
    };
  }

  /**
   * 修复时间线错误
   */
  private async fixTimeline(chapter: string, issue: Issue): Promise<Fix> {
    const chapters = this.repository.getAllChapters();
    const timeline = chapters.map(c => `第${c.orderIndex}章: ${c.title}`).join('\n');

    const prompt = `
当前章节中存在时间线错误。

正确的时间线：
${timeline}

错误描述：
${issue.description}

请修正时间线错误，保持与已有章节的时间顺序一致。
`;

    const fixed = await this.aiClient.generateText(prompt, { maxTokens: 2000 });

    return {
      content: fixed,
      action: '修正时间线错误'
    };
  }

  /**
   * 修复设定冲突
   */
  private async fixSettingConflict(chapter: string, issue: Issue): Promise<Fix> {
    if (!issue.conflictKey) {
      throw new Error('Conflict key is required for setting conflict fix');
    }

    const settings = this.repository.getAllWorldSettings();
    const conflictSetting = settings.find(s => s.key === issue.conflictKey);

    if (!conflictSetting) {
      throw new Error(`Setting not found: ${issue.conflictKey}`);
    }

    const prompt = `
当前章节中存在设定冲突。

正确设定：
- ${conflictSetting.category}: ${conflictSetting.key} = ${conflictSetting.value}
- 描述：${conflictSetting.description}

冲突描述：
${issue.description}

请修正设定冲突，确保符合世界观设定。
`;

    const fixed = await this.aiClient.generateText(prompt, { maxTokens: 2000 });

    return {
      content: fixed,
      action: `修正设定冲突: ${issue.conflictKey}`
    };
  }

  /**
   * 修复伏笔遗漏
   */
  private async fixForeshadowing(chapter: string, issue: Issue): Promise<Fix> {
    const pendingForeshadowings = this.repository.getPendingForeshadowings();
    const foreshadowing = pendingForeshadowings.find(f => f.id === issue.foreshadowingId);

    if (!foreshadowing) {
      throw new Error(`Foreshadowing not found: ${issue.foreshadowingId}`);
    }

    const prompt = `
当前章节需要呼应伏笔。

伏笔信息：
- ID: ${foreshadowing.id}
- 描述：${foreshadowing.description}
- 原章节：${foreshadowing.chapterId}

请在本章中自然地呼应这个伏笔，不要过于生硬。
`;

    const fixed = await this.aiClient.generateText(prompt, { maxTokens: 2000 });

    return {
      content: fixed,
      action: '呼应伏笔'
    };
  }
}
