/**
 * 数据模型
 */

// 人物模型
export interface Character {
  id: string;
  name: string;
  role: string;
  personality: string;
  background: string;
  traits: string[];
  relationships: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

// 章节模型
export interface Chapter {
  id: string;
  title: string;
  orderIndex: number;
  wordCount: number;
  summary: string;
  content: string;
  status: 'draft' | 'completed' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

// 场景模型
export interface Scene {
  id: string;
  chapterId: string;
  name: string;
  description: string;
  location: string;
  atmosphere: string;
  characters: string[];
  createdAt: Date;
}

// 世界观设定模型
export interface WorldSetting {
  id: string;
  category: string;
  key: string;
  value: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// 伏笔模型
export interface Foreshadowing {
  id: string;
  chapterId: string;
  description: string;
  status: 'pending' | 'called';
  callbackChapterId?: string;
  createdAt: Date;
}

// 情节分支模型
export interface PlotBranch {
  id: string;
  parentId?: string;
  chapterId: string;
  content: string;
  style: string;
  createdAt: Date;
  updatedAt: Date;
  isSelected: boolean;
}

// 模板模型
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  tags: string[];
  rating: number;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 生成器模型
export interface Generator {
  id: string;
  name: string;
  description: string;
  category: string;
  prompt: string;
  requiredContext?: string;
  outputFormat?: string;
  createdAt: Date;
  updatedAt: Date;
}