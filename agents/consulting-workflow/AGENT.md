---
name: consulting-workflow
version: 1.0.0
type: agent
description: 数智化转型咨询工作流编排Agent,理解用户需求后自动选择、串联、执行skill,输出完整咨询报告
author: digintel-lab
tags: [Agent, 编排, 工作流, 咨询]
capabilities:
  - skill_selection: 根据用户需求自动选择合适的skill
  - skill_chaining: 将前一个skill的输出作为后一个skill的输入
  - gap_detection: 识别现有skill覆盖不了的需求,调用skill-creator生成新skill
  - report_aggregation: 汇总多个skill的输出为统一报告
  - ppt_generation: 将咨询报告转化为PPT演示文稿交付物
available_skills:
  - domain: 1-diagnosis
    skills:
      - maturity-assessment: 数智化成熟度评估
      - readiness-diagnosis: AI就绪度诊断
      - gap-analysis: 差距分析
      - data-asset-audit: 数据资产盘点
  - domain: _shared
    skills:
      - skill-creator: 生成新skill(当现有skill不足时自动调用)
      - skill-reviewer: 评审skill质量
      - report-template: 报告模板生成
      - ppt-generation: 将报告转化为PPT演示文稿
inputs:
  - name: 用户需求描述
    required: true
    description: 自然语言描述的咨询需求,如"某制造企业想规划AI转型"
  - name: 企业信息
    required: true
    description: 行业、规模、系统清单、数据现状等
  - name: 输出格式
    required: false
    description: 报告(markdown) 或 PPT(pptx),默认同时输出两种
outputs:
  - name: 完整咨询报告
    format: markdown
    description: 汇总所有skill输出的结构化报告
  - name: PPT演示文稿
    format: pptx
    description: 可编辑的PowerPoint文件,基于咨询报告生成
  - name: 执行记录
    format: json
    description: 记录调用了哪些skill、执行顺序、各步骤输出摘要
---

# 数智化转型咨询工作流 Agent

## 触发条件
当用户描述一个数智化转型相关的咨询需求(而非指定单个skill)时激活。典型输入:
- "某制造企业想规划AI转型,从哪里开始?"
- "帮这家企业做一轮完整的数智化诊断"
- "这个企业的数据基础怎么样,能上AI吗?"

## 工作机制

### 核心循环: 理解 → 选择 → 执行 → 判断 → 继续

```
用户需求
    ↓
[1. 意图理解] 解析需求,确定咨询目标
    ↓
[2. Skill选择] 从可用skill列表中选择合适的执行链
    ↓
[3. 逐个执行] 按顺序执行每个skill,前一个输出传入后一个
    ↓
[4. 完整性判断] 检查是否覆盖了用户需求的所有方面
    ↓
    ├─ 是 → [6. 汇总报告]
    ├─ 否 → [5. 补充] 选择更多skill或生成新skill
    ↓
[6. 汇总报告] 整合所有输出为统一咨询报告
```

### 意图识别与Skill映射

| 用户意图关键词 | 触发的Skill链 |
|---------------|-------------|
| 评估/诊断/现状/摸底 | maturity-assessment → readiness-diagnosis |
| 差距/差距分析/离目标多远 | maturity-assessment → gap-analysis |
| 数据资产/数据质量/数据治理 | data-asset-audit |
| AI转型/AI规划/从哪开始 | maturity-assessment → readiness-diagnosis → gap-analysis → (scenario-identification 待开发) |
| 完整诊断/全面分析/全流程 | 全部诊断skill串联 |
| 创建skill/生成skill | skill-creator |
| 没有明确意图 | 先问澄清问题,再选择 |

### Skill链数据流

```
maturity-assessment
  输出: L{X}等级 + 七维度评分 + 短板识别
     ↓ (成熟度结果作为就绪度评估的背景)
readiness-diagnosis
  输出: 四维就绪度 + 阻塞点 + 就绪路径
     ↓ (就绪度结果作为差距分析的输入)
gap-analysis
  输出: P0-P3差距清单 + 闭合路线图
     ↓ (差距分析作为数据盘点的优先级参考)
data-asset-audit
  输出: 数据资产目录 + 质量评分 + 治理建议
```

## 执行流程

### 步骤1: 意图理解与澄清
- 输入: 用户需求描述 + 企业信息
- 处理:
  1. 解析用户的咨询意图(诊断?规划?评估?全面分析?)
  2. 检查企业信息是否充分
  3. 如信息不足,向用户提问补充(而不是猜测)
  4. 确定要执行的skill链
- 输出: 执行计划(skill列表 + 执行顺序)

### 步骤2: 逐个执行Skill
- 输入: 执行计划 + 企业信息
- 处理: 对计划中的每个skill:
  1. 读取该skill的SKILL.md
  2. 按skill定义的流程逐步执行
  3. 收集输出结果
  4. 将输出传递给下一个skill作为输入
  5. 记录执行日志(调用了什么、输出了什么)
