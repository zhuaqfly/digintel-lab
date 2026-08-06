# SKILL.md 规范说明

本文档定义 digintel-lab 项目中所有 Skill 的标准格式和编写规范。

## 文件格式

每个 Skill 是一个 `SKILL.md` 文件,放置在对应能力域目录下:

```
skills/{域编号}-{域名称}/{skill名称}/SKILL.md
```

## 标准结构

```markdown
---
name: skill-name          # Skill 唯一标识,使用 kebab-case
version: 1.0.0            # 语义化版本号
domain: diagnosis         # 所属域: diagnosis/strategy/process/scenario/governance/organization/shared
description: 一句话描述 Skill 的能力和用途
author: digintel-lab
tags: [评估, 成熟度, 诊断]  # 标签,便于检索
inputs:                    # 输入要求
  - name: 企业基本信息
    required: true
    description: 行业、规模、业务模式等
  - name: 现有系统清单
    required: false
    description: 已建设的IT系统列表
outputs:                   # 输出说明
  - name: 评估报告
    format: markdown
    description: 包含评分、雷达图数据、改进建议
---

# Skill 标题

## 触发条件
描述何时应激活此 Skill。

## 前置条件
列出执行此 Skill 前需要满足的条件(数据、工具、权限等)。

## 执行流程
按步骤编号列出执行逻辑,每步包含:
1. **步骤名称**: 具体操作说明
   - 输入: 本步骤需要什么
   - 处理: 本步骤做什么
   - 输出: 本步骤产出什么

## 评估维度/分析框架
列出本 Skill 使用的分析框架、评估模型等。

## 输出模板
提供结构化的输出模板,确保交付物标准化。

## 降级策略
当输入不完整或条件不满足时的备选方案:
- 场景1 → 处理方式
- 场景2 → 处理方式

## 关联 Skill
- 上游: 哪些 Skill 的输出作为本 Skill 的输入
- 下游: 本 Skill 的输出供哪些 Skill 使用
```

## 编写原则

1. **AI 可执行**: 写给 AI 执行,不是写给人阅读。步骤要具体、可操作。
2. **结构化**: 使用编号、表格、模板,避免模糊描述。
3. **自包含**: 每个 Skill 独立可用,不依赖隐含上下文。
4. **可组合**: 输入/输出明确,便于和其他 Skill 串联。
5. **有降级**: 对异常场景有明确处理方案。

## 版本管理

- 新建 Skill 从 `1.0.0` 开始
- 重大修改(流程/框架变更) → 主版本号 +1
- 新增维度/步骤 → 次版本号 +1
- 文案修正 → 修订号 +1
