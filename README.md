# digintel-lab

企业数智化转型咨询服务的 AI Skill + Agent 库。

## 项目定位

将数智化转型咨询服务中的原子能力封装为可复用、可组合的 Skill,通过 Agent 编排实现咨询全流程的标准化、产品化、智能化交付。

## 架构

```
用户需求
    ↓
Agent 层 (agents/)  ← 理解意图,选择skill,串联执行,汇总报告
    ↓
Skill 层 (skills/)  ← 单个咨询能力的标准化执行
```

### Skill 体系 (skills/)

| 域 | 目录 | 说明 |
|---|---|---|
| 诊断评估 | `skills/1-diagnosis/` | 成熟度评估、AI就绪度诊断、差距分析、数据资产盘点 |
| 战略规划 | `skills/2-strategy/` | 顶层设计、路径规划、价值链梳理、投入产出测算 |
| 流程重构 | `skills/3-process/` | 流程拆解、流程重组、智能化设计、指标体系 |
| AI场景规划 | `skills/4-scenario/` | 场景识别、优先级评估、POC设计、推广复制 |
| 治理体系 | `skills/5-governance/` | 数据治理、AI架构、风险合规、价值度量 |
| 组织变革 | `skills/6-organization/` | 组织优化、人才梯队、变革管理、培训体系 |
| 共享工具 | `skills/_shared/` | skill-creator、skill-reviewer、报告模板、行业对标 |

### Agent 体系 (agents/)

| Agent | 目录 | 说明 |
|-------|------|------|
| 咨询工作流 | `agents/consulting-workflow/` | 理解需求→选择skill→串联执行→汇总报告 |

## 快速开始

### 方式一: 通过 Agent 使用(推荐)
直接描述需求,Agent 自动选择和编排 skill:
```
某制造企业想规划AI转型,从哪里开始?
企业信息: 行业:制造业, 规模:2000人, 系统:ERP/CRM/OA/MES...
```

### 方式二: 直接使用单个 Skill
1. 在 `skills/` 下找到需要的 Skill
2. 阅读 SKILL.md 了解输入输出
3. 将 Skill 内容提供给 AI 助手(Trae / Claude Code / Cursor 等)
4. 按步骤提供输入,获取结构化交付物

## 编写规范

- Skill 规范: [SKILL_SPECIFICATION.md](docs/SKILL_SPECIFICATION.md)
- Agent 规范: Agent 使用 AGENT.md,格式类似 SKILL.md,增加 `type: agent` 和 `available_skills` 字段

## 技术栈

- Skill/Agent 格式: Markdown (SKILL.md / AGENT.md)
- 兼容平台: Trae / Claude Code / Cursor / Codex
- 版本管理: Git + GitHub
