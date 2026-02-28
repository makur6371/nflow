#!/usr/bin/env node
/**
 * nflow CLI 入口文件
 * AI 小说创作命令行工具
 */

import { Command } from 'commander';
import { helpCommand } from './commands/help';
import { initCommand } from './commands/init';
import { outlineCommand } from './commands/outline';
import { characterCommand } from './commands/character';
import { writeCommand } from './commands/write';
import { polishCommand } from './commands/polish';
import { reviewCommand } from './commands/review';
import { generatorCommand } from './commands/generator';
import { templateCommand } from './commands/template';
import { rhythmCommand } from './commands/rhythm';
import { branchCommand } from './commands/branch';
import { analyzeCommand } from './commands/analyze';

const CLI_NAME = 'nflow';
const CLI_VERSION = '1.0.0';

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    📚 nflow v${CLI_VERSION}                          ║
║           Your AI Novel Writing Assistant                    ║
╚══════════════════════════════════════════════════════════════╝

✓ Connected to iflow (Free Models: Qwen3-Coder, Kimi-K2, DeepSeek-v3)
✓ Novel agents ready: outline, character, scene, writing, polish, review
✓ 30+ generators available
✓ 18+ templates loaded
✓ Multi-plot branches supported
✓ Rhythm analysis enabled

Type 'help' to see available commands.
`);

const program = new Command();

program.name(CLI_NAME).version(CLI_VERSION).description('AI Novel Writing CLI Tool - Reliable, Free, Powerful');

// 注册基础命令
program.addCommand(helpCommand);
program.addCommand(initCommand);
program.addCommand(outlineCommand);
program.addCommand(characterCommand);
program.addCommand(writeCommand);
program.addCommand(polishCommand);
program.addCommand(reviewCommand);

// 注册高级命令
program.addCommand(generatorCommand);
program.addCommand(templateCommand);
program.addCommand(rhythmCommand);
program.addCommand(branchCommand);
program.addCommand(analyzeCommand);

// 默认显示帮助
if (process.argv.length === 2) {
  program.help();
}

program.parse();