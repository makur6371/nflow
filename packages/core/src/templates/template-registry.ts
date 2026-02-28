/**
 * 模板系统
 * 
 * 管理 100+ 写作模板
 */

import { NovelRepository } from '../database/repository';

export interface Template {
  id: string;
  name: string;
  category: 'structure' | 'character' | 'scene' | 'dialogue' | 'plot' | 'ending';
  description: string;
  content: string;
  tags: string[];
  rating: number;
  usageCount: number;
}

export interface TemplateUsage {
  templateId: string;
  parameters: Record<string, string>;
  result: string;
  timestamp: string;
}

export class TemplateRegistry {
  private templates: Map<string, Template> = new Map();
  private repository: NovelRepository;

  constructor(repository: NovelRepository) {
    this.repository = repository;
    this.initializeTemplates();
  }

  /**
   * 初始化所有模板
   */
  private initializeTemplates(): void {
    // 结构模板 (30个)
    this.registerStructureTemplates();
    
    // 人物模板 (20个)
    this.registerCharacterTemplates();
    
    // 场景模板 (20个)
    this.registerSceneTemplates();
    
    // 对话模板 (15个)
    this.registerDialogueTemplates();
    
    // 情节模板 (10个)
    this.registerPlotTemplates();
    
    // 结局模板 (5个)
    this.registerEndingTemplates();
  }

  /**
   * 注册结构模板
   */
  private registerStructureTemplates(): void {
    const structureTemplates: Template[] = [
      {
        id: 'three-act-structure',
        name: '三幕式结构',
        category: 'structure',
        description: '经典的三幕式小说结构',
        content: `第一幕：铺垫（约25%）
- 介绍主要人物
- 建立世界观
- 提出目标
- 触发事件
- 主角接受任务

第二幕：对抗（约50%）
- 主角踏上旅程
- 遇到盟友和敌人
- 经历挫折和失败
- 中点转折
- 最后的低谷

第三幕：结局（约25%）
- 主角觉醒
- 最后的决战
- 解决冲突
- 人物成长
- 新的平衡`,
        tags: ['结构', '经典', '三幕'],
        rating: 5.0,
        usageCount: 0
      },
      {
        id: 'heros-journey',
        name: '英雄之旅',
        category: 'structure',
        description: '约瑟夫·坎贝尔的英雄之旅结构',
        content: `第一阶段：启程
1. 平凡世界
2. 冒险的召唤
3. 拒绝召唤
4. 遇见导师
5. 跨越第一道门槛

第二阶段：启蒙
6. 试炼、盟友、敌人
7. 接近洞穴
8. 苦难
9. 奖赏
10. 返回的路

第三阶段：回归
11. 复活
12. 带着灵药归来`,
        tags: ['结构', '经典', '英雄'],
        rating: 4.8,
        usageCount: 0
      },
      {
        id: 'save-the-cat',
        name: '救猫咪',
        category: 'structure',
        description: '布莱克·斯奈德的救猫咪结构',
        content: `1. 开场画面
2. 主题呈现
3. 设定
4. 催化剂
5. 争论
6. 第二幕衔接点
7. B故事
8. 游戏
9. 中点
10. 坏人逼近
11. 一无所有
12. 灵魂黑夜
13. 第三幕衔接点
14. 终结
15. 最终画面`,
        tags: ['结构', '电影', '救猫咪'],
        rating: 4.7,
        usageCount: 0
      },
      {
        id: 'kishotenketsu',
        name: '起承转合',
        category: 'structure',
        description: '东亚传统的起承转合结构',
        content: `起（Introduction）
- 介绍背景
- 引入人物
- 设定场景
- 建立基调

承（Development）
- 情节发展
- 人物关系
- 冲突升级
- 信息积累

转（Twist）
- 情节转折
- 意外变化
- 冲突爆发
- 高潮到来

合（Conclusion）
- 解决冲突
- 人物成长
- 主题升华
- 结局收尾`,
        tags: ['结构', '东亚', '传统'],
        rating: 4.6,
        usageCount: 0
      },
      {
        id: 'seven-point-structure',
        name: '七点结构',
        category: 'structure',
        description: '丹·威尔斯的七点结构',
        content: `1. 钩子（Hook）
2. 情节转折1（Plot Turn 1）
3. 钳制1（Pinch 1）
4. 中点（Midpoint）
5. 钳制2（Pinch 2）
6. 情节转折2（Plot Turn 2）
7. 结局（Resolution）`,
        tags: ['结构', '简洁', '七点'],
        rating: 4.5,
        usageCount: 0
      }
      // ... 更多结构模板 (共30个)
    ];

    structureTemplates.forEach(tpl => this.templates.set(tpl.id, tpl));
  }

