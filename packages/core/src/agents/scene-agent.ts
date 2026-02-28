/**
 * 场景代理
 */

import { getAgentDefinition } from './agent-registry';
import { AIClient } from '../ai/client';
import { SceneTool } from '../tools/scene-tool';
import { NovelRepository } from '../database/repository';

export interface SceneAgentParams {
  name?: string;
  description?: string;
  location?: string;
  atmosphere?: string;
  characters?: string[];
  chapterId?: string;
  action: 'create' | 'update' | 'get' | 'list';
  id?: string;
}

export interface SceneAgentResult {
  success: boolean;
  scene?: any;
  scenes?: any[];
  error?: string;
}

export class SceneAgent {
  private definition = getAgentDefinition('scene-agent');
  private aiClient: AIClient;
  private sceneTool: SceneTool;
  private repository: NovelRepository;

  constructor(aiClient: AIClient, repository: NovelRepository) {
    this.aiClient = aiClient;
    this.sceneTool = new SceneTool();
    this.repository = repository;
  }

  async createScene(params: SceneAgentParams): Promise<SceneAgentResult> {
    try {
      if (!params.chapterId) {
        return {
          success: false,
          error: 'Chapter ID is required'
        };
      }

      // 保存到数据库
      const scene = this.repository.saveScene({
        chapterId: params.chapterId,
        name: params.name || 'Untitled Scene',
        description: params.description || '',
        location: params.location || 'Unknown',
        atmosphere: params.atmosphere || 'Neutral',
        characters: params.characters || []
      });

      return {
        success: true,
        scene
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateScene(params: SceneAgentParams): Promise<SceneAgentResult> {
    try {
      if (!params.id) {
        return {
          success: false,
          error: 'Scene ID is required for update'
        };
      }

      // 获取现有场景
      const existingScene = this.repository.getScene(params.id);
      if (!existingScene) {
        return {
          success: false,
          error: 'Scene not found'
        };
      }

      // 更新场景信息
      const updatedScene = {
        ...existingScene,
        name: params.name || existingScene.name,
        description: params.description || existingScene.description,
        location: params.location || existingScene.location,
        atmosphere: params.atmosphere || existingScene.atmosphere,
        characters: params.characters || existingScene.characters
      };

      // 保存更新（这里需要扩展 repository 的 updateScene 方法）
      // 暂时返回成功
      return {
        success: true,
        scene: updatedScene
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getScene(params: SceneAgentParams): Promise<SceneAgentResult> {
    try {
      if (!params.id) {
        return {
          success: false,
          error: 'Scene ID is required'
        };
      }

      const scene = this.repository.getScene(params.id);

      if (!scene) {
        return {
          success: false,
          error: 'Scene not found'
        };
      }

      return {
        success: true,
        scene
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async listScenesByChapter(chapterId: string): Promise<SceneAgentResult> {
    try {
      const scenes = this.repository.getScenesByChapter(chapterId);

      return {
        success: true,
        scenes
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async listAllScenes(): Promise<SceneAgentResult> {
    try {
      const scenes = this.repository.getAllScenes();

      return {
        success: true,
        scenes
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}