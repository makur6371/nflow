# nflow

**[English](README.md) | [简体中文](README.zh-CN.md)**

<div align="center">

  **AI-Powered Novel Writing Pipeline Engine**

  <small>Not just "write some text", but help you finish a whole novel, stably.</small>

  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-blue.svg)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/typescript-5.0.0-blue.svg)](https://www.typescriptlang.org/)
  [![GitHub stars](https://img.shields.io/github/stars/makur6371/nflow?style=social)](https://github.com/makur6371/nflow/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/makur6371/nflow?style=social)](https://github.com/makur6371/nflow/network/members)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

  *Treats fiction writing as an engineering problem, not a chat session*

</div>

---

## 📚 Table of Contents

- [Introduction](#introduction)
- [Core Features](#core-features)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [Technical Architecture](#technical-architecture)
- [Feature Details](#feature-details)
- [Development Guide](#development-guide)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)

---

## Introduction

**nflow is an AI-powered novel writing pipeline engine.**

> **It treats fiction writing as an engineering problem, not a chat session.**

Unlike traditional AI writing assistants that rely on chat-based interactions, nflow provides a structured, engineering approach to long-form fiction creation. It combines multi-agent collaboration with a triple self-review mechanism to solve the core problem of AI-generated long texts: **instability and inconsistency**.

### The Real Problem It Solves

Most AI writing tools share one fundamental limitation:

> **They can write, but they can't keep writing consistently.**

Common manifestations:
- Character personalities drift after 3-5 chapters
- Previous settings are forgotten or contradict themselves
- Plot progresses by random inspiration rather than long-term planning
- Long-form quality is completely uncontrollable, requiring constant rewriting

**nflow is positioned exactly on this pain point:** It doesn't pursue "instant inspiration" but aims for **sustained, controllable, and reusable long-text production**.

### Core Philosophy

- **🏭 Writing as Engineering**: Break creation into executable steps, not just a pile of prompts
- **🔄 Multi-Agent + Triple Review**: Not "write and done", but "write → check → fix → recheck"
- **🎛️ Control Over Speed**: Prioritize quality and controllability over instant gratification
- **🛠️ CLI + Templates + Generators**: Reuse writing methods like code, not start from scratch each time

---

## nflow vs Other AI Writing Tools

### nflow vs ChatGPT / Claude (General Chat-based AI)

| Dimension | ChatGPT / Claude | nflow |
|-----------|------------------|-------|
| Usage | Conversation | CLI + Pipeline |
| Writing Model | Single model impromptu | Multi-Agent Collaboration |
| Long-form Consistency | Low, relies on human memory | High, relies on structure and review |
| Writing Process | None | Clear stages (Outline → Chapter → Review) |
| Control | Weak | Strong |
| Target Audience | Temporary writing, short texts | Systematic novel writers |

**One-sentence evaluation:** **ChatGPT is "someone who can write", nflow is "a writing factory".**

---

### nflow vs Commercial AI Novel Platforms (Sudowrite, NovelAI, etc.)

| Dimension | Commercial AI Novel Platforms | nflow |
|-----------|------------------------------|-------|
| Product Form | Web UI | CLI |
| Usage Barrier | Low | Medium |
| Customizability | Limited | Extremely High |
| Writing Logic | Feature stacking | Process-driven |
| Long-form Stability | Medium | High |
| Openness | Closed Source | Open Source |
| Target Audience | General creators | Heavy creators / Technical writers |

**One-sentence evaluation:** **Commercial platforms sell "experience", nflow sells "control".**

---

### nflow vs One-Click Book Generation Tools

| Dimension | One-Click Tools | nflow |
|-----------|-----------------|-------|
| Writing Quality | Unstable | Controllable |
| Modifiability | Poor | Strong |
| Author Participation | Minimal | High |
| Result Maintainability | Almost none | Complete structure |
| Practicality | Gimmick | Practical |

**One-sentence evaluation:** **One-click tools are lottery tickets, nflow is a production line.**

---

## Who Is nflow For?

nflow **is not for everyone**, which is actually its strength.

### Perfect For:

- People who want to write **100,000+ words** novels
- People obsessed with AI output **controllability**
- People willing to sacrifice some instant gratification for quality
- Technical background authors / Open source writers
- People who treat writing as a long-term project, not a toy

### Not Recommended For:

- People looking for "write a novel with one click"
- People who prefer visual UI over command line
- People writing short stories (under 50,000 words)
- People who want completely hands-off AI writing

## Core Features

### nflow's Unique Moat

Not just "AI novel writing", but the combination of these three points:

1. **Writing Process Engineering**
   Break creation into executable steps, not just a pile of prompts.

2. **Multi-Agent + Triple Self-Review**
   Not "write and done", but **write → check → fix → recheck**.

3. **CLI + Templates + Generator System**
   Reuse writing methods like code, not start from scratch each time.

These three points together make it **irreplaceable**.

---

### 🎯 Triple Self-Review Mechanism

**Pre-writing - Context Injection**
- Inject complete outline, chapter planning
- Inject character profiles, world-building settings
- Inject completed chapter summaries, current plot state
- Inject foreshadowing list, timeline, character relationship map

**During Writing - Real-time Checks**
- Real-time check character consistency
- Real-time check plot logic
- Real-time check world-building settings
- Real-time check timeline
- Real-time check foreshadowing

**Post-writing - Comprehensive Review**
- Review overall structure
- Review character development
- Review plot progression
- Review writing quality
- Review consistency
- Review foreshadowing callbacks

### 📏 Word Count Control System

**Based on Tomato Novel Platform Requirements**

| Platform Requirement | nflow Setting |
|---------|----------------|
| Recommended per chapter: 2050-2300 words | **Word count range: 2000-2500 words** |
| Beneficial for audiobooks | **Target word count: 2200 words** |
| Publication range: 2000-6000 words | **Allowed error: 2000-2400 words** |

**Core Functions**

- **Smart word count setting**: Set target word count when creating project (default 2200 words)
- **Real-time word count monitoring**: Real-time statistics during writing with visual display
- **Automatic word count adjustment**:
  - Insufficient word count (<2000): Automatically expand environmental descriptions, psychological descriptions, dialogue
  - Excessive word count (>2400): Automatically compress redundant content, merge similar paragraphs
- **Word count report generation**: Per-chapter word count statistics, full-book word count distribution chart, word count achievement rate

**Usage Example**

```bash
# Set chapter word count
> config set word-count.target 2200

# Check current chapter word count
> word-count check
Current chapter: 1234 words (target 2200 words, short by 966 words)

# Auto-expand to target word count
> word-count expand
Expanded to 2210 words

# View full-book word count distribution
> word-count report
```

### 🔄 Quality Control Loop

**"Review → Setting Check → Continue Writing" Loop Mechanism**

```
Generate Chapter → Word Count Check → Quality Review → Setting Check → Auto Fix → Polish → Score → Save/Rewrite
```

**Quality Review Dimensions**

| Dimension | Check Content | Weight |
|------|---------|------|
| **Character Consistency** | Whether character personality, language, behavior match settings | 30% |
| **Plot Logic** | Whether plot development is reasonable, no plot holes | 25% |
| **World-building Settings** | Whether violates world-building rules | 20% |
| **Timeline** | Whether chronological order is correct | 15% |
| **Foreshadowing Callbacks** | Whether foreshadowing is callback | 10% |

**Quality Scoring System**

- **90+**: Excellent, can be published directly
- **80-89**: Good, can continue
- **70-79**: Average, recommended to optimize
- **60-69**: Pass, needs modification
- **Below 60**: Fail, must rewrite

**Usage Example**

```bash
# Quality review current chapter
> review
Quality score: 75 points
- Character consistency: 80 points ✓
- Plot logic: 70 points ⚠ (2 logic holes)
- World-building settings: 85 points ✓
- Timeline: 65 points ⚠ (timeline error)
- Foreshadowing callbacks: 70 points ⚠ (foreshadowing not callback)

# Auto fix
> review auto-fix
Auto fixed:
✓ Fixed timeline error
✓ Fixed logic holes
✓ Callback foreshadowing

# Re-review
> review
Quality score: 88 points (+13 points)✓
```

### 🔧 Auto-Fix Mechanism

**Auto-detect and fix common issues**

| Issue Type | Detection Method | Fix Strategy |
|---------|---------|---------|
| **Insufficient word count** | Word count statistics | Auto-expand content |
| **Excessive word count** | Word count statistics | Auto-compress content |
| **Character OOC** | Personality consistency check | Adjust character behavior |
| **Timeline error** | Timeline check | Fix chronological order |
| **Setting conflict** | Setting consistency check | Adjust setting description |
| **Missing foreshadowing** | Foreshadowing check | Add foreshadowing callback |

**Auto-fix Configuration**

```bash
# View auto-fix configuration
> auto-fix config
Status: ✓ Enabled
Fix level: moderate
Auto-fix types:
  ✓ word_count_insufficient
  ✓ word_count_excess
  ✓ character_ooc_mild
  ✓ timeline_error_simple
  ✓ setting_conflict_minor
Manual confirmation types:
  ✓ character_ooc_severe
  ✓ timeline_error_complex
  ✓ setting_conflict_major
  ✓ foreshadowing_missed_critical

# Adjust fix level
> auto-fix set-level aggressive
```

**Usage Example**

```bash
# Auto-fix current chapter
> auto-fix
Found 5 issues:
1. Insufficient word count (1850 words) → Expanding...
2. Character OOC (mild) → Fixing...
3. Timeline error (simple) → Fixing...
4. Setting conflict (minor) → Fixing...
5. Excessive word count (after fix 2450 words) → Compressing...

Fix complete!
- Word count: 1850 → 2215 words
- Character consistency: Fixed
- Timeline: Fixed
- Setting conflict: Resolved
- Final word count: 2215 words ✓
```

### 🤖 Multi-Agent Collaboration

- **outline-agent**: Outline generation, responsible for overall story structure
- **character-agent**: Character creation, responsible for character design
- **scene-agent**: Scene description, responsible for environment construction
- **writing-agent**: Main text writing, responsible for content creation
- **polish-agent**: Text polishing, responsible for language optimization
- **review-agent**: Quality review, responsible for comprehensive review

### 🎨 36 Specialized Generators

**Plot Type**
- Plot twist generator
- Conflict design generator
- Foreshadowing generator
- Ending generator
- Transition generator
- Rhythm adjustment generator

**Character Type**
- Character background generator
- Character personality generator
- Character relationship generator
- Character dialogue generator
- Character character arc generator

**Scene Type**
- Scene description generator
- Environmental atmosphere generator
- Action description generator
- Sensory description generator

**Dialogue Type**
- Dialogue generator
- Dialogue style generator
- Dialogue conflict generator

### 📋 18 Writing Templates

**Classic Structure**
- Three-act structure
- Hero's journey
- Seven emotions structure
- Qi Cheng Zhuan He (Introduction, Elaboration, Transition, Conclusion)
- Suspense structure
- Romance structure

**Genre Templates**
- Fantasy novel template
- Sci-fi novel template
- Urban novel template
- Suspense novel template
- Romance novel template
- Historical novel template

### 🔀 Multi-plot System

- Create plot branches
- Switch between different versions
- Merge versions
- Version comparison
- Conflict resolution

### 📚 Book Breakdown Learning Feature

- Analyze chapter structure
- Extract writing techniques
- Learn character building
- Learn plot design
- Generate learning reports

### 🎼 Chapter Rhythm Chart

- Analyze chapter rhythm
- Rhythm visualization
- Rhythm optimization suggestions
- Full-book rhythm planning

### 🆓 Zero Cost Usage

| Feature | Cost |
|------|------|
| iflow authentication | Free |
| Qwen3-Coder | Free |
| Kimi-K2 | Free |
| DeepSeek-v3 | Free |
| GLM-4.6 | Free |
| All features | **Completely Free** |

---

## Quick Start

### Installation

#### Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0

#### Install Steps

```bash
# 1. Install iflow (free)
npm install -g @iflow-ai/iflow-cli

# 2. Login to iflow
iflow login

# 3. Install nflow
npm install -g @nflow/cli

# 4. Verify installation
nflow --version
```

### First Usage

```bash
# Start nflow
nflow

# Create new project
> /init

# Set project info
> Project name: My First Novel
> Genre: Fantasy
> Estimated word count: 200,000
> Main style: Passionate, Adventure
```

### Core Workflow

```bash
# 1. Generate outline
> outline Generate a fantasy novel outline, protagonist is a transmigrator

# 2. Create characters
> character Create protagonist, name is Lin Feng, brave and kind

# 3. Write chapter
> write Write chapter 1, protagonist transmigrates to a new world

# 4. Polish and review
> polish Polish chapter 1
> review Review chapter 1
```

---

## Usage Examples

### Example 1: Complete Creation Process

```bash
# 1. Create project
nflow
> /init

# 2. Generate outline
> outline Generate a cultivation novel outline, 20 chapters, protagonist starts cultivating from mortal

# 3. Create main characters
> character Create protagonist, name is Zhang San, personality is determined, goal is to become immortal
> character Create master, name is Li Si, personality is cold, hidden expert

# 4. Plan chapters
> outline Generate detailed chapter planning for first 10 chapters

# 5. Start writing
> write Write chapter 1, protagonist Zhang San is rejected at the sect entrance

# 6. Polish and review
> polish Polish chapter 1
> review Review chapter 1

# 7. Continue writing
> write Write chapter 2, protagonist meets an expert in the mountains
```

### Example 2: Using Generators

```bash
# Use plot twist generator
> generator plot-twist Generate a plot twist, protagonist discovers his true identity

# Use conflict design generator
> generator conflict Design a conflict, protagonist and antagonist first confrontation

# Use foreshadowing generator
> generator foreshadowing Add foreshadowing for chapter 5, about protagonist's true identity
```

### Example 3: Using Templates

```bash
# Use three-act structure template
> template use Three-act structure, create outline framework for my novel

# Use hero's journey template
> template use Hero's journey, plan protagonist's growth path
```

### Example 4: Multi-plot

```bash
# Create plot branch
> branch create Chapter 5 has two development directions: protagonist joins sect vs cultivates alone

# Switch to another version
> branch switch Switch to the solo cultivation version

# Compare two versions
> branch compare Compare two versions

# Merge versions
> branch merge Merge advantages of both versions
```

---

## Technical Architecture

### Overall Architecture

```
┌─────────────────────────────────────────┐
│          CLI Interface (Ink)           │
│   packages/cli/src/ui/                 │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Command System                 │
│   packages/cli/src/commands/           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Task & Agent System             │
│   packages/core/src/agents/            │
│   - outline-agent                       │
│   - character-agent                     │
│   - scene-agent                         │
│   - writing-agent                       │
│   - polish-agent                        │
│   - review-agent                        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│            Tool System                  │
│   packages/core/src/tools/              │
│   - outline-tool                        │
│   - character-tool                      │
│   - scene-tool                          │
│   - consistency-check                   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Core AI Client & Memory            │
│   packages/core/src/core/               │
│   - Memory compression                  │
│   - Context injection                   │
│   - Model selection                     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│     iflow Authentication & Models       │
│   - Qwen3-Coder                         │
│   - Kimi-K2                             │
│   - DeepSeek-v3                         │
│   - GLM-4.6                             │
└─────────────────────────────────────────┘
```

### Core Technologies

| Technology | Version | Purpose |
|------|------|------|
| TypeScript | 5.0+ | Main development language |
| Node.js | 20+ | Runtime environment |
| React + Ink | - | CLI UI framework |
| better-sqlite3 | - | Local database |
| OpenAI SDK | - | API integration |
| Anthropic SDK | - | API integration |
| esbuild | - | Build tool |
| Vitest | - | Test framework |

### Project Structure

```
nflow/
├── packages/
│   ├── cli/                    # CLI Application
│   │   ├── src/
│   │   │   ├── commands/       # Command system
│   │   │   ├── services/       # CLI services
│   └── core/                   # Core Logic
│   │   ├── src/
│   │   │   ├── agents/         # AI Agents
│   │   │   ├── tools/          # Tools
│   │   │   ├── ai/             # AI Integration
│   │   │   ├── database/       # Database
│   │   │   ├── core/           # Core mechanisms
│   │   │   ├── generators/     # Generators
│   │   │   ├── templates/      # Templates
│   │   │   ├── plot/           # Plot management
│   │   │   └── rhythm/         # Rhythm analysis
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

---

## Feature Details

### Triple Self-Review Mechanism Details

#### 1. Pre-writing - Context Injection

Before starting to write, nflow automatically injects complete context information to ensure AI has sufficient information foundation:

```typescript
type FullContext = {
  fullOutline: string;           // Complete outline
  chapterPlan: string;           // Chapter planning
  basicSettings: string;         // Basic settings
  characterProfiles: string;     // Character profiles
  worldSettings: string;         // World-building settings
  completedChaptersSummary: string;  // Completed chapter summaries
  currentPlotState: string;      // Current plot state
  foreshadowings: string;        // Foreshadowing list
  timeline: string;              // Timeline
  characterRelationships: string; // Character relationships
};
```

#### 2. During Writing - Real-time Checks

During the writing process, nflow real-time checks each paragraph:

```typescript
async checkWhileWriting(segment: string, context: FullContext): Promise<CheckResult> {
  const checks = await Promise.all([
    this.checkCharacterConsistency(segment, context),  // Character consistency
    this.checkPlotLogic(segment, context),             // Plot logic
    this.checkWorldSetting(segment, context),          // World-building settings
    this.checkTimeline(segment, context),              // Timeline
    this.checkForeshadowing(segment, context)          // Foreshadowing check
  ]);
  
  return this.aggregateChecks(checks);
}
```

#### 3. Post-writing - Comprehensive Review

After writing is complete, conduct comprehensive review:

```typescript
async fullReview(chapter: string, context: FullContext): Promise<FullReviewResult> {
  const review = await Promise.all([
    this.reviewOverallStructure(chapter, context),      // Overall structure
    this.reviewCharacterDevelopment(chapter, context),  // Character development
    this.reviewPlotProgression(chapter, context),       // Plot progression
    this.reviewWritingQuality(chapter, context),        // Writing quality
    this.reviewConsistency(chapter, context),           // Consistency review
    this.reviewForeshadowing(chapter, context)          // Foreshadowing callbacks
  ]);
  
  return this.aggregateReview(review);
}
```

### Agent Model Selection

Different agents select different models based on capability requirements:

| Agent | Primary Model | Backup Model | Free Model | Reason |
|-------|--------|----------|----------|------|
| outline-agent | Claude Opus | Claude Sonnet | Kimi-K2 | Needs strong planning ability |
| character-agent | Claude Opus | Claude Sonnet | GLM-4.6 | Needs strong creativity |
| scene-agent | Claude Sonnet | GPT-4.5 | DeepSeek-v3 | Balance creativity and efficiency |
| writing-agent | Claude Sonnet | Claude Opus | Qwen3-Coder | Balance quality and efficiency |
| polish-agent | Claude Sonnet | GPT-4.5 | DeepSeek-v3 | Needs language optimization ability |
| review-agent | GPT-4.5 | Claude Sonnet | Qwen3-Coder | Needs logical reasoning ability |

### Memory Management System

nflow inherits iflow's memory compression technology, efficiently handling long-form memory:

- **Auto-summary**: Automatically compress completed chapters into summaries
- **Smart retrieval**: Automatically retrieve relevant information based on context
- **Memory compression**: Use advanced compression algorithms to reduce token consumption
- **Layered storage**: Divide memory into core information, important information, secondary information

---

## Development Guide

### Environment Setup

```bash
# Clone project
git clone https://github.com/makur6371/nflow.git
cd nflow

# Install dependencies
npm install

# Build project
npm run build

# Run tests
npm test
```

### Development Workflow

1. **Create development branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Write code**
   - Follow TypeScript specifications
   - Add necessary comments
   - Write unit tests

3. **Run tests**
   ```bash
   npm test
   ```

4. **Commit code**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

5. **Create Pull Request**
   - Submit PR to main branch
   - Wait for code review
   - Modify based on feedback

### Code Standards

- Use ESLint for code checking
- Use Prettier for code formatting
- Follow TypeScript best practices
- Write clear comments
- Write unit tests

### Testing Standards

- Unit test coverage > 80%
- All new features must include tests
- Use Vitest as test framework

---

## FAQ

### Q: Is nflow free?

A: Yes, nflow is completely free. By integrating iflow's free models (Qwen3-Coder, Kimi-K2, DeepSeek-v3, GLM-4.6), zero-cost usage is achieved.

### Q: What's the relationship between nflow and iflow?

A: nflow is deeply refactored based on iflow-cli architecture, specifically for novel creation scenarios. They can coexist, using different commands (iflow vs nflow) and configuration directories.

### Q: How to solve long-form writing hallucination problems?

A: nflow solves this through triple self-review mechanism:
- Pre-writing: Inject complete context
- During writing: Real-time check consistency
- Post-writing: Comprehensive review quality

### Q: Which models are supported?

A: Multiple models are supported:
- Free models: Qwen3-Coder, Kimi-K2, DeepSeek-v3, GLM-4.6
- Paid models: OpenAI GPT series, Anthropic Claude series

### Q: How to select models?

A: nflow automatically selects the optimal model for each agent. You can also manually select:
```bash
> config set model outline-agent claude-4-opus
```

### Q: Can I write multiple novels simultaneously?

A: Yes. nflow supports creating multiple projects, each managed independently:
```bash
> /project create My Second Novel
> /project list
> /project switch My Second Novel
```

### Q: How to backup my novels?

A: Novel content is saved in local SQLite database. You can:
```bash
> backup backup-my-novel.sql
> restore backup-my-novel.sql
```

### Q: Is export supported?

A: Yes. Export to multiple formats:
```bash
> export pdf
> export docx
> export txt
> export markdown
```

---

## Contributing

We welcome all forms of contributions!

### How to Contribute

1. **Fork Project**
   ```bash
   # Click Fork button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/makur6371/nflow.git
   cd nflow
   ```

3. **Create Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

4. **Submit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

5. **Push to Fork**
   ```bash
   git push origin feature/your-feature
   ```

6. **Create Pull Request**
   - Create PR on GitHub
   - Describe your changes
   - Wait for review

### Contribution Types

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX improvements
- ⚡ Performance optimizations
- 🧪 Testing improvements
- 🌐 Internationalization

### Code Review

All PRs need to pass code review:
- At least one maintainer review approved
- All tests pass
- Code style complies with standards
- Documentation updated

---

## License

This project is open source under the MIT License.

```
MIT License

Copyright (c) 2026 nflow contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Acknowledgments

- [iflow-cli](https://github.com/iflow-ai/iflow-cli) - Basic architecture and core technology
- [Anthropic](https://www.anthropic.com) - Claude model support
- [OpenAI](https://openai.com) - GPT model support
- [Community Contributors](https://github.com/makur6371/nflow/graphs/contributors) - All contributors

---

## Contact Us

- **GitHub**: https://github.com/makur6371/nflow
- **Issues**: https://github.com/makur6371/nflow/issues
- **Discussions**: https://github.com/makur6371/nflow/discussions

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=makur6371/nflow&type=Date)](https://star-history.com/#makur6371/nflow&Date)

---

## Other Languages

- [简体中文](README.zh-CN.md) (Chinese Simplified)