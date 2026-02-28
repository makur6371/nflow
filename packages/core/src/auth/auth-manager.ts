/**
 * iflow 认证管理器
 * 
 * 管理认证和模型选择
 */

import { AIClient, AIModel, AIConfig } from '../ai/client';

export interface AuthConfig {
  type: 'iflow' | 'openai' | 'anthropic';
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

export interface AvailableModel extends AIModel {
  available: boolean;
  reason?: string;
}

export interface AgentModelConfig {
  primary: string;
  fallback: string;
  reasoning?: string;
  effort?: string;
}

/**
 * 认证管理器
 */
export class AuthManager {
  private configs: Map<string, AuthConfig> = new Map();
  private selectedAuthType: string = 'iflow';

  // iflow 免费模型列表
  private static readonly IFLOW_MODELS: AIModel[] = [
    { id: 'Qwen3-Coder', name: 'Qwen3 Coder', provider: 'iflow', isFree: true },
    { id: 'Kimi-K2', name: 'Kimi K2', provider: 'iflow', isFree: true },
    { id: 'DeepSeek-v3', name: 'DeepSeek v3', provider: 'iflow', isFree: true },
    { id: 'GLM-4.6', name: 'GLM 4.6', provider: 'iflow', isFree: true }
  ];

  // OpenAI 模型列表
  private static readonly OPENAI_MODELS: AIModel[] = [
    { id: 'gpt-4.5', name: 'GPT-4.5', provider: 'openai', isFree: false },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', isFree: false },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', isFree: false }
  ];

  // Anthropic 模型列表
  private static readonly ANTHROPIC_MODELS: AIModel[] = [
    { id: 'claude-4-opus', name: 'Claude 4 Opus', provider: 'anthropic', isFree: false },
    { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet', provider: 'anthropic', isFree: false },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'anthropic', isFree: false }
  ];

  // Agent 模型配置
  private static readonly AGENT_MODEL_CONFIG: Record<string, AgentModelConfig> = {
    'outline-agent': {
      primary: 'claude-4-opus',
      fallback: 'Qwen3-Coder',
      reasoning: 'extended-thinking'
    },
    'character-agent': {
      primary: 'claude-4-opus',
      fallback: 'GLM-4.6',
      reasoning: 'extended-thinking'
    },
    'scene-agent': {
      primary: 'claude-4-sonnet',
      fallback: 'DeepSeek-v3',
      reasoning: 'adaptive-thinking'
    },
    'writing-agent': {
      primary: 'claude-4-sonnet',
      fallback: 'Qwen3-Coder',
      reasoning: 'adaptive-thinking',
      effort: 'high'
    },
    'polish-agent': {
      primary: 'claude-4-sonnet',
      fallback: 'DeepSeek-v3',
      reasoning: 'adaptive-thinking'
    },
    'review-agent': {
      primary: 'gpt-4.5',
      fallback: 'Qwen3-Coder',
      reasoning: 'extended-thinking'
    }
  };

  /**
   * 初始化认证
   */
  async initializeAuth(): Promise<void> {
    // 从环境变量读取配置
    const iflowApiKey = process.env.IFLOW_API_KEY || process.env.NFLOW_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

    if (iflowApiKey) {
      this.configs.set('iflow', {
        type: 'iflow',
        apiKey: iflowApiKey,
        baseUrl: process.env.IFLOW_BASE_URL || 'https://apis.iflow.cn/v1',
        model: process.env.IFLOW_MODEL || 'Qwen3-Coder'
      });
      this.selectedAuthType = 'iflow';
      console.log('✓ iflow 认证已配置');
    }

    if (openaiApiKey) {
      this.configs.set('openai', {
        type: 'openai',
        apiKey: openaiApiKey,
        baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
        model: process.env.OPENAI_MODEL || 'gpt-4.5'
      });
      console.log('✓ OpenAI 认证已配置');
    }

    if (anthropicApiKey) {
      this.configs.set('anthropic', {
        type: 'anthropic',
        apiKey: anthropicApiKey,
        baseUrl: process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com/v1',
        model: process.env.ANTHROPIC_MODEL || 'claude-4-sonnet'
      });
      console.log('✓ Anthropic 认证已配置');
    }

    if (this.configs.size === 0) {
      console.warn('⚠️  未配置任何认证，请设置环境变量');
      console.warn('  - IFLOW_API_KEY (iflow 认证)');
      console.warn('  - OPENAI_API_KEY (OpenAI 认证)');
      console.warn('  - ANTHROPIC_API_KEY (Anthropic 认证)');
    }
  }

  /**
   * 选择认证类型
   */
  selectAuthType(type: string): boolean {
    if (!this.configs.has(type)) {
      console.error(`认证类型 ${type} 未配置`);
      return false;
    }

    this.selectedAuthType = type;
    console.log(`✓ 已选择认证类型: ${type}`);
    return true;
  }

  /**
   * 获取当前认证配置
   */
  getCurrentConfig(): AuthConfig | null {
    const config = this.configs.get(this.selectedAuthType);
    if (!config) {
      console.error(`当前认证类型 ${this.selectedAuthType} 未配置`);
      return null;
    }
    return config;
  }

  /**
   * 创建 AI 客户端
   */
  createClient(): AIClient | null {
    const config = this.getCurrentConfig();
    if (!config) return null;

    const aiConfig: AIConfig = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || this.getDefaultBaseUrl(config.type),
      model: config.model || this.getDefaultModel(config.type)
    };

    return new AIClient(aiConfig);
  }

