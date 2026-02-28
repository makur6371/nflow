import { Command } from 'commander';

export const helpCommand = new Command('help').description('Show help information').action(() => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    📚 nflow v1.0.0                          ║
║           Your AI Novel Writing Assistant                    ║
╚══════════════════════════════════════════════════════════════╝

nflow - AI Novel Writing Assistant

Usage:
  nflow [command] [options]

Basic Commands:
  init           Initialize a new novel project
  outline        Generate novel outline
  character      Manage novel characters
  scene          Manage novel scenes
  write          Write novel chapters
  polish         Polish novel prose
  review         Review novel content

Advanced Commands:
  generator      Use specialized content generators
  template       Use writing templates
  rhythm         Analyze chapter rhythm
  branch         Manage plot branches
  analyze        Analyze existing novels

Options:
  -V, --version  Output the version number
  -h, --help     Display help for command

Examples:
  nflow init                    Initialize a new project
  nflow outline                 Generate a novel outline
  nflow character create        Create a character
  nflow write                   Write a chapter
  nflow polish                  Polish text
  nflow review                  Review quality
  nflow generator --list        List all generators
  nflow template --list         List all templates
  nflow rhythm --analyze 1      Analyze chapter rhythm
  nflow branch --list 1         List branches for chapter 1
  nflow analyze --chapter 1     Analyze chapter 1

For more information, visit: https://github.com/your-username/nflow
`);
});