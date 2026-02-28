import { Command } from 'commander';
import { initDatabase, createProjectMetadata, NovelRepository } from '@nflow/core';

export const initCommand = new Command('init')
  .description('Initialize a new novel project')
  .option('-n, --name <name>', 'Project name')
  .action(async (options) => {
    try {
      const projectName = options.name || 'My Novel';

      console.log(`\n📚 Initializing novel project: ${projectName}\n`);

      // 初始化数据库
      await initDatabase('novel-data.json');
      console.log('✓ Database initialized');

      // 创建项目元数据
      createProjectMetadata(projectName);
      console.log('✓ Project metadata created');

      console.log('\n🎉 Project initialized successfully!\n');
      console.log('Next steps:');
      console.log('  nflow outline     - Generate novel outline');
      console.log('  nflow character   - Create characters');
      console.log('  nflow write       - Write chapters\n');
    } catch (error) {
      console.error('Error initializing project:', error);
      process.exit(1);
    }
  });