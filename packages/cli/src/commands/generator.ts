import { Command } from 'commander';
import { initDatabase, GeneratorRegistry, AIClient } from '@nflow/core';

export const generatorCommand = new Command('generator')
  .description('Use specialized content generators')
  .option('-l, --list', 'List all available generators')
  .option('-s, --search <keyword>', 'Search generators by keyword')
  .option('-u, --use <id>', 'Use a specific generator')
  .option('-c, --category <category>', 'Filter by category')
  .option('--stats', 'Show generator statistics')
  .action(async (options) => {
    try {
      await initDatabase('novel-data.json');
      
      const config = getAIClientConfig();
      if (!config) {
        console.error('Error: AI client not configured. Please set ILOW_API_KEY environment variable.');
        process.exit(1);
      }

      const aiClient = new AIClient(config);
      const registry = new GeneratorRegistry(aiClient);

      if (options.list) {
        listGenerators(registry, options.category);
      } else if (options.search) {
        searchGenerators(registry, options.search);
      } else if (options.use) {
        useGenerator(registry, options.use);
      } else if (options.stats) {
        showGeneratorStats(registry);
      } else {
        console.log('\n📦 Generator System\n');
        console.log('Usage: nflow generator [options]\n');
        console.log('Options:');
        console.log('  -l, --list          List all available generators');
        console.log('  -s, --search <key>   Search generators by keyword');
        console.log('  -u, --use <id>      Use a specific generator');
        console.log('  -c, --category <cat> Filter by category');
        console.log('  --stats             Show generator statistics\n');
        console.log('Categories: plot, character, scene, conflict, foreshadowing, ending, dialogue, description, action, emotion\n');
        console.log('Examples:');
        console.log('  nflow generator --list');
        console.log('  nflow generator --search "反转"');
        console.log('  nflow generator --use plot-twist');
        console.log('  nflow generator --list --category plot\n');
      }
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

function listGenerators(registry: GeneratorRegistry, category?: string): void {
  let generators = category 
    ? registry.getGeneratorsByCategory(category as any)
    : registry.getAllGenerators();

  if (generators.length === 0) {
    console.log(`\nNo generators found${category ? ` for category "${category}"` : ''}.\n`);
    return;
  }

  console.log(`\n📦 Available Generators (${generators.length})\n`);

  // 按类别分组显示
  const categories = ['plot', 'character', 'scene', 'conflict', 'foreshadowing', 'ending', 'dialogue', 'description', 'action', 'emotion'];
  
  categories.forEach(cat => {
    const catGenerators = category 
      ? generators 
      : generators.filter(g => g.category === cat);
    
    if (catGenerators.length > 0) {
      console.log(`${cat.toUpperCase()} Generators:`);
      catGenerators.forEach(gen => {
        console.log(`  • ${gen.id} - ${gen.name}`);
        console.log(`    ${gen.description}`);
      });
      console.log();
    }
  });
}

function searchGenerators(registry: GeneratorRegistry, keyword: string): void {
  const results = registry.searchGenerators(keyword);

  if (results.length === 0) {
    console.log(`\nNo generators found for "${keyword}".\n`);
    return;
  }

  console.log(`\n🔍 Search Results for "${keyword}" (${results.length} found)\n`);

  results.forEach(gen => {
    console.log(`  • ${gen.id} - ${gen.name} [${gen.category}]`);
    console.log(`    ${gen.description}`);
  });
  console.log();
}

async function useGenerator(registry: GeneratorRegistry, generatorId: string): Promise<void> {
  const generator = registry.getGenerator(generatorId);

  if (!generator) {
    console.log(`\n❌ Generator "${generatorId}" not found.\n`);
    console.log('Use "nflow generator --list" to see available generators.\n');
    return;
  }

  console.log(`\n📦 Using Generator: ${generator.name}\n`);
  console.log(`Description: ${generator.description}\n`);
  console.log(`Required Context: ${generator.requiredContext?.join(', ') || 'None'}\n`);

  // 收集上下文参数
  const context: Record<string, string> = {};
  
  if (generator.requiredContext && generator.requiredContext.length > 0) {
    for (const key of generator.requiredContext) {
      const value = await askQuestion(`${key}: `);
      context[key] = value;
    }
  }

  console.log('\n🎨 Generating content...\n');

  // 使用生成器
  const result = await registry.useGenerator(generatorId, context);

  if (result.success && result.content) {
    console.log('✅ Generated Content:\n');
    console.log(result.content);
    console.log();
  } else {
    console.log(`❌ Error: ${result.error}\n`);
  }
}

function showGeneratorStats(registry: GeneratorRegistry): void {
  const stats = registry.getGeneratorStats();
  const total = Object.values(stats).reduce((sum, count) => sum + count, 0);

  console.log('\n📊 Generator Statistics\n');
  console.log(`Total Generators: ${total}\n`);

  Object.entries(stats).forEach(([category, count]) => {
    const percentage = ((count / total) * 100).toFixed(1);
    console.log(`  ${category}: ${count} (${percentage}%)`);
  });

  console.log();
}

function askQuestion(question: string): Promise<string> {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve: any) => {
    rl.question(question, (answer: any) => {
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