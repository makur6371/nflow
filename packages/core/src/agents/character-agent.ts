/**
 * 人物代理
 */

import { getAgentDefinition } from './agent-registry';
import { AIClient } from '../ai/client';
import { CharacterTool } from '../tools/character-tool';
import { NovelRepository } from '../database/repository';

export interface CharacterAgentParams {
  name?: string;
  role?: string;
  personality?: string;
  background?: string;
  traits?: string[];
  relationships?: Record<string, string>;
  action: 'create' | 'update' | 'get' | 'list';
  id?: string;
}

export interface CharacterAgentResult {
  success: boolean;
  character?: any;
  characters?: any[];
  error?: string;
}

export class CharacterAgent {
  private definition = getAgentDefinition('character-agent');
  private aiClient: AIClient;
  private characterTool: CharacterTool;
  private repository: NovelRepository;

  constructor(aiClient: AIClient, repository: NovelRepository) {
    this.aiClient = aiClient;
    this.characterTool = new CharacterTool();
    this.repository = repository;
  }

  async createCharacter(params: CharacterAgentParams): Promise<CharacterAgentResult> {
    try {
      // 调用 AI 创建人物
      const characterData = await this.aiClient.createCharacter({
        name: params.name,
        role: params.role || '配角',
        personality: params.personality,
        background: params.background
      });

      // 保存到数据库
      const character = this.repository.saveCharacter(characterData);

      return {
        success: true,
        character
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateCharacter(params: CharacterAgentParams): Promise<CharacterAgentResult> {
    try {
      if (!params.id) {
        return {
          success: false,
          error: 'Character ID is required for update'
        };
      }

      // 调用 AI 更新人物信息
      const characterData = await this.aiClient.createCharacter({
        name: params.name,
        role: params.role,
        personality: params.personality,
        background: params.background
      });

      // 更新数据库
      const character = this.repository.updateCharacter(params.id, characterData);

      if (!character) {
        return {
          success: false,
          error: 'Character not found'
        };
      }

      return {
        success: true,
        character
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getCharacter(params: CharacterAgentParams): Promise<CharacterAgentResult> {
    try {
      if (!params.id) {
        return {
          success: false,
          error: 'Character ID is required'
        };
      }

      const character = this.repository.getCharacter(params.id);

      if (!character) {
        return {
          success: false,
          error: 'Character not found'
        };
      }

      return {
        success: true,
        character
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async listCharacters(): Promise<CharacterAgentResult> {
    try {
      const characters = this.repository.getAllCharacters();

      return {
        success: true,
        characters
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}