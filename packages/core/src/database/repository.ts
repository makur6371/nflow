/**
 * 数据访问层
 */

import { getDatabase, saveDatabase, Database } from './index';

export class NovelRepository {
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getDb(): Database {
    const db = getDatabase();
    if (!db) throw new Error('Database not initialized');
    return db;
  }

  // ========== 人物相关操作 ==========

  saveCharacter(character: {
    name: string;
    role: string;
    personality?: string;
    background?: string;
    traits?: string[];
    relationships?: Record<string, string>;
  }): any {
    const db = this.getDb();
    const id = this.generateId();

    const newCharacter = {
      id,
      name: character.name,
      role: character.role,
      personality: character.personality || '',
      background: character.background || '',
      traits: character.traits || [],
      relationships: character.relationships || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.characters[id] = newCharacter;
    saveDatabase();
    return newCharacter;
  }

  getCharacter(id: string): any {
    const db = this.getDb();
    return db.characters[id] || null;
  }

  getCharacterByName(name: string): any {
    const db = this.getDb();
    return Object.values(db.characters).find((c: any) => c.name === name) || null;
  }

  getAllCharacters(): any[] {
    const db = this.getDb();
    return Object.values(db.characters);
  }

  updateCharacter(id: string, updates: Partial<any>): any {
    const db = this.getDb();
    if (!db.characters[id]) return null;

    db.characters[id] = {
      ...db.characters[id],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDatabase();
    return db.characters[id];
  }

  deleteCharacter(id: string): boolean {
    const db = this.getDb();
    if (!db.characters[id]) return false;

    delete db.characters[id];
    saveDatabase();
    return true;
  }

  // ========== 章节相关操作 ==========

  saveChapter(chapter: {
    title: string;
    orderIndex: number;
    summary?: string;
    content?: string;
    status?: 'draft' | 'completed' | 'published';
  }): any {
    const db = this.getDb();
    const id = this.generateId();

    const newChapter = {
      id,
      title: chapter.title,
      orderIndex: chapter.orderIndex,
      wordCount: 0,
      summary: chapter.summary || '',
      content: chapter.content || '',
      status: chapter.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 计算字数
    newChapter.wordCount = this.countWords(newChapter.content);

    db.chapters[id] = newChapter;
    saveDatabase();
    return newChapter;
  }

  getChapter(id: string): any {
    const db = this.getDb();
    return db.chapters[id] || null;
  }

  getChapterByOrderIndex(orderIndex: number): any {
    const db = this.getDb();
    return Object.values(db.chapters).find((c: any) => c.orderIndex === orderIndex) || null;
  }

  getAllChapters(): any[] {
    const db = this.getDb();
    return Object.values(db.chapters).sort((a: any, b: any) => a.orderIndex - b.orderIndex);
  }

  updateChapter(id: string, updates: Partial<any>): any {
    const db = this.getDb();
    if (!db.chapters[id]) return null;

    db.chapters[id] = {
      ...db.chapters[id],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // 如果更新了内容，重新计算字数
    if (updates.content !== undefined) {
      db.chapters[id].wordCount = this.countWords(updates.content);
    }

    saveDatabase();
    return db.chapters[id];
  }

  deleteChapter(id: string): boolean {
    const db = this.getDb();
    if (!db.chapters[id]) return false;

    delete db.chapters[id];
    saveDatabase();
    return true;
  }

  // ========== 场景相关操作 ==========

  saveScene(scene: {
    chapterId: string;
    name: string;
    description?: string;
    location?: string;
    atmosphere?: string;
    characters?: string[];
  }): any {
    const db = this.getDb();
    const id = this.generateId();

    const newScene = {
      id,
      chapterId: scene.chapterId,
      name: scene.name,
      description: scene.description || '',
      location: scene.location || '',
      atmosphere: scene.atmosphere || '',
      characters: scene.characters || [],
      createdAt: new Date().toISOString()
    };

    db.scenes[id] = newScene;
    saveDatabase();
    return newScene;
  }

  getScene(id: string): any {
    const db = this.getDb();
    return db.scenes[id] || null;
  }

  getScenesByChapter(chapterId: string): any[] {
    const db = this.getDb();
    return Object.values(db.scenes).filter((s: any) => s.chapterId === chapterId);
  }

  getAllScenes(): any[] {
    const db = this.getDb();
    return Object.values(db.scenes);
  }

  // ========== 世界观设定操作 ==========

  saveWorldSetting(setting: {
    category: string;
    key: string;
    value: string;
    description?: string;
  }): any {
    const db = this.getDb();
    const id = this.generateId();

    const newSetting = {
      id,
      category: setting.category,
      key: setting.key,
      value: setting.value,
      description: setting.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.worldSettings[id] = newSetting;
    saveDatabase();
    return newSetting;
  }

  getWorldSettingsByCategory(category: string): any[] {
    const db = this.getDb();
    return Object.values(db.worldSettings).filter((s: any) => s.category === category);
  }

  getAllWorldSettings(): any[] {
    const db = this.getDb();
    return Object.values(db.worldSettings);
  }

  // ========== 伏笔操作 ==========

  saveForeshadowing(foreshadowing: {
    chapterId: string;
    description: string;
  }): any {
    const db = this.getDb();
    const id = this.generateId();

    const newForeshadowing = {
      id,
      chapterId: foreshadowing.chapterId,
      description: foreshadowing.description,
      status: 'pending' as const,
      callbackChapterId: null,
      createdAt: new Date().toISOString()
    };

    db.foreshadowings[id] = newForeshadowing;
    saveDatabase();
    return newForeshadowing;
  }

  getPendingForeshadowings(): any[] {
    const db = this.getDb();
    return Object.values(db.foreshadowings).filter((f: any) => f.status === 'pending');
  }

  updateForeshadowing(id: string, updates: Partial<any>): any {
    const db = this.getDb();
    if (!db.foreshadowings[id]) return null;

    db.foreshadowings[id] = {
      ...db.foreshadowings[id],
      ...updates
    };
    saveDatabase();
    return db.foreshadowings[id];
  }

  // ========== 辅助方法 ==========

  private countWords(text: string): number {
    if (!text) return 0;
    // 统计中文字符
    return text.replace(/\s+/g, '').replace(/[^\u4e00-\u9fa5]/g, '').length;
  }

  // ========== 项目元数据 ==========

  getProjectMetadata(): any {
    const db = this.getDb();
    return db.metadata;
  }

  updateProjectMetadata(updates: Partial<any>): any {
    const db = this.getDb();
    db.metadata = {
      ...db.metadata,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDatabase();
    return db.metadata;
  }
}