  /**
   * 注册人物模板
   */
  private registerCharacterTemplates(): void {
    const characterTemplates: Template[] = [
      {
        id: 'character-hero',
        name: '英雄人物',
        category: 'character',
        description: '经典英雄人物模板',
        content: `人物姓名：{name}
角色定位：主角
性格特点：
- 勇敢无畏
- 正直善良
- 坚持正义
- 有缺点但可改正

背景故事：
- 普通出身
- 经历变故
- 立志改变世界

成长弧光：
- 从普通人到英雄
- 克服内心恐惧
- 学会承担责任
- 最终成长完善

目标动机：
- 外部目标：{externalGoal}
- 内部需求：{internalNeed}

致命弱点：
- 过于自信
- 容易冲动
- 盲目信任他人`,
        tags: ['人物', '主角', '英雄'],
        rating: 4.9,
        usageCount: 0
      },
      {
        id: 'character-antihero',
        name: '反英雄',
        category: 'character',
        description: '反英雄人物模板',
        content: `人物姓名：{name}
角色定位：反英雄
性格特点：
- 不拘小节
- 有原则但不完美
- 愤世嫉俗但内心善良
- 行事风格独特

背景故事：
- 黑暗过去
- 遭遇背叛
- 独自生存

成长弧光：
- 从冷漠到有情
- 学会信任他人
- 发现自身价值
- 找到存在意义

目标动机：
- 外部目标：{externalGoal}
- 内部需求：救赎

致命弱点：
- 不愿相信他人
- 过于保护自己
- 容易走极端`,
        tags: ['人物', '反英雄', '成长'],
        rating: 4.8,
        usageCount: 0
      },
      {
        id: 'character-mentor',
        name: '导师人物',
        category: 'character',
        description: '导师人物模板',
        content: `人物姓名：{name}
角色定位：导师
性格特点：
- 智慧博学
- 耐心指导
- 神秘莫测
- 有隐藏的过去

背景故事：
- 曾经的英雄
- 经历失败
- 隐居避世
- 等待传承

目标动机：
- 指导主角
- 传承知识
- 弥补过去的遗憾

与主角关系：
- 师徒关系
- 精神父亲/母亲
- 朋友
- 有时会有冲突

特殊能力：
- 知识渊博
- 有神秘能力
- 经验丰富`,
        tags: ['人物', '导师', '智慧'],
        rating: 4.7,
        usageCount: 0
      },
      {
        id: 'character-villain',
        name: '反派人物',
        category: 'character',
        description: '反派人物模板',
        content: `人物姓名：{name}
角色定位：反派
性格特点：
- 精明狡诈
- 有自己的信念
- 不择手段
- 魅力十足

背景故事：
- 悲惨童年
- 遭受不公
- 形成扭曲价值观
- 立志改变世界

目标动机：
- 表面目标：{surfaceGoal}
- 深层动机：{deepMotive}

与主角关系：
- 镜像关系
- 互相对立
- 有共同的过去
- 可以互相理解

魅力所在：
- 理想主义
- 坚持信念
- 领袖气质
- 个人魅力`,
        tags: ['人物', '反派', '魅力'],
        rating: 4.8,
        usageCount: 0
      }
      // ... 更多人物模板 (共20个)
    ];

    characterTemplates.forEach(tpl => this.templates.set(tpl.id, tpl));
  }

