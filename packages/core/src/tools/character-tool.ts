/**
 * 人物管理工具
 */

import { BaseTool, ToolParams, ToolResult } from './base-tool';
import { NovelRepository } from '../database/repository';

export interface CharacterParams extends ToolParams {
  name?: string;
  role?: string;
  personality?: string;
  background?: string;
  traits?: string[];
  relationships?: Record<string, string>;
  action: 'create' | 'update' | 'get' | 'list';
  id?: string;
}

export interface CharacterResult extends ToolResult {
  character?: {
    id: string;
    name: string;
    role: string;
    personality: string;
    background: string;
    traits: string[];
    relationships: Record<string, string>;
  };
  characters?: any[];
}

export class CharacterTool extends BaseTool<CharacterParams, CharacterResult> {
  private repository: NovelRepository;

  constructor() {
    super(
      'character-tool',
      'Character Manager',
      'Create and manage character profiles',
      '👤'
    );
    this.repository = new NovelRepository();
  }

  async execute(params: CharacterParams): Promise<CharacterResult> {
    try {
      switch (params.action) {
        case 'create':
          return this.createCharacter(params);
        case 'get':
          return this.getCharacter(params);
        case 'list':
          return this.listCharacters();
        case 'update':
          return this.updateCharacter(params);
        default:
          return this.failure('Invalid action');
      }
    } catch (error) {
      return this.failure(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async createCharacter(params: CharacterParams): Promise<CharacterResult> {
    const character = this.repository.saveCharacter({
      name: params.name || 'Unknown',
      role: params.role || 'Supporting',
      personality: params.personality || '',
      background: params.background || '',
      traits: params.traits || [],
      relationships: params.relationships || {}
    });

    return this.success(character);
  }

  private async getCharacter(params: CharacterParams): Promise<CharacterResult> {
    if (!params.id && !params.name) {
      return this.failure('Either id or name is required');
    }

    let character;
    if (params.id) {
      character = this.repository.getCharacter(params.id);
    } else if (params.name) {
      character = this.repository.getCharacterByName(params.name);
    }

    if (!character) {
      return this.failure('Character not found');
    }

    return this.success(character);
  }

  private async listCharacters(): Promise<CharacterResult> {
    const characters = this.repository.getAllCharacters();
    return this.success({ characters });
  }

  private async updateCharacter(params: CharacterParams): Promise<CharacterResult> {
    if (!params.id) {
      return this.failure('Character id is required for update');
    }

    const updates: any = {};
    if (params.name !== undefined) updates.name = params.name;
    if (params.role !== undefined) updates.role = params.role;
    if (params.personality !== undefined) updates.personality = params.personality;
    if (params.background !== undefined) updates.background = params.background;
    if (params.traits !== undefined) updates.traits = params.traits;
    if (params.relationships !== undefined) updates.relationships = params.relationships;

    const character = this.repository.updateCharacter(params.id, updates);

    if (!character) {
      return this.failure('Character not found');
    }

    return this.success(character);
  }
}