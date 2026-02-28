/**
 * 多线剧情系统
 * 
 * 管理多条剧情线索的并行发展和交汇
 */

import { NovelRepository } from '../database/repository';

export interface PlotBranch {
  id: string;
  parentId?: string;
  chapterId: string;
  name: string;
  description: string;
  content: string;
  style: 'action' | 'romance' | 'mystery' | 'drama' | 'comedy';
  status: 'draft' | 'active' | 'completed' | 'discarded';
  createdAt: string;
  updatedAt: string;
  isSelected: boolean;
}

export interface PlotBranchRelation {
  id: string;
  fromBranchId: string;
  toBranchId: string;
  relationType: 'parallel' | 'converge' | 'diverge' | 'conflict' | 'support';
  description: string;
}

export interface PlotBranchComparison {
  branchId: string;
  differences: string[];
  similarities: string[];
  recommendation: string;
}

export class PlotBranchManager {
  private repository: NovelRepository;

  constructor(repository: NovelRepository) {
    this.repository = repository;
  }

  /**
   * 创建新分支
   */
  createBranch(params: {
    chapterId: string;
    name: string;
    description: string;
    content: string;
    style?: PlotBranch['style'];
    parentId?: string;
  }): PlotBranch {
    const id = this.generateId();

    const branch: PlotBranch = {
      id,
      parentId: params.parentId,
      chapterId: params.chapterId,
      name: params.name,
      description: params.description,
      content: params.content,
      style: params.style || 'drama',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSelected: false
    };

    // 保存到数据库（需要扩展 repository）
    // this.repository.savePlotBranch(branch);

    return branch;
  }

  /**
   * 获取章节的所有分支
   */
  getBranchesByChapter(chapterId: string): PlotBranch[] {
    // 从数据库获取
    // return this.repository.getPlotBranchesByChapter(chapterId);
    return [];
  }

  /**
   * 获取选中的分支
   */
  getSelectedBranch(chapterId: string): PlotBranch | null {
    const branches = this.getBranchesByChapter(chapterId);
    return branches.find(b => b.isSelected) || null;
  }

  /**
   * 选择分支
   */
  selectBranch(branchId: string, chapterId: string): void {
    const branches = this.getBranchesByChapter(chapterId);
    
    // 取消其他分支的选择
    branches.forEach(b => b.isSelected = false);
    
    // 选择指定分支
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      branch.isSelected = true;
      branch.status = 'active';
    }