  /**
   * 获取可用模型列表
   */
  getAvailableModels(): AvailableModel[] {
    const config = this.getCurrentConfig();
    if (!config) return [];

    let models: AIModel[] = [];

    switch (config.type) {
      case 'iflow':
        models = AuthManager.IFLOW_MODELS;
        break;
      case 'openai':
        models = AuthManager.OPENAI_MODELS;
        break;
      case 'anthropic':
        models = AuthManager.ANTHROPIC_MODELS;
        break;
    }

    return models.map(model => ({
      ...model,
      available: true
    }));
  }

  /**
   * 获取所有可用模型
   */
  getAllAvailableModels(): AvailableModel[] {
    const allModels: AIModel[] = [
      ...AuthManager.IFLOW_MODELS,
      ...AuthManager.OPENAI_MODELS,
      ...AuthManager.ANTHROPIC_MODELS
    ];

    return allModels.map(model => ({
      ...model,
      available: this.configs.has(model.provider)
    }));
  }

  /**
   * 获取 Agent 模型配置
   */
  getAgentModelConfig(agentId: string): AgentModelConfig | null {
    return AuthManager.AGENT_MODEL_CONFIG[agentId] || null;
  }

  /**
   * 为 Agent 选择最佳模型
   */
  async selectBestModelForAgent(agentId: string): Promise<AIClient | null> {
    const config = this.getAgentModelConfig(agentId);
    if (!config) {
      console.error(`Agent ${agentId} 未配置模型`);
      return null;
    }

    // 尝试主模型
    if (await this.isModelAvailable(config.primary)) {
      const client = this.createClientForModel(config.primary);
      if (client) {
        console.log(`✓ Agent ${agentId} 使用模型: ${config.primary}`);
        return client;
      }
    }

    // 尝试备用模型
    if (await this.isModelAvailable(config.fallback)) {
      const client = this.createClientForModel(config.fallback);
      if (client) {
        console.log(`✓ Agent ${agentId} 使用备用模型: ${config.fallback}`);
        return client;
      }
    }

    // 尝试免费的 iflow 模型
    for (const model of AuthManager.IFLOW_MODELS) {
      if (await this.isModelAvailable(model.id)) {
        const client = this.createClientForModel(model.id);
        if (client) {
          console.log(`✓ Agent ${agentId} 使用免费模型: ${model.id}`);
          return client;
        }
      }
    }

    console.error(`Agent ${agentId} 无法找到可用模型`);
    return null;
  }

  /**
   * 检查模型是否可用
   */
  private async isModelAvailable(modelId: string): Promise<boolean> {
    const allModels = this.getAllAvailableModels();
    const model = allModels.find(m => m.id === modelId);
    return model?.available || false;
  }

  /**
   * 为特定模型创建客户端
   */
  private createClientForModel(modelId: string): AIClient | null {
    const allModels = this.getAllAvailableModels();
    const model = allModels.find(m => m.id === modelId);

    if (!model || !model.available) return null;

    const config = this.configs.get(model.provider);
    if (!config) return null;

    const aiConfig: AIConfig = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || this.getDefaultBaseUrl(config.type),
      model: modelId
    };

    return new AIClient(aiConfig);
  }

  /**
   * 获取默认 Base URL
   */
  private getDefaultBaseUrl(type: string): string {
    switch (type) {
      case 'iflow':
        return 'https://apis.iflow.cn/v1';
      case 'openai':
        return 'https://api.openai.com/v1';
      case 'anthropic':
        return 'https://api.anthropic.com/v1';
      default:
        return '';
    }
  }

  /**
   * 获取默认模型
   */
  private getDefaultModel(type: string): string {
    switch (type) {
      case 'iflow':
        return 'Qwen3-Coder';
      case 'openai':
        return 'gpt-4.5';
      case 'anthropic':
        return 'claude-4-sonnet';
      default:
        return '';
    }
  }
}