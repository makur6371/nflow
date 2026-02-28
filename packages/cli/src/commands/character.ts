import { Command } from 'commander';
import * as readline from 'readline';
import { AIClient, initDatabase, NovelRepository } from '@nflow/core';

export const characterCommand = new Command('character')
  .description('Manage novel characters')
  .option('-a, --action <action>', 'Action: create, list, get', 'create')
  .option('-n, --name <name>', 'Character name')
  .option('-r, --role <role>', 'Character role')
  .action(async (options) => {
    try {
      await initDatabase('novel-data.json');
      const repo = new NovelRepository();

      if (options.action === 'list') {
        // 列出所有人物
        const characters = repo.getAllCharacters();
        if (characters.length === 0) {
          console.log('\nNo characters found. Use "nflow character --action create" to create one.\n');
          return;
        }

        console.log('\n👥 Characters:\n');
        characters.forEach((char: any) => {
          console.log(`  • ${char.name} (${char.role})`);
          console.log(`    Personality: ${char.personality}`);
          console.log(`    Background: ${char.background}`);
          console.log();
        });
        return;
      }

      if (options.action === 'create') {
        // 获取 AI 客户端配置
        const config = getAIClientConfig();
        if (!config) {
          console.error('Error: AI client not configured. Please set ILOW_API_KEY environment variable.');
          process.exit(1);
        }

        const aiClient = new AIClient(config);

        // 询问人物信息
        const name = options.name || await askQuestion('人物姓名：');
        const role = options.role || await askQuestion('人物角色（主角/反派/配角）：');
        const personality = await askQuestion('人物性格（可选，按Enter跳过）：');
        const background = await askQuestion('人物背景（可选，按Enter跳过）：');

        console.log('\n🎨 Creating character...\n');

        // 创建人物
        const characterData = await aiClient.createCharacter({
          name,
          role,
          personality: personality || undefined,
          background: background || undefined
        });

        // 保存到数据库
        const character = repo.saveCharacter(characterData);

        console.log(`✓ Character created: ${character.name}`);
        console.log(`  Role: ${character.role}`);
        console.log(`  Personality: ${character.personality}`);
        console.log(`  Traits: ${character.traits.join(', ')}`);
        console.log();
      }

    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function getAIClientConfig(): { apiKey: string; baseUrl: string; model: string } | null {
  const apiKey = process.env.IFLOW_API_KEY || process.env.NFLOW_API_KEY;
  const baseUrl = process.env.IFLOW_BASE_URL || 'https://apis.iflow.cn/v1';
  const model = process.env.IFLOW_MODEL || 'Qwen3-Coder';

  if (!apiKey) return null;
  return { apiKey, baseUrl, model };
}