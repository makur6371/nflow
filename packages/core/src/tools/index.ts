/**
 * 工具系统
 */

// 基础工具类
export * from './base-tool.js';

// 小说创作工具
export * from './outline-tool.js';
export * from './character-tool.js';
export * from './scene-tool.js';
export * from './consistency-check.js';
export * from './word-count-tool.js';

// 工具注册表
export const coreTools = [
  // TODO: 注册工具实例
  // new OutlineTool(),
  // new CharacterTool(),
  // new SceneTool(),
  // new ConsistencyCheckTool(),
  // new WordCountTool(),
];