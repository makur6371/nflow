/**
 * nflow Core 模块
 * 提供小说创作的核心功能
 */

export * from './tools/index.js';
export * from './agents/index.js';
export * from './database/index.js';
export * from './models/index.js';
export * from './ai/index.js';

// 生成器系统
export { GeneratorRegistry, type Generator, type GeneratorResult } from './generators/index.js';

// 模板系统
export { TemplateRegistry, type Template, type TemplateUsage } from './templates/index.js';

// 多线剧情系统
export { PlotBranchManager, type PlotBranch, type PlotBranchRelation, type PlotBranchComparison } from './plot/index.js';

// 章节节奏表
export { RhythmManager, type RhythmPoint, type ChapterRhythm, type RhythmAnalysis } from './rhythm/index.js';

// 核心机制
export { PreWritingContext, RealTimeChecker, PostWritingReviewer, type FullContext, type CheckResult, type FullReviewResult } from './core/triple-review.js';
export { QualityControlLoop, type LoopLog, type QualityControlResult } from './core/quality-control-loop.js';
export { AutoFixer, type Issue, type Fix, type FixLog, type FixResult } from './core/auto-fixer.js';
export { ModelSelector, type ModelSelection, type TaskType } from './core/model-selector.js';

// 认证系统
export { AuthManager, type AuthConfig, type AvailableModel, type AgentModelConfig } from './auth/auth-manager.js';

// 版本信息
export const CORE_VERSION = '1.0.0';