    // 更新数据库
    // this.repository.updatePlotBranches(chapterId, branches);
  }

  /**
   * 分支对比
   */
  compareBranches(branchId1: string, branchId2: string): PlotBranchComparison {
    const branch1 = this.getBranchById(branchId1);
    const branch2 = this.getBranchById(branchId2);

    if (!branch1 || !branch2) {
      throw new Error('Branch not found');
    }

    const differences = this.findDifferences(branch1, branch2);
    const similarities = this.findSimilarities(branch1, branch2);
    const recommendation = this.generateRecommendation(branch1, branch2);

    return {
      branchId: branchId2,
      differences,
      similarities,
      recommendation
    };
  }

  /**
   * 合并分支
   */
  mergeBranches(sourceBranchId: string, targetBranchId: string): PlotBranch {
    const sourceBranch = this.getBranchById(sourceBranchId);
    const targetBranch = this.getBranchById(targetBranchId);

    if (!sourceBranch || !targetBranch) {
      throw new Error('Branch not found');
    }

    // 合并内容
    const mergedContent = this.mergeContent(sourceBranch.content, targetBranch.content);

    // 更新目标分支
    targetBranch.content = mergedContent;
    targetBranch.updatedAt = new Date().toISOString();
    targetBranch.status = 'completed';

    // 标记源分支为已丢弃
    sourceBranch.status = 'discarded';
    sourceBranch.isSelected = false;

    // 更新数据库
    // this.repository.updatePlotBranch(targetBranch);
    // this.repository.updatePlotBranch(sourceBranch);

    return targetBranch;
  }

  /**
   * 创建分支关系
   */
  createBranchRelation(relation: PlotBranchRelation): void {
    // 保存关系到数据库
    // this.repository.savePlotBranchRelation(relation);
  }

  /**
   * 获取分支关系
   */
  getBranchRelations(branchId: string): PlotBranchRelation[] {
    // 从数据库获取
    // return this.repository.getPlotBranchRelations(branchId);
    return [];
  }

  /**
   * 可视化分支树
   */
  visualizeBranchTree(chapterId: string): string {
    const branches = this.getBranchesByChapter(chapterId);
    
    if (branches.length === 0) {
      return 'No branches available';
    }

    // 构建树形结构
    const tree = this.buildTree(branches);
    
    // 生成可视化字符串
    return this.renderTree(tree);
  }

  /**
   * 导出分支
   */
  exportBranch(branchId: string): string {
    const branch = this.getBranchById(branchId);
    
    if (!branch) {
      throw new Error('Branch not found');
    }

    return JSON.stringify(branch, null, 2);
  }

  /**
   * 导入分支
   */
  importBranch(branchData: string): PlotBranch {
    const branch = JSON.parse(branchData) as PlotBranch;
    branch.id = this.generateId(); // 生成新ID
    branch.createdAt = new Date().toISOString();
    branch.updatedAt = new Date().toISOString();
    
    // 保存到数据库
    // this.repository.savePlotBranch(branch);
    
    return branch;
  }

  /**
   * 删除分支
   */
  deleteBranch(branchId: string): void {
    const branch = this.getBranchById(branchId);
    
    if (branch && branch.isSelected) {
      throw new Error('Cannot delete selected branch');
    }

    // 从数据库删除
    // this.repository.deletePlotBranch(branchId);
  }

  /**
   * 获取分支历史
   */
  getBranchHistory(branchId: string): string[] {
    // 从数据库获取历史记录
    // return this.repository.getPlotBranchHistory(branchId);
    return [];
  }

  /**
   * 回滚到历史版本
   */
  rollbackBranch(branchId: string, versionIndex: number): PlotBranch {
    const history = this.getBranchHistory(branchId);
    
    if (versionIndex < 0 || versionIndex >= history.length) {
      throw new Error('Invalid version index');
    }

    const versionData = JSON.parse(history[versionIndex]);
    
    // 恢复分支
    // this.repository.updatePlotBranch(versionData);
    
    return versionData;
  }

  // 私有方法

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getBranchById(branchId: string): PlotBranch | undefined {
    // 从数据库获取
    // return this.repository.getPlotBranchById(branchId);
    return undefined;
  }

  private findDifferences(branch1: PlotBranch, branch2: PlotBranch): string[] {
    const differences: string[] = [];

    // 对比内容差异
    if (branch1.content !== branch2.content) {
      differences.push('内容不同');
    }

    // 对比风格差异
    if (branch1.style !== branch2.style) {
      differences.push(`风格不同: ${branch1.style} vs ${branch2.style}`);
    }

    // 对比描述差异
    if (branch1.description !== branch2.description) {
      differences.push('描述不同');
    }

    return differences;
  }

  private findSimilarities(branch1: PlotBranch, branch2: PlotBranch): string[] {
    const similarities: string[] = [];

    // 对比风格相似性
    if (branch1.style === branch2.style) {
      similarities.push(`风格相同: ${branch1.style}`);
    }

    // 对比内容相似性（简单实现）
    const content1Words = branch1.content.split(/\s+/);
    const content2Words = branch2.content.split(/\s+/);
    const commonWords = content1Words.filter(word => content2Words.includes(word));
    const similarityRatio = commonWords.length / Math.max(content1Words.length, content2Words.length);

    if (similarityRatio > 0.3) {
      similarities.push(`内容相似度: ${(similarityRatio * 100).toFixed(0)}%`);
    }

    return similarities;
  }

  private generateRecommendation(branch1: PlotBranch, branch2: PlotBranch): string {
    // 生成选择建议
    if (branch1.style === branch2.style && branch1.isSelected) {
      return '两个分支风格相同，建议保留当前选中的分支';
    }

    if (branch2.status === 'completed' && branch1.status !== 'completed') {
      return '第二个分支已完成，建议选择第二个分支';
    }

    return '两个分支各有特色，建议根据故事发展需要选择';
  }

  private mergeContent(content1: string, content2: string): string {
    // 简单的内容合并策略
    // 实际应用中可能需要更复杂的合并算法
    const parts1 = content1.split('\n\n');
    const parts2 = content2.split('\n\n');
    
    // 取较长的部分
    return parts1.length > parts2.length ? content1 : content2;
  }

  private buildTree(branches: PlotBranch[]): any {
    // 构建树形结构
    const tree: any = { name: 'root', children: [] };
    const branchMap = new Map<string, any>();

    // 创建节点
    branches.forEach(branch => {
      branchMap.set(branch.id, {
        name: branch.name,
        description: branch.description,
        isSelected: branch.isSelected,
        children: []
      });
    });

    // 构建层次结构
    branches.forEach(branch => {
      const node = branchMap.get(branch.id);
      
      if (branch.parentId) {
        const parent = branchMap.get(branch.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        tree.children.push(node);
      }
    });

    return tree;
  }

  private renderTree(tree: any, level: number = 0): string {
    const indent = '  '.repeat(level);
    const marker = tree.isSelected ? '→ ' : '• ';
    let result = `${indent}${marker}${tree.name}`;
    
    if (tree.description) {
      result += ` (${tree.description})`;
    }
    
    result += '\n';

    if (tree.children && tree.children.length > 0) {
      tree.children.forEach((child: any) => {
        result += this.renderTree(child, level + 1);
      });
    }

    return result;
  }
}