- 输出: 各skill的原始输出 + 执行日志

### 步骤3: 完整性检查
- 输入: 各skill输出 + 用户原始需求
- 处理:
  1. 对照用户需求,检查是否所有方面都已覆盖
  2. 识别遗漏(如:用户关心AI场景,但场景skill尚未开发)
  3. 如有遗漏:
     a. 优先用现有skill补充
     b. 如现有skill无法覆盖,调用skill-creator生成临时skill
     c. 如生成新skill不合适,在报告中标注"待后续分析"
- 输出: 补充执行记录(如有)

### 步骤4: 汇总报告
- 输入: 全部skill输出
- 处理:
  1. 按咨询报告逻辑组织内容(不是简单拼接)
  2. 报告结构:
     - 执行摘要(1页,给领导看)
     - 详细分析(各skill核心输出)
     - 建议与路线图(汇总各skill的建议)
     - 附录(完整评估数据)
  3. 确保各部分之间的结论一致(不能前面说L2后面说L3)
- 输出: 完整咨询报告(markdown)

## 输出模板

```markdown
# {企业名称} 数智化转型咨询报告

## 执行摘要
- 咨询时间: {日期}
- 咨询范围: {范围}
- 核心结论: {1-3句话概括}
- 关键发现: {3-5个要点}
- 建议优先行动: {3条}

## 一、成熟度评估
### 当前等级
{等级} ({等级名称}), 综合得分 {X.X}/5.0

### 七维度评分摘要
{表格}

### 短板识别
{描述}

(详见: maturity-assessment完整输出)

## 二、AI就绪度诊断
### 综合就绪度
{级别} (得分 {X.X}/5.0)

### 四维度评分摘要
{表格}

### 关键阻塞点
{描述}

(详见: readiness-diagnosis完整输出)

## 三、差距分析
### 差距总览
P0:{a}项 / P1:{b}项 / P2:{c}项 / P3:{d}项

### 优先闭合差距
{P0差距列表}

(详见: gap-analysis完整输出)

## 四、数据资产盘点
### 资产总览
数据资产{N}项, 质量综合评分 {X.X}/5.0

### 高价值数据资产
{列表}

### 数据治理建议
{描述}

(详见: data-asset-audit完整输出)

## 五、综合建议与路线图
### 第一阶段({时间}): 补短板
1. {建议}
2. {建议}

### 第二阶段({时间}): 试点验证
1. {建议}
2. {建议}

### 第三阶段({时间}): 规模推进
1. {建议}
2. {建议}

## 附录
### A. 成熟度评估完整数据
### B. 就绪度评分明细
### C. 差距清单完整版
### D. 数据资产目录
### E. 执行记录(调用的skill及顺序)
```

## 降级策略
- 企业信息不足 → 先问用户补充关键信息,不猜测
- 某个skill执行失败 → 跳过该skill,在报告中标注"待评估"
- skill链覆盖不了需求 → 标注"超出当前能力范围",给出人工建议方向
- 用户需求模糊 → 先提出2-3个澄清问题
- dashi-ppt-skill 未安装 → 仅输出markdown报告,提示用户安装后可生成PPT

## PPT生成工作流

当用户需要PPT交付物时,在完成报告生成后自动执行:

```
[步骤1-4: 诊断skill链执行]
    ↓ 输出: 完整咨询报告 (markdown)
[步骤5: ppt-generation skill]
    → 解析报告结构 → 规划PPT页面 → 调用dashi-ppt-skill → 导出PPTX
    ↓ 输出: 可编辑 .pptx 文件
```

用户可通过以下方式触发PPT生成:
- 直接说"生成PPT"或"做成演示文稿"
- 在初始需求中说明需要PPT交付物
- 设置输出格式参数为 pptx

## 关联 Skill
- 编排对象: `1-diagnosis/` 下全部skill + `_shared/` 下工具skill
- PPT交付: `_shared/ppt-generation` — 将报告转化为PPT演示文稿
- 未来扩展: 随着更多域的skill开发完成,自动纳入编排范围
- 自我进化: 当发现skill缺口时,调用`skill-creator`生成新skill填补
```

## 执行记录

| 步骤 | Skill | 输入摘要 | 输出摘要 | 耗时 |
|------|-------|---------|---------|------|
| 1 | maturity-assessment | 企业基本信息 | L2,综合分2.1 | - |
| 2 | readiness-diagnosis | 成熟度结果+数据现状 | 初步就绪,2.3 | - |
| 3 | gap-analysis | 成熟度+目标 | P0:3项,P1:5项 | - |
| 4 | data-asset-audit | 系统清单+业务架构 | 资产48项,质量2.8 | - |
