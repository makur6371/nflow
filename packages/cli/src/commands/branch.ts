import { Command } from 'commander';
import { initDatabase, PlotBranchManager, NovelRepository } from '@nflow/core';

export const branchCommand = new Command('branch')
  .description('Manage plot branches')
  .option('-c, --create', 'Create a new branch')
  .option('-l, --list <chapter>', 'List branches for a chapter')
  .option('-s, --select <id>', 'Select a branch')
  .option('-d, --delete <id>', 'Delete a branch')
  .option('-v, --visualize <chapter>', 'Visualize branch tree')
  .action(async (options) => {
    try {
      await initDatabase('novel-data.json');
      const repository = new NovelRepository();
      const branchManager = new PlotBranchManager(repository);

      if (options.create) {
        await createBranch(branchManager);
      } else if (options.list) {
        listBranches(branchManager, options.list);
      } else if (options.select) {
        selectBranch(branchManager, options.select);
      } else if (options.delete) {
        deleteBranch(branchManager, options.delete);
      } else if (options.visualize) {
        visualizeBranches(branchManager, options.visualize);
      } else {
        console.log('\n🌿 Plot Branch Management\n');
        console.log('Usage: nflow branch [options]\n');
        console.log('Options:');
        console.log('  -c, --create           Create a new branch');
        console.log('  -l, --list <chapter>   List branches for a chapter');
        console.log('  -s, --select <id>      Select a branch');
        console.log('  -d, --delete <id>      Delete a branch');
        console.log('  -v, --visualize <id>   Visualize branch tree\n');
        console.log('Examples:');
        console.log('  nflow branch --create');
        console.log('  nflow branch --list 1');
        console.log('  nflow branch --select branch-123');
        console.log('  nflow branch --visualize 1\n');
      }
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

async function createBranch(branchManager: PlotBranchManager): Promise<void> {
  console.log('\n🌿 Creating New Branch\n');
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const ask = (q: string): Promise<string> => new Promise((resolve: any) => rl.question(q, (a: any) => resolve(a)));

  const chapterId = await ask('Chapter ID: ');
  const name = await ask('Branch Name: ');
  const description = await ask('Branch Description: ');
  const content = await ask('Branch Content: ');
  const style = await ask('Branch Style (action/romance/mystery/drama/comedy): ');

  rl.close();

  const branch = branchManager.createBranch({
    chapterId,
    name,
    description,
    content,
    style: style as any
  });

  console.log(`\n✅ Branch Created: ${branch.name} (ID: ${branch.id})\n`);
}

function listBranches(branchManager: PlotBranchManager, chapterId: string): void {
  const branches = branchManager.getBranchesByChapter(chapterId);

  if (branches.length === 0) {
    console.log(`\nNo branches found for chapter ${chapterId}.\n`);
    return;
  }

  console.log(`\n🌿 Branches for Chapter ${chapterId} (${branches.length})\n`);

  branches.forEach(branch => {
    const icon = branch.isSelected ? '✓' : '○';
    console.log(`  ${icon} ${branch.name} [${branch.style}]`);
    console.log(`     ${branch.description}`);
    console.log(`     Status: ${branch.status} | ID: ${branch.id}\n`);
  });
}

function selectBranch(branchManager: PlotBranchManager, branchId: string): void {
  // 需要获取章节ID，这里简化处理
  console.log(`\n✅ Selected branch: ${branchId}\n`);
  console.log('💡 Note: To fully implement, extend NovelRepository with plot branch storage.\n');
}

function deleteBranch(branchManager: PlotBranchManager, branchId: string): void {
  branchManager.deleteBranch(branchId);
  console.log(`\n🗑️  Branch deleted: ${branchId}\n`);
}

function visualizeBranches(branchManager: PlotBranchManager, chapterId: string): void {
  const tree = branchManager.visualizeBranchTree(chapterId);
  console.log(tree);
}