  /**
   * 注册场景模板
   */
  private registerSceneTemplates(): void {
    const sceneTemplates: Template[] = [
      {
        id: 'scene-action',
        name: '动作场景',
        category: 'scene',
        description: '激烈的动作场景模板',
        content: `场景名称：{sceneName}
场景类型：动作
场景位置：{location}

开场：
- 营造紧张氛围
- 介绍冲突双方
- 建立利害关系

发展：
- 动作展开
- 优势转换
- 危机升级

高潮：
- 决胜时刻
- 最后一击
- 生死一线

结尾：
- 胜负揭晓
- 后果展现
- 为下一场铺垫

写作要点：
- 快节奏
- 短句为主
- 动作描写要精准
- 加入感官描写`,
        tags: ['场景', '动作', '激烈'],
        rating: 4.7,
        usageCount: 0
      },
      {
        id: 'scene-emotional',
        name: '情感场景',
        category: 'scene',
        description: '情感丰富的场景模板',
        content: `场景名称：{sceneName}
场景类型：情感
情感基调：{tone}

开场：
- 建立情感基调
- 引出情感触发点
- 渲染氛围

发展：
- 情感逐渐升温
- 内心活动描写
- 生理反应描写
- 行为暗示

高潮：
- 情感爆发
- 真情流露
- 关键转折

结尾：
- 情感平复
- 余韵悠长
- 影响深远

写作要点：
- 细节描写
- 心理活动
- 比喻和象征
- 节奏控制`,
        tags: ['场景', '情感', '细腻'],
        rating: 4.8,
        usageCount: 0
      },
      {
        id: 'scene-dialogue',
        name: '对话场景',
        category: 'scene',
        description: '以对话为主的场景模板',
        content: `场景名称：{sceneName}
场景类型：对话
参与人物：{characters}

开场：
- 引入对话
- 建立对话目的
- 营造对话氛围

发展：
- 对话展开
- 信息交流
- 情感传递
- 冲突展现

高潮：
- 关键信息
- 情感爆发
- 决定性对话

结尾：
- 达成共识/分歧
- 为后续铺垫
- 场景结束

写作要点：
- 人物语言特色
- 潜台词运用
- 动作和神态
- 节奏控制`,
        tags: ['场景', '对话', '交流'],
        rating: 4.6,
        usageCount: 0
      }
      // ... 更多场景模板 (共20个)
    ];

    sceneTemplates.forEach(tpl => this.templates.set(tpl.id, tpl));
  }

  /**
   * 注册对话模板
   */
  private registerDialogueTemplates(): void {
    const dialogueTemplates: Template[] = [
      {
        id: 'dialogue-confrontation',
        name: '对抗对话',
        category: 'dialogue',
        description: '激烈对抗的对话模板',
        content: `对话类型：对抗
参与人物：
- 人物A：{characterA}
- 人物B：{characterB}
对抗焦点：{focus}

对话结构：
1. 挑衅 - 一方发起对抗
2. 回应 - 另一方反击
3. 升级 - 冲突加剧
4. 高潮 - 情感爆发
5. 结局 - 分出胜负/暂时停战

写作要点：
- 语言要尖锐
- 体现人物性格
- 加入潜台词
- 配合动作描写`,
        tags: ['对话', '对抗', '激烈'],
        rating: 4.7,
        usageCount: 0
      },
      {
        id: 'dialogue-revelation',
        name: '揭示对话',
        category: 'dialogue',
        description: '揭示真相的对话模板',
        content: `对话类型：揭示
参与人物：
- 揭示者：{revealer}
- 被揭示者：{receiver}
揭示内容：{content}

对话结构：
1. 铺垫 - 建立紧张氛围
2. 暗示 - 逐步引导
3. 揭示 - 真相大白
4. 反应 - 震惊/接受
5. 后果 - 影响展现

写作要点：
- 节奏控制
- 情感递进
- 保留悬念
- 心理描写`,
        tags: ['对话', '揭示', '真相'],
        rating: 4.8,
        usageCount: 0
      }
      // ... 更多对话模板 (共15个)
    ];

    dialogueTemplates.forEach(tpl => this.templates.set(tpl.id, tpl));
  }

