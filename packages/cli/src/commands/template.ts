import { Command } from 'commander';
import { initDatabase, TemplateRegistry, NovelRepository } from '@nflow/core';

export const templateCommand = new Command('template')
  .description('Use writing templates')
  .option('-l, --list', 'List all available templates')
  .option('-s, --search <keyword>', 'Search templates by keyword')
  .option('-u, --use <id>', 'Use a specific template')
  .option('-c, --category <category>', 'Filter by category')
  .option('--popular', 'Show popular templates')
  .option('--top-rated', 'Show top-rated templates')
  .option('--stats', 'Show template statistics')
  .action(async (options) => {
    try {
      await initDatabase('novel-data.json');
      const repository = new NovelRepository();
      const registry = new TemplateRegistry(repository);

      if (options.list) {
        listTemplates(registry, options.category);
      } else if (options.search) {
        searchTemplates(registry, options.search);
      } else if (options.use) {
        useTemplate(registry, options.use);
      } else if (options.popular) {
        showPopularTemplates(registry);
      } else if (options.topRated) {
        showTopRatedTemplates(registry);
      } else if (options.stats) {
        showTemplateStats(registry);
      } else {
        console.log('\n📄 Template System\n');
        console.log('Usage: nflow template [options]\n');
        console.log('Options:');
        console.log('  -l, --list            List all available templates');
        console.log('  -s, --search <key>    Search templates by keyword');
        console.log('  -u, --use <id>       Use a specific template');
        console.log('  -c, --category <cat>  Filter by category');
        console.log('  --popular            Show popular templates');
        console.log('  --top-rated          Show top-rated templates');
        console.log('  --stats              Show template statistics\n');
        console.log('Categories: structure, character, scene, dialogue, plot, ending\n');
        console.log('Examples:');
        console.log('  nflow template --list');
        console.log('  nflow template --search "结构"');
        console.log('  nflow template --use three-act-structure');
        console.log('  nflow template --popular\n');
      }
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

function listTemplates(registry: TemplateRegistry, category?: string): void {
  let templates = category 
    ? registry.getTemplatesByCategory(category as any)
    : registry.getAllTemplates();

  if (templates.length === 0) {
    console.log(`\nNo templates found${category ? ` for category "${category}"` : ''}.\n`);
    return;
  }

  console.log(`\n📄 Available Templates (${templates.length})\n`);

  // 按类别分组显示
  const categories = ['structure', 'character', 'scene', 'dialogue', 'plot', 'ending'];
  
  categories.forEach(cat => {
    const catTemplates = category 
      ? templates 
      : templates.filter(t => t.category === cat);
    
    if (catTemplates.length > 0) {
      console.log(`${cat.toUpperCase()} Templates:`);
      catTemplates.forEach(tpl => {
        console.log(`  • ${tpl.id} - ${tpl.name}`);
        console.log(`    ${tpl.description}`);
        console.log(`    Rating: ${tpl.rating} ⭐ | Used: ${tpl.usageCount} times`);
      });
      console.log();
    }
  });
}

function searchTemplates(registry: TemplateRegistry, keyword: string): void {
  const results = registry.searchTemplates(keyword);

  if (results.length === 0) {
    console.log(`\nNo templates found for "${keyword}".\n`);
    return;
  }

  console.log(`\n🔍 Search Results for "${keyword}" (${results.length} found)\n`);

  results.forEach(tpl => {
    console.log(`  • ${tpl.id} - ${tpl.name} [${tpl.category}]`);
    console.log(`    ${tpl.description}`);
    console.log(`    Rating: ${tpl.rating} ⭐ | Used: ${tpl.usageCount} times`);
  });
  console.log();
}

async function useTemplate(registry: TemplateRegistry, templateId: string): Promise<void> {
  const template = registry.getTemplate(templateId);

  if (!template) {
    console.log(`\n❌ Template "${templateId}" not found.\n`);
    console.log('Use "nflow template --list" to see available templates.\n');
    return;
  }

  console.log(`\n📄 Using Template: ${template.name}\n`);
  console.log(`Description: ${template.description}\n`);
  console.log(`Content Preview:\n`);
  console.log(template.content.substring(0, 200) + '...\n');

  // 收集模板参数
  const parameters: Record<string, string> = {};
  
  // 查找模板中的占位符
  const matches = template.content.match(/\{([^}]+)\}/g) || [];
  const uniqueParams = [...new Set(matches.map(m => m.replace(/[{}]/g, '')))];

  if (uniqueParams.length > 0) {
    console.log(`Required Parameters: ${uniqueParams.join(', ')}\n`);
    
    for (const param of uniqueParams) {
      const value = await askQuestion(`${param}: `);
      parameters[param] = value;
    }
  }

  console.log('\n🎨 Applying template...\n');

  // 使用模板
  const result = registry.useTemplate(templateId, parameters);

  console.log('✅ Generated Content:\n');
  console.log(result);
  console.log();
}

function showPopularTemplates(registry: TemplateRegistry): void {
  const popular = registry.getPopularTemplates(10);

  if (popular.length === 0) {
    console.log('\nNo popular templates available.\n');
    return;
  }

  console.log(`\n🔥 Popular Templates (Top ${popular.length})\n`);

  popular.forEach((tpl, index) => {
    console.log(`  ${index + 1}. ${tpl.name} [${tpl.category}]`);
    console.log(`     ${tpl.description}`);
    console.log(`     Used: ${tpl.usageCount} times | Rating: ${tpl.rating} ⭐\n`);
  });
}

function showTopRatedTemplates(registry: TemplateRegistry): void {
  const topRated = registry.getTopRatedTemplates(10);

  if (topRated.length === 0) {
    console.log('\nNo templates available.\n');
    return;
  }

  console.log(`\n⭐ Top-Rated Templates (Top ${topRated.length})\n`);

  topRated.forEach((tpl, index) => {
    console.log(`  ${index + 1}. ${tpl.name} [${tpl.category}]`);
    console.log(`     ${tpl.description}`);
    console.log(`     Rating: ${tpl.rating} ⭐ | Used: ${tpl.usageCount} times\n`);
  });
}

function showTemplateStats(registry: TemplateRegistry): void {
  const stats = registry.getTemplateStats();
  const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
  const templates = registry.getAllTemplates();
  const totalUsage = templates.reduce((sum, tpl) => sum + tpl.usageCount, 0);
  const avgRating = templates.reduce((sum, tpl) => sum + tpl.rating, 0) / templates.length;

  console.log('\n📊 Template Statistics\n');
  console.log(`Total Templates: ${total}`);
  console.log(`Total Usage: ${totalUsage}`);
  console.log(`Average Rating: ${avgRating.toFixed(1)} ⭐\n`);

  console.log('Templates by Category:');
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