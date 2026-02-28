/**
 * 数据库模块 - 基于 JSON 文件存储
 */

import * as fs from 'fs';
import * as path from 'path';

export * from './schema';
export * from './repository';

export interface Database {
  characters: Record<string, any>;
  chapters: Record<string, any>;
  scenes: Record<string, any>;
  worldSettings: Record<string, any>;
  foreshadowings: Record<string, any>;
  plotBranches: Record<string, any>;
  templates: Record<string, any>;
  generators: Record<string, any>;
  metadata: {
    projectId: string;
    projectName: string;
    createdAt: string;
    updatedAt: string;
  };
}

let db: Database | null = null;
let dbPath: string = '';

const DEFAULT_DB: Database = {
  characters: {},
  chapters: {},
  scenes: {},
  worldSettings: {},
  foreshadowings: {},
  plotBranches: {},
  templates: {},
  generators: {},
  metadata: {
    projectId: '',
    projectName: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

/**
 * 初始化数据库
 */
export async function initDatabase(path: string = 'novel-data.json'): Promise<Database> {
  dbPath = path;

  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath, 'utf-8');
    db = JSON.parse(data);
  } else {
    db = JSON.parse(JSON.stringify(DEFAULT_DB));
    saveDatabase();
  }

  // 确保 db 不为 null
  if (!db) {
    db = JSON.parse(JSON.stringify(DEFAULT_DB));
  }

  // 使用类型断言，因为我们在上面确保了 db 不为 null
  return db as Database;
}

/**
 * 保存数据库到文件
 */
export function saveDatabase(): void {
  if (!db || !dbPath) return;

  db.metadata.updatedAt = new Date().toISOString();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

/**
 * 获取数据库实例
 */
export function getDatabase(): Database | null {
  return db;
}

/**
 * 关闭数据库
 */
export function closeDatabase(): void {
  saveDatabase();
  db = null;
  dbPath = '';
}

/**
 * 创建项目元数据
 */
export function createProjectMetadata(name: string): void {
  if (!db) return;

  db.metadata = {
    projectId: generateId(),
    projectName: name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  saveDatabase();
}

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 获取所有数据
 */
export function getAllData(): Database | null {
  return db;
}

/**
 * 检查数据库是否已初始化
 */
export function isDatabaseInitialized(): boolean {
  return db !== null;
}