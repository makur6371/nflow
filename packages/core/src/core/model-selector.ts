/**
 * 模型选择系统
 * 
 * 为不同任务选择最优模型
 */

import { AIClient, AIModel, AIConfig } from '../ai/client';
import { AuthManager } from '../auth/auth-manager';

export interface ModelSelection {
  model: string;
  reasoningMode: string;
  effortLevel: string;
  provider: string;
  isFree: boolean;
}

export interface TaskType {
  category: 'outline' | 'character' | 'scene' | 'writing' | 'polish' | 'review';
  complexity: 'low' | 'medium' | 'high';
  requiresReasoning: boolean;
  requiresCreativity: boolean;
}

/**
 * 模型选择器
 */
export class ModelSelector {
  private authManager: AuthManager;

  constructor(authManager: AuthManager) {
    this.authManager = authManager;
  }

  /**
   * 为任务选择最佳模型
   */
  async selectBestModel(task: TaskType): Promise<ModelSelection> {
    const agentId = `${task.category}-agent`;
    const agentConfig = this.authManager.getAgentModelConfig(agentId);

    if (agentConfig) {
      // 使用 Agent 配置
      return await this.selectModelByConfig(agentConfig);
    }

    // 根据任务类型选择模型
    return await this.selectModelByTask(task);
  }

  /**
   * 根据 Agent 配置选择模型
   */
  private async selectModelByConfig(
    config: any
  ): Promise<ModelSelection> {
    // 尝试主模型
    if (await this.isModelAvailable(config.primary)) {
      return {
        model: config.primary,
        reasoningMode: config.reasoning || 'adaptive-thinking',
        effortLevel: config.effort || 'medium',
        provider: this.getProvider(config.primary),
        isFree: this.isFreeModel(config.primary)
      };
    }

    // 尝试备用模型
    if (await this.isModelAvailable(config.fallback)) {
      return {
        model: config.fallback,
        reasoningMode: config.reasoning || 'adaptive-thinking',
        effortLevel: config.effort || 'medium',
        provider: this.getProvider(config.fallback),
        isFree: this.isFreeModel(config.fallback)
      };
    }

    // 使用默认免费模型
    return await this.selectDefaultFreeModel();
  }

  /**
   * 根据任务类型选择模型
   */
  private async selectModelByTask(task: TaskType): Promise<ModelSelection> {
    // 根据任务复杂度和需求选择模型
    const models = this.authManager.getAllAvailableModels();

    // 优先使用免费模型
    const freeModels = models.filter(m => m.isFree && m.available);
    if (freeModels.length > 0) {
      const model = this.selectBestFreeModelForTask(freeModels, task);
      return {
        model: model.id,
        reasoningMode: this.selectReasoningMode(task),
        effortLevel: this.selectEffortLevel(task),
        provider: model.provider,
        isFree: true
      };
    }

    // 使用付费模型
    const paidModels = models.filter(m => !m.isFree && m.available);
    if (paidModels.length > 0) {
      const model = this.selectBestPaidModelForTask(paidModels, task);
      return {
        model: model.id,
        reasoningMode: this.selectReasoningMode(task),
        effortLevel: this.selectEffortLevel(task),
        provider: model.provider,
        isFree: false
      };
    }

    // 使用默认模型
    return await this.selectDefaultFreeModel();
  }

  /**
   * 为任务选择最佳免费模型
   */
  private selectBestFreeModelForTask(
    models: AIModel[],
    task: TaskType
  ): AIModel {
    // 根据任务类型选择
    switch (task.category) {
      case 'outline':
        // 大纲生成需要强推理能力
        return models.find(m => m.id === 'Qwen3-Coder') || models[0];
      case 'character':
        // 人物创建需要创造力
        return models.find(m => m.id === 'GLM-4.6') || models[0];
      case 'scene':
        // 场景描写需要平衡
        return models.find(m => m.id === 'DeepSeek-v3') || models[0];
      case 'writing':
        // 写作需要效率和质量平衡
        return models.find(m => m.id === 'Qwen3-Coder') || models[0];
      case 'polish':
        // 润色需要语言能力
        return models.find(m => m.id === 'DeepSeek-v3') || models[0];
      case 'review':
        // 审核需要推理能力
        return models.find(m => m.id === 'Qwen3-Coder') || models[0];
      default:
        return models[0];
    }
  }

  /**
   * 为任务选择最佳付费模型
   */
  private selectBestPaidModelForTask(
    models: AIModel[],
    task: TaskType
  ): AIModel {
    // 根据任务类型选择
    switch (task.category) {
      case 'outline':
        // 大纲生成需要最强模型
        return models.find(m => m.id === 'claude-4-opus') || models[0];
      case 'character':
        // 人物创建需要强创造力
        return models.find(m => m.id === 'claude-4-opus') || models[0];
      case 'scene':
        // 场景描写需要平衡
        return models.find(m => m.id === 'claude-4-sonnet') || models[0];
      case 'writing':
        // 写作需要效率
        return models.find(m => m.id === 'claude-4-sonnet') || models[0];
      case 'polish':
        // 润色需要语言能力
        return models.find(m => m.id === 'claude-4-sonnet') || models[0];
      case 'review':
        // 审核需要推理能力
        return models.find(m => m.id === 'gpt-4.5') || models[0];
      default:
        return models[0];
    }
  }

  /**
   * 选择推理模式
   */
  private selectReasoningMode(task: TaskType): string {
    if (task.requiresReasoning) {
      if (task.complexity === 'high') {
        return 'extended-thinking';
      } else {
        return 'adaptive-thinking';
      }
    }
    return 'standard';
  }

  /**
   * 选择努力级别
   */
  private selectEffortLevel(task: TaskType): string {
    switch (task.complexity) {
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
      default:
        return 'medium';
    }
  }

  /**
   * 选择默认免费模型
   */
  private async selectDefaultFreeModel(): Promise<ModelSelection> {
    return {
      model: 'Qwen3-Coder',
      reasoningMode: 'adaptive-thinking',
      effortLevel: 'medium',
      provider: 'iflow',
      isFree: true
    };
  }

  /**
   * 检查模型是否可用
   */
  private async isModelAvailable(modelId: string): Promise<boolean> {
    const models = this.authManager.getAllAvailableModels();
    const model = models.find(m => m.id === modelId);
    return model?.available || false;
  }

  /**
   * 获取模型提供商
   */
  private getProvider(modelId: string): string {
    if (modelId.startsWith('Qwen') || modelId.startsWith('Kimi') || 
        modelId.startsWith('DeepSeek') || modelId.startsWith('GLM')) {
      return 'iflow';
    } else if (modelId.startsWith('gpt')) {
      return 'openai';
    } else if (modelId.startsWith('claude')) {
      return 'anthropic';
    }
    return 'unknown';
  }

  /**
   * 检查是否为免费模型
   */
  private isFreeModel(modelId: string): boolean {
    const provider = this.getProvider(modelId);
    return provider === 'iflow';
  }

  /**
   * 创建 AI 客户端
   */
  async createClientForSelection(selection: ModelSelection): Promise<AIClient | null> {
    return await this.authManager.selectBestModelForAgent(
      selection.provider
    );
  }
}