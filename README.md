# nflow

<div align="center">

  **靠谱、免费、强大的AI小说写作工具**

  <small>全称：novel-flow（便于理解）</small>

  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-blue.svg)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/typescript-5.0.0-blue.svg)](https://www.typescriptlang.org/)
  [![GitHub stars](https://img.shields.io/github/stars/your-username/nflow?style=social)](https://github.com/your-username/nflow/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/your-username/nflow?style=social)](https://github.com/your-username/nflow/network/members)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

  *基于阿里 iflow 架构改造，零成本使用，专为小说创作设计*

</div>

---

## 📚 目录

- [项目介绍](#项目介绍)
- [核心特性](#核心特性)
- [快速开始](#快速开始)
- [使用示例](#使用示例)
- [技术架构](#技术架构)
- [功能详解](#功能详解)
- [开发指南](#开发指南)
- [常见问题](#常见问题)
- [贡献指南](#贡献指南)
- [开源协议](#开源协议)

---

## 项目介绍

**nflow** 是一个基于阿里 iflow-cli 架构深度改造的 AI 小说创作 CLI 工具。（全称：novel-flow，便于理解）

它专为小说创作者设计，通过三重自审查机制解决了长篇写作中的幻觉问题，同时集成 iflow 的免费模型，实现零成本使用。

### 核心理念

- **🎯 靠谱**：三重自审查机制，彻底解决长篇写作幻觉问题
- **🆓 免费**：集成 iflow 免费模型，零成本使用
- **💪 强大**：200+ 专用生成器，100+ 写作模板

### 项目背景

当前市面上的 AI 写小说工具还不够成熟，存在以下痛点：

1. **长篇幻觉问题**：10章后人物性格不一致、时间线混乱、前后矛盾
2. **创作效率低**：缺乏专业的生成工具和模板
3. **功能单一**：只提供基础写作，缺乏专业支持
4. **成本高昂**：需要付费使用高质量模型

nflow 通过深度改造 iflow-cli，专门针对小说创作场景，解决了这些痛点。

---

## 核心特性

### 🎯 三重自审查机制

**写作前 - 上下文注入**
- 注入完整大纲、章节规划
- 注入人物档案、世界观设定
- 注入已完成章节摘要、当前情节状态
- 注入伏笔列表、时间线、人物关系图谱

**写作中 - 实时检查**
- 实时检查人物一致性
- 实时检查情节逻辑
- 实时检查世界观设定
- 实时检查时间线
- 实时检查伏笔

**写作后 - 全面审查**
- 审查整体结构
- 审查人物发展
- 审查情节推进
- 审查写作质量
- 审查一致性
- 审查伏笔呼应

### 📏 字数控制系统

**基于番茄小说平台要求**

| 平台要求 | nflow 设置 |
|---------|----------------|
| 每章建议：2050-2300字 | **字数范围：2000-2500字** |
| 利于有声小说 | **目标字数：2200字** |
| 发布范围：2000-6000字 | **允许误差：2000-2400字** |

**核心功能**

- **智能字数设定**：创建项目时设定目标字数（默认2200字）
- **实时字数监控**：写作过程中实时统计字数，可视化显示
- **自动字数调整**：
  - 字数不足（<2000字）：自动扩展环境描写、心理描写、对话内容
  - 字数超标（>2400字）：自动压缩冗余内容、合并相似段落
- **字数报告生成**：每章字数统计、全书字数分布图、字数达标率

**使用示例**

```bash
# 设定章节字数
> config set word-count.target 2200

# 查看当前章节字数
> word-count check
当前章节：1234字（目标2200字，不足966字）

# 自动扩展到目标字数
> word-count expand
已扩展到2210字

# 查看全书字数分布
> word-count report
```

### 🔄 质量把控闭环流程

**"审核→设定检查→继续写作"循环机制**

```
生成章节 → 字数检查 → 质量审核 → 设定检查 → 自动修复 → 润色 → 评分 → 保存/重写
```

**质量审核维度**

| 维度 | 检查内容 | 权重 |
|------|---------|------|
| **人物一致性** | 人物性格、语言、行为是否符合设定 | 30% |
| **情节逻辑** | 情节发展是否合理，有无漏洞 | 25% |
| **世界观设定** | 是否违反世界观规则 | 20% |
| **时间线** | 时间顺序是否正确 | 15% |
| **伏笔呼应** | 伏笔是否被呼应 | 10% |

**质量评分系统**

- **90分以上**：优秀，可以直接发布
- **80-89分**：良好，可以继续
- **70-79分**：一般，建议优化
- **60-69分**：及格，需要修改
- **60分以下**：不及格，必须重写

**使用示例**

```bash
# 质量审核当前章节
> review
质量评分：75分
- 人物一致性：80分 ✓
- 情节逻辑：70分 ⚠ (有2处逻辑漏洞)
- 世界观设定：85分 ✓
- 时间线：65分 ⚠ (时间顺序错误)
- 伏笔呼应：70分 ⚠ (伏笔未呼应)

# 自动修复
> review auto-fix
已自动修复：
✓ 修正时间线错误
✓ 修复逻辑漏洞
✓ 呼应伏笔

# 重新审核
> review
质量评分：88分（+13分）✓
```

### 🔧 自动修复机制

**自动检测并修复常见问题**

| 问题类型 | 检测方法 | 修复策略 |
|---------|---------|---------|
| **字数不足** | 字数统计 | 自动扩展内容 |
| **字数超标** | 字数统计 | 自动压缩内容 |
| **人物OOC** | 性格一致性检查 | 调整人物行为 |
| **时间线错误** | 时间线检查 | 修正时间顺序 |
| **设定冲突** | 设定一致性检查 | 调整设定描述 |
| **伏笔遗漏** | 伏笔检查 | 添加伏笔呼应 |

**自动修复配置**

```bash
# 查看自动修复配置
> auto-fix config
启用状态：✓ 已启用
修复级别：moderate
自动修复类型：
  ✓ word_count_insufficient
  ✓ word_count_excess
  ✓ character_ooc_mild
  ✓ timeline_error_simple
  ✓ setting_conflict_minor
人工确认类型：
  ✓ character_ooc_severe
  ✓ timeline_error_complex
  ✓ setting_conflict_major
  ✓ foreshadowing_missed_critical

# 调整修复级别
> auto-fix set-level aggressive
```

**使用示例**

```bash
# 自动修复当前章节
> auto-fix
发现5个问题：
1. 字数不足（1850字）→ 正在扩展...
2. 人物OOC（轻微）→ 正在修复...
3. 时间线错误（简单）→ 正在修复...
4. 设定冲突（轻微）→ 正在修复...
5. 字数超标（修复后2450字）→ 正在压缩...

修复完成！
- 字数：1850 → 2215字
- 人物一致性：已修复
- 时间线：已修正
- 设定冲突：已解决
- 最终字数：2215字 ✓
```

### 🤖 多 Agent 协作

- **outline-agent**：大纲生成，负责整体故事结构
- **character-agent**：人物创建，负责角色设计
- **scene-agent**：场景描写，负责环境构建
- **writing-agent**：正文写作，负责内容创作
- **polish-agent**：文本润色，负责语言优化
- **review-agent**：质量审核，负责全面审查

### 🎨 200+ 专用生成器

**剧情类**
- 剧情反转生成器
- 冲突设计生成器
- 伏笔生成器
- 结局生成器
- 转场生成器
- 节奏调整生成器

**人物类**
- 人物背景生成器
- 人物性格生成器
- 人物关系生成器
- 人物对话生成器
- 人物成长弧生成器

**场景类**
- 场景描写生成器
- 环境氛围生成器
- 动作描写生成器
- 感官描写生成器

**对话类**
- 对话生成器
- 对话风格生成器
- 对话冲突生成器

### 📋 100+ 写作模板

**经典结构**
- 三幕式结构
- 英雄之旅
- 七情六欲结构
- 起承转合
- 悬疑结构
- 爱情结构

**类型模板**
- 玄幻小说模板
- 科幻小说模板
- 都市小说模板
- 悬疑小说模板
- 爱情小说模板
- 历史小说模板

### 🔀 多线剧情系统

- 创建情节分支
- 切换不同版本
- 合并版本
- 版本对比
- 冲突解决

### 📚 拆书学习功能

- 分析章节结构
- 提取写作技巧
- 学习人物塑造
- 学习情节设计
- 生成学习报告

### 🎼 章节节奏表

- 分析章节节奏
- 节奏可视化
- 节奏优化建议
- 全书节奏规划

### 🆓 零成本使用

| 功能 | 成本 |
|------|------|
| iflow 认证 | 免费 |
| Qwen3-Coder | 免费 |
| Kimi-K2 | 免费 |
| DeepSeek-v3 | 免费 |
| GLM-4.6 | 免费 |
| 所有功能 | **完全免费** |

---

## 快速开始

### 安装

#### 前置要求

- Node.js >= 20.0.0
- npm >= 9.0.0

#### 安装步骤

```bash
# 1. 安装 iflow（免费）
npm install -g @iflow-ai/iflow-cli

# 2. 登录 iflow
iflow login

# 3. 安装 nflow
npm install -g @nflow/cli

# 4. 验证安装
nflow --version
```

### 创建项目

```bash
# 启动 nflow
nflow

# 创建新项目
> /init

# 设置项目信息
> 项目名称：我的第一部小说
> 类型：玄幻
> 预计字数：20万
> 主要风格：热血、冒险
```

### 生成大纲

```bash
> outline 生成一个玄幻小说大纲，主角是一个穿越者，从废柴开始崛起
```

### 创建人物

```bash
# 创建主角
> character 创建主角，名字叫林风，性格勇敢善良，天赋异禀但被压制

# 创建反派
> character 创建反派，名字叫赵天霸，性格霸道阴险，是当地恶霸

# 创建配角
> character 创建配角，名字叫苏婉，性格温柔善良，是主角的青梅竹马
```

### 写作章节

```bash
> write 写第一章，主角林风穿越到新世界，发现自己变成了废柴
```

### 润色文本

```bash
> polish 润色第一章，让描写更生动，更有画面感
```

### 审核质量

```bash
> review 审核第一章，检查人物一致性和情节逻辑
```

---

## 使用示例

### 示例1：完整创作流程

```bash
# 1. 创建项目
nflow
> /init

# 2. 生成大纲
> outline 生成一个修仙小说大纲，20章，主角从凡人开始修炼

# 3. 创建主要人物
> character 创建主角，名字叫张三，性格坚毅，目标成仙
> character 创师父，名字叫李四，性格高冷，是隐世高手

# 4. 规划章节
> outline 为前10章生成详细章节规划

# 5. 开始写作
> write 写第一章，主角张三在山门处被拒绝入派

# 6. 润色和审核
> polish 润色第一章
> review 审核第一章

# 7. 继续写作
> write 写第二章，主角在山中遇到高人
```

### 示例2：使用生成器

```bash
# 使用剧情反转生成器
> generator plot-twist 生成一个剧情反转，主角发现自己身世

# 使用冲突设计生成器
> generator conflict 设计一个冲突，主角和反派第一次正面交锋

# 使用伏笔生成器
> generator foreshadowing 为第五章添加一个伏笔，关于主角身世
```

### 示例3：使用模板

```bash
# 使用三幕式结构模板
> template use 三幕式结构，为我的小说创建大纲框架

# 使用英雄之旅模板
> template use 英雄之旅，为主角规划成长路径
```

### 示例4：多线剧情

```bash
# 创建情节分支
> branch create 第五章有两个发展方向：主角加入门派 vs 独自修炼

# 切换到另一个版本
> branch switch 切换到独自修炼的版本

# 查看两个版本的对比
> branch compare 对比两个版本

# 合并版本
> branch merge 合并两个版本的优点
```

---

## 技术架构

### 整体架构

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
│   packages/core/src/tools/task/         │
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
│   - 记忆压缩                            │
│   - 上下文注入                          │
│   - 模型选择                            │
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

### 核心技术

| 技术 | 版本 | 用途 |
|------|------|------|
| TypeScript | 5.0+ | 主要开发语言 |
| Node.js | 20+ | 运行时环境 |
| React + Ink | - | CLI UI 框架 |
| better-sqlite3 | - | 本地数据库 |
| OpenAI SDK | - | API 集成 |
| Anthropic SDK | - | API 集成 |
| esbuild | - | 构建工具 |
| Vitest | - | 测试框架 |

### 项目结构

```
nflow/
├── packages/
│   ├── cli/                    # CLI 应用
│   │   ├── src/
│   │   │   ├── commands/       # 命令系统
│   │   │   ├── ui/             # UI 组件
│   │   │   ├── services/       # CLI 服务
│   │   │   └── config/         # 配置管理
│   ├── core/                   # 核心逻辑
│   │   ├── src/
│   │   │   ├── tools/          # 工具系统
│   │   │   │   ├── task/       # 任务和代理
│   │   │   │   ├── outline-tool.ts
│   │   │   │   ├── character-tool.ts
│   │   │   │   ├── scene-tool.ts
│   │   │   │   └── consistency-check.ts
│   │   │   ├── core/           # 核心 AI 客户端
│   │   │   └── services/       # 后台服务
│   └── vscode-ide-companion/   # VS Code 插件
├── docs/                       # 文档
├── tests/                      # 测试
├── scripts/                    # 构建脚本
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

---

## 功能详解

### 三重自审查机制详解

#### 1. 写作前 - 上下文注入

在开始写作前，nflow 会自动注入完整的上下文信息，确保 AI 有充分的信息基础：

```typescript
type FullContext = {
  fullOutline: string;           // 完整大纲
  chapterPlan: string;           // 章节规划
  basicSettings: string;         // 基本设定
  characterProfiles: string;     // 人物档案
  worldSettings: string;         // 世界观设定
  completedChaptersSummary: string;  // 已完成章节摘要
  currentPlotState: string;      // 当前情节状态
  foreshadowings: string;        // 伏笔列表
  timeline: string;              // 时间线
  characterRelationships: string; // 人物关系
};
```

#### 2. 写作中 - 实时检查

在写作过程中，nflow 会实时检查每一段内容：

```typescript
async checkWhileWriting(segment: string, context: FullContext): Promise<CheckResult> {
  const checks = await Promise.all([
    this.checkCharacterConsistency(segment, context),  // 人物一致性
    this.checkPlotLogic(segment, context),             // 情节逻辑
    this.checkWorldSetting(segment, context),          // 世界观设定
    this.checkTimeline(segment, context),              // 时间线
    this.checkForeshadowing(segment, context)          // 伏笔检查
  ]);
  
  return this.aggregateChecks(checks);
}
```

#### 3. 写作后 - 全面审查

写作完成后，进行全面的审查：

```typescript
async fullReview(chapter: string, context: FullContext): Promise<FullReviewResult> {
  const review = await Promise.all([
    this.reviewOverallStructure(chapter, context),      // 整体结构
    this.reviewCharacterDevelopment(chapter, context),  // 人物发展
    this.reviewPlotProgression(chapter, context),       // 情节推进
    this.reviewWritingQuality(chapter, context),        // 写作质量
    this.reviewConsistency(chapter, context),           // 一致性审查
    this.reviewForeshadowing(chapter, context)          // 伏笔呼应
  ]);
  
  return this.aggregateReview(review);
}
```

### Agent 模型选择

不同的 Agent 根据能力需求选择不同的模型：

| Agent | 主模型 | 备用模型 | 免费模型 | 理由 |
|-------|--------|----------|----------|------|
| outline-agent | Claude Opus | Claude Sonnet | Kimi-K2 | 需要强规划能力 |
| character-agent | Claude Opus | Claude Sonnet | GLM-4.6 | 需要强创造力 |
| scene-agent | Claude Sonnet | GPT-4.5 | DeepSeek-v3 | 平衡创造力和效率 |
| writing-agent | Claude Sonnet | Claude Opus | Qwen3-Coder | 平衡质量和效率 |
| polish-agent | Claude Sonnet | GPT-4.5 | DeepSeek-v3 | 需要语言优化能力 |
| review-agent | GPT-4.5 | Claude Sonnet | Qwen3-Coder | 需要逻辑推理能力 |

### 记忆管理系统

nflow 继承了 iflow 的记忆压缩技术，可以高效处理长篇记忆：

- **自动摘要**：自动将已完成章节压缩成摘要
- **智能检索**：根据上下文自动检索相关信息
- **记忆压缩**：使用先进的压缩算法，减少 token 消耗
- **分层存储**：将记忆分为核心信息、重要信息、次要信息

---

## 开发指南

### 环境搭建

```bash
# 克隆项目
git clone https://github.com/your-username/nflow.git
cd nflow

# 安装依赖
npm install

# 构建项目
npm run build

# 运行测试
npm test
```

### 开发流程

1. **创建开发分支**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **编写代码**
   - 遵循 TypeScript 规范
   - 添加必要的注释
   - 编写单元测试

3. **运行测试**
   ```bash
   npm test
   ```

4. **提交代码**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

5. **创建 Pull Request**
   - 提交 PR 到主分支
   - 等待代码审查
   - 根据反馈修改

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 TypeScript 最佳实践
- 编写清晰的注释
- 编写单元测试

### 测试规范

- 单元测试覆盖率 > 80%
- 所有新功能必须包含测试
- 使用 Vitest 作为测试框架

---

## 常见问题

### Q: nflow 是免费的吗？

A: 是的，nflow 完全免费。通过集成 iflow 的免费模型（Qwen3-Coder、Kimi-K2、DeepSeek-v3、GLM-4.6），实现了零成本使用。

### Q: nflow 和 iflow 有什么关系？

A: nflow 是基于 iflow-cli 架构深度改造的，专门针对小说创作场景。它们可以共存，使用不同的命令（iflow vs nflow）和配置目录。

### Q: 如何解决长篇写作幻觉问题？

A: nflow 通过三重自审查机制解决：
- 写作前：注入完整上下文
- 写作中：实时检查一致性
- 写作后：全面审查质量

### Q: 支持哪些模型？

A: 支持多种模型：
- 免费模型：Qwen3-Coder、Kimi-K2、DeepSeek-v3、GLM-4.6
- 付费模型：OpenAI GPT 系列、Anthropic Claude 系列

### Q: 如何选择模型？

A: nflow 会自动为每个 Agent 选择最优模型。你也可以手动选择：
```bash
> config set model outline-agent claude-4-opus
```

### Q: 可以同时写多部小说吗？

A: 可以。nflow 支持创建多个项目，每个项目独立管理：
```bash
> /project create 我的第二部小说
> /project list
> /project switch 我的第二部小说
```

### Q: 如何备份我的小说？

A: 小说内容保存在本地 SQLite 数据库中。你可以：
```bash
> backup backup-my-novel.sql
> restore backup-my-novel.sql
```

### Q: 支持导出吗？

A: 支持。可以导出为多种格式：
```bash
> export pdf
> export docx
> export txt
> export markdown
```

---

## 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. **Fork 项目**
   ```bash
   # 在 GitHub 上点击 Fork 按钮
   ```

2. **克隆你的 Fork**
   ```bash
   git clone https://github.com/your-username/nflow.git
   cd nflow   ```

3. **创建分支**
   ```bash
   git checkout -b feature/your-feature
   ```

4. **提交修改**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

5. **推送到 Fork**
   ```bash
   git push origin feature/your-feature
   ```

6. **创建 Pull Request**
   - 在 GitHub 上创建 PR
   - 描述你的修改
   - 等待审查

### 贡献类型

- 🐛 Bug 修复
- ✨ 新功能
- 📝 文档改进
- 🎨 UI/UX 改进
- ⚡ 性能优化
- 🧪 测试改进
- 🌐 国际化

### 代码审查

所有 PR 都需要通过代码审查：
- 至少一位维护者审查通过
- 所有测试通过
- 代码风格符合规范
- 文档已更新

---

## 开源协议

本项目采用 MIT 协议开源。

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

## 致谢

- [iflow-cli](https://github.com/iflow-ai/iflow-cli) - 基础架构和核心技术
- [Anthropic](https://www.anthropic.com) - Claude 模型支持
- [OpenAI](https://openai.com) - GPT 模型支持
- [社区贡献者](https://github.com/your-username/nflow/graphs/contributors) - 所有贡献者

---

## 联系我们

- **GitHub**: https://github.com/your-username/nflow
- **Issues**: https://github.com/your-username/nflow/issues
- **Discussions**: https://github.com/your-username/nflow/discussions

---

<div align="center">

  **如果这个项目对你有帮助，请给它一个 ⭐ Star！**

  [![Star History Chart](https://api.star-history.com/svg?repos=your-username/nflow&type=Date)](https://star-history.com/#your-username/nflow&Date)

</div>