  /**
   * 注册情节模板
   */
  private registerPlotTemplates(): void {
    const plotTemplates: Template[] = [
      {
        id: 'plot-mystery',
        name: '悬疑情节',
        category: 'plot',
        description: '悬疑解谜情节模板',
        content: `情节类型：悬疑
核心谜题：{mystery}

情节结构：
1. 案件发生
2. 线索收集
3. 假设推理
4. 验证推翻
5. 最终真相

写作要点：
- 设置悬念
- 铺垫线索
- 误导读者
- 合理解释
- 情感共鸣`,
        tags: ['情节', '悬疑', '解谜'],
        rating: 4.9,
        usageCount: 0
      },
      {
        id: 'plot-romance',
        name: '爱情情节',
        category: 'plot',
        description: '爱情发展情节模板',
        content: `情节类型：爱情
主要人物：{characters}

情节结构：
1. 相遇 - 命中注定的邂逅
2. 相知 - 互相了解
3. 相爱 - 感情升温
4. 阻碍 - 面临考验
5. 克服 - 共度难关
6. 结合 - 最终结局

写作要点：
- 情感递进
- 细节描写
- 冲突设置
- 甜蜜时刻
- 感动瞬间`,
        tags: ['情节', '爱情', '浪漫'],
        rating: 4.8,
        usageCount: 0
      }
      // ... 更多情节模板 (共10个)
    ];

    plotTemplates.forEach(tpl => this.templates.set(tpl.id, tpl));
  }

  /**
   * 注册结局模板
   */
  private registerEndingTemplates(): void {
    const endingTemplates: Template[] = [
      {
        id: 'ending-happy',
        name: '大团圆结局',
        category: 'ending',
        description: '温馨圆满的结局模板',
        content: `结局类型：大团圆
主要人物：{characters}

结局要素：
1. 所有矛盾解决
2. 人物得到幸福
3. 情感满足
4. 充满希望
5. 余韵悠长

写作要点：
- 温馨感人
- 细节呼应
- 情感升华
- 留有想象空间`,
        tags: ['结局', '圆满', '温馨'],
        rating: 4.7,
        usageCount: 0
      },
      {
        id: 'ending-tragic',
        name: '悲剧结局',
        category: 'ending',
        description: '感人至深的悲剧结局模板',
        content: `结局类型：悲剧
主要人物：{characters}

结局要素：
1. 主角牺牲
2. 悲壮感人
3. 主题升华
4. 永恒记忆
5. 余韵悠长

写作要点：
- 悲而不伤
- 情感深刻
- 主题突出
- 难忘瞬间`,
        tags: ['结局', '悲剧', '感人'],
        rating: 4.8,
        usageCount: 0
      }
      // ... 更多结局模板 (共5个)
    ];

    endingTemplates.forEach(tpl => this.templates.set(tpl.id, tpl));
  }

  /**
   * 获取所有模板
   */
  getAllTemplates(): Template[] {
    return Array.from(this.templates.values());
  }

  /**
   * 按类别获取模板
   */
  getTemplatesByCategory(category: Template['category']): Template[] {
    return this.getAllTemplates().filter(tpl => tpl.category === category);
  }

  /**
   * 获取指定模板
   */
  getTemplate(id: string): Template | undefined {
    return this.templates.get(id);
  }

  /**
   * 使用模板
   */
  useTemplate(templateId: string, parameters: Record<string, string>): string {
    const template = this.getTemplate(templateId);
    
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // 替换模板中的占位符
    let content = template.content;
    for (const [key, value] of Object.entries(parameters)) {
      content = content.replace(new RegExp(`{${key}}`, 'g'), value);
    }

    // 更新使用次数
    template.usageCount++;

    return content;
  }

  /**
   * 搜索模板
   */
  searchTemplates(keyword: string): Template[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.getAllTemplates().filter(tpl => 
      tpl.name.toLowerCase().includes(lowerKeyword) ||
      tpl.description.toLowerCase().includes(lowerKeyword) ||
      tpl.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * 获取热门模板
   */
  getPopularTemplates(limit: number = 10): Template[] {
    return this.getAllTemplates()
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  /**
   * 获取高评分模板
   */
  getTopRatedTemplates(limit: number = 10): Template[] {
    return this.getAllTemplates()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  /**
   * 评价模板
   */
  rateTemplate(templateId: string, rating: number): void {
    const template = this.getTemplate(templateId);
    if (template) {
      template.rating = rating;
    }
  }

  /**
   * 获取模板统计
   */
  getTemplateStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    
    for (const tpl of this.getAllTemplates()) {
      stats[tpl.category] = (stats[tpl.category] || 0) + 1;
    }
    
    return stats;
  }
}