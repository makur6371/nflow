/**
 * 代理注册表
 */

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  allowedTools: string[];
  modelConfig: {
    primary: string;
    fallback: string;
    reasoning?: string;
  };
}

export const AGENT_DEFINITIONS: Record<string, AgentDefinition> = {
  'outline-agent': {
    id: 'outline-agent',
    name: 'Outline Agent',
    description: 'Generates novel outlines and chapter plans',
    systemPrompt: `You are a professional novel outline specialist. Your task is to create detailed chapter outlines that maintain narrative coherence and pacing.`,
    allowedTools: ['outline-tool', 'memory', 'search'],
    modelConfig: {
      primary: 'claude-4-opus',
      fallback: 'Qwen3-Coder',
      reasoning: 'extended-thinking'
    }
  },
  'character-agent': {
    id: 'character-agent',
    name: 'Character Agent',
    description: 'Creates and manages novel characters',
    systemPrompt: `You are a professional character designer. Your task is to create rich, believable characters with depth and consistency.`,
    allowedTools: ['character-tool', 'memory', 'search'],
    modelConfig: {
      primary: 'claude-4-opus',
      fallback: 'GLM-4.6',
      reasoning: 'extended-thinking'
    }
  },
  'scene-agent': {
    id: 'scene-agent',
    name: 'Scene Agent',
    description: 'Creates vivid scene descriptions',
    systemPrompt: `You are a professional scene designer. Your task is to create immersive, vivid scenes that engage the reader's senses.`,
    allowedTools: ['scene-tool', 'memory', 'search'],
    modelConfig: {
      primary: 'claude-4-sonnet',
      fallback: 'DeepSeek-v3',
      reasoning: 'adaptive-thinking'
    }
  },
  'writing-agent': {
    id: 'writing-agent',
    name: 'Writing Agent',
    description: 'Writes novel chapters and prose',
    systemPrompt: `You are a professional novel writer. Your task is to write engaging, well-structured chapters that advance the plot and develop characters.`,
    allowedTools: ['word-count-tool', 'memory', 'consistency-check'],
    modelConfig: {
      primary: 'claude-4-sonnet',
      fallback: 'Qwen3-Coder',
      reasoning: 'adaptive-thinking'
    }
  },
  'polish-agent': {
    id: 'polish-agent',
    name: 'Polish Agent',
    description: 'Polishes and improves novel prose',
    systemPrompt: `You are a professional editor. Your task is to polish novel prose to make it more engaging and refined.`,
    allowedTools: ['memory', 'search'],
    modelConfig: {
      primary: 'claude-4-sonnet',
      fallback: 'DeepSeek-v3',
      reasoning: 'adaptive-thinking'
    }
  },
  'review-agent': {
    id: 'review-agent',
    name: 'Review Agent',
    description: 'Reviews novel content for quality and consistency',
    systemPrompt: `You are a professional editor and reviewer. Your task is to review novel content for quality, consistency, and narrative coherence.`,
    allowedTools: ['consistency-check', 'word-count-tool', 'memory', 'search'],
    modelConfig: {
      primary: 'gpt-4.5',
      fallback: 'Qwen3-Coder',
      reasoning: 'extended-thinking'
    }
  }
};

/**
 * 获取代理定义
 */
export function getAgentDefinition(agentId: string): AgentDefinition | undefined {
  return AGENT_DEFINITIONS[agentId];
}

/**
 * 列出所有代理
 */
export function listAgents(): AgentDefinition[] {
  return Object.values(AGENT_DEFINITIONS);
}