/**
 * AI 客户端 - 支持 iflow 免费模型
 */

import OpenAI from 'openai';

export interface AIModel {
  id: string;
  name: string;
  provider: 'iflow' | 'openai' | 'anthropic';
  isFree: boolean;
}

export interface AIConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export class AIClient {
  private client: OpenAI | null = null;
  private config: AIConfig | null = null;

  // iflow 免费模型列表
  private static readonly IFLOW_MODELS: AIModel[] = [
    { id: 'Qwen3-Coder', name: 'Qwen3 Coder', provider: 'iflow', isFree: true },
    { id: 'Kimi-K2', name: 'Kimi K2', provider: 'iflow', isFree: true },
    { id: 'DeepSeek-v3', name: 'DeepSeek v3', provider: 'iflow', isFree: true },
    { id: 'GLM-4.6', name: 'GLM 4.6', provider: 'iflow', isFree: true }
  ];

  constructor(config?: AIConfig) {
    if (config) {
      this.init(config);
    }
  }

  /**
   * 初始化客户端
   */
  init(config: AIConfig): void {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl
    });
  }

  /**
   * 生成文本
   */
  async generateText(prompt: string, options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }): Promise<string> {
    if (!this.client || !this.config) {
      throw new Error('AI client not initialized');
    }

    try {
      const response = await this.client.chat.completions.create({
        model: options?.model || this.config.model,
        messages: [
          { role: 'system', content: '你是一个专业的小说创作助手。' },
          { role: 'user', content: prompt }
        ],
        max_tokens: options?.maxTokens || 2000,
        temperature: options?.temperature || 0.7
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    }
  }

  /**
   * 生成大纲
   */
  async generateOutline(params: {
    genre?: string;
    theme?: string;
    chapterCount?: number;
    description?: string;
  }): Promise<any> {
    const prompt = `请为以下小说创作需求生成详细的大纲：

题材：${params.genre || '未指定'}
主题：${params.theme || '未指定'}
章节数：${params.chapterCount || 10}
描述：${params.description || ''}

请生成JSON格式的大纲，包含：
- title: 小说标题
- summary: 故事简介
- chapters: 章节数组，每个章节包含：
  - number: 章节编号
  - title: 章节标题
  - summary: 章节摘要
  - keyEvents: 关键事件列表`;

    const response = await this.generateText(prompt, { maxTokens: 3000 });

    try {
      return JSON.parse(response);
    } catch {
      // 如果无法解析为 JSON，返回文本形式
      return {
        title: '生成的小说',
        summary: params.description || '',
        chapters: []
      };
    }
  }

  /**
   * 创建人物
   */
  async createCharacter(params: {
    name?: string;
    role?: string;
    personality?: string;
    background?: string;
  }): Promise<any> {
    const prompt = `请为小说创建一个人物：

姓名：${params.name || '待定'}
角色：${params.role || '配角'}
性格：${params.personality || '待定'}
背景：${params.background || '待定'}

请生成JSON格式的人物档案，包含：
- name: 姓名
- role: 角色（主角/反派/配角）
- personality: 性格描述
- background: 背景故事
- traits: 性格特征列表
- relationships: 人物关系（如果有其他人物）`;

    const response = await this.generateText(prompt, { maxTokens: 1500 });

    try {
      return JSON.parse(response);
    } catch {
      return {
        name: params.name || '未命名',
        role: params.role || '配角',
        personality: params.personality || '',
        background: params.background || '',
        traits: [],
        relationships: {}
      };
    }
  }

  /**
   * 写作章节
   */
  async writeChapter(params: {
    title: string;
    summary: string;
    context?: string;
    targetWordCount?: number;
  }): Promise<string> {
    const targetWordCount = params.targetWordCount || 2200;

    const prompt = `请根据以下信息创作小说章节：

章节标题：${params.title}
章节摘要：${params.summary}
目标字数：${targetWordCount}字

上下文信息：
${params.context || '这是一个新的开始。'}

写作要求：
1. 字数控制在${targetWordCount - 100}到${targetWordCount + 100}字之间
2. 保持情节连贯，逻辑清晰
3. 人物表现符合设定
4. 语言生动，有画面感
5. 节奏适中，张弛有度

请直接输出章节内容，不要包含任何其他说明。`;

    return this.generateText(prompt, { maxTokens: targetWordCount + 500, temperature: 0.8 });
  }

  /**
   * 润色文本
   */
  async polishText(text: string): Promise<string> {
    const prompt = `请润色以下小说文本，提升其质量：

原文：
${text}

润色要求：
1. 优化语言表达，使其更流畅优美
2. 增强画面感和感染力
3. 调整节奏和韵律
4. 保持原意不变
5. 不要增加新的情节内容

请直接输出润色后的文本，不要包含任何其他说明。`;

    return this.generateText(prompt, { maxTokens: text.length + 500 });
  }

  /**
   * 审核内容
   */
  async reviewContent(content: string): Promise<{
    score: number;
    dimensions: Record<string, number>;
    issues: Array<{ type: string; description: string; severity: 'low' | 'medium' | 'high' }>;
  }> {
    const prompt = `请审核以下小说章节内容：

内容：
${content}

请从以下维度进行审核并打分（0-100分）：
1. 人物一致性（30%）：人物性格、行为是否符合设定
2. 情节逻辑（25%）：情节发展是否合理，有无漏洞
3. 世界观设定（20%）：是否违反世界观规则
4. 时间线（15%）：时间顺序是否正确
5. 伏笔呼应（10%）：伏笔是否被呼应

请识别出所有问题，包括：
- 类型（人物OOC/逻辑漏洞/设定冲突/时间线错误/伏笔遗漏）
- 描述
- 严重程度（low/medium/high）

请以JSON格式输出审核结果：
{
  "score": 总分,
  "dimensions": {
    "characterConsistency": 分数,
    "plotLogic": 分数,
    "worldSetting": 分数,
    "timeline": 分数,
    "foreshadowing": 分数
  },
  "issues": [
    {
      "type": "问题类型",
      "description": "问题描述",
      "severity": "严重程度"
    }
  ]
}`;

    const response = await this.generateText(prompt, { maxTokens: 2000 });

    try {
      return JSON.parse(response);
    } catch {
      return {
        score: 70,
        dimensions: {
          characterConsistency: 70,
          plotLogic: 70,
          worldSetting: 70,
          timeline: 70,
          foreshadowing: 70
        },
        issues: []
      };
    }
  }

  /**
   * 扩展字数
   */
  async expandContent(content: string, targetWordCount: number): Promise<string> {
    const currentCount = content.replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5]/g, '').length;
    const needed = targetWordCount - currentCount;

    if (needed <= 0) return content;

    const prompt = `请扩展以下章节内容，使其达到目标字数：

当前字数：${currentCount}字
目标字数：${targetWordCount}字
需要增加：${needed}字

原章节：
${content}

扩展要求：
1. 保持原有内容和风格
2. 重点增加：
   - 环境描写细节
   - 人物心理活动
   - 动作描写
   - 感官体验
3. 自然融入，不显突兀
4. 保持情节连贯

请直接输出扩展后的章节内容。`;

    return this.generateText(prompt, { maxTokens: targetWordCount + 500 });
  }

  /**
   * 压缩字数
   */
  async compressContent(content: string, targetWordCount: number): Promise<string> {
    const currentCount = content.replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5]/g, '').length;
    const excess = currentCount - targetWordCount;

    if (excess <= 0) return content;

    const prompt = `请压缩以下章节内容，使其达到目标字数：

当前字数：${currentCount}字
目标字数：${targetWordCount}字
需要删除：${excess}字

原章节：
${content}

压缩要求：
1. 保持核心情节和风格
2. 重点精简：
   - 冗余描写
   - 相似段落
   - 重复信息
   - 冗余对话
3. 保留关键信息
4. 保持语言流畅

请直接输出压缩后的章节内容。`;

    return this.generateText(prompt, { maxTokens: targetWordCount + 300 });
  }

  /**
   * 获取可用模型列表
   */
  static getAvailableModels(): AIModel[] {
    return this.IFLOW_MODELS;
  }

  /**
   * 检查是否已初始化
   */
  isInitialized(): boolean {
    return this.client !== null && this.config !== null;
  }
}