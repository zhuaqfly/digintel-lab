# digintel-lab

企业数智化转型咨询服务的 AI Skill + Agent 库。

## 项目定位

将数智化转型咨询服务中的原子能力封装为可复用、可组合的 Skill,通过多 Agent 编排实现咨询全流程的标准化、产品化、智能化交付。

## 架构

```
用户需求
    ↓
┌─────────────────────────────────────┐
│  consulting-workflow (主编排Agent)    │
│  理解需求 → 选Agent → 编排 → 交付     │
└──────────┬──────────────────────────┘
           │
    ┌──────┼──────┬──────┬──────┬──────┐
    ↓      ↓      ↓      ↓      ↓      ↓
 诊断    顶层    数据    AI场景  组织    交付
 Agent   规划    治理    规划    变革    Agent
        Agent   Agent   Agent   Agent
```

### Agent 体系 (agents/)

| Agent | 目录 | 咨询类型 | 参考方法论 |
|-------|------|---------|-----------|
| 主编排 | `agents/consulting-workflow/` | 意图识别、Agent编排、交付协调 | — |
| 诊断评估 | `agents/diagnosis-agent/` | 成熟度评估、就绪度诊断、差距分析、数据资产盘点 | 麦肯锡/德勤/BCG |
| 顶层规划 | `agents/top-level-design-agent/` | 战略愿景、业务架构、5A技术架构、转型路线图 | 麦肯锡/罗兰贝格 |
| 数据治理 | `agents/data-governance-agent/` | 治理体系、数据标准、质量管理、安全合规 | 德勤 |
| AI场景规划 | `agents/scenario-planning-agent/` | 场景识别、优先级评估、POC设计、推广策略 | BCG |
| 组织变革 | `agents/org-change-agent/` | 组织设计、人才规划、变革管理、培训体系 | 麦肯锡 |
| 交付物生成 | `agents/delivery-agent/` | PPT、执行摘要、完整报告 | — |

### Skill 体系 (skills/)

| 域 | 目录 | 说明 |
|---|---|---|
| 诊断评估 | `skills/1-diagnosis/` | 成熟度评估、AI就绪度诊断、差距分析、数据资产盘点 |
| 战略规划 | `skills/2-strategy/` | 顶层设计、路径规划、价值链梳理、投入产出测算 |
| 流程重构 | `skills/3-process/` | 流程拆解、流程重组、智能化设计、指标体系 |
| AI场景规划 | `skills/4-scenario/` | 场景识别、优先级评估、POC设计、推广复制 |
| 治理体系 | `skills/5-governance/` | 数据治理、AI架构、风险合规、价值度量 |
| 组织变革 | `skills/6-organization/` | 组织优化、人才梯队、变革管理、培训体系 |
| 共享工具 | `skills/_shared/` | skill-creator、skill-reviewer、ppt-generation、报告模板 |

## 快速开始

### 方式一: 通过主编排Agent使用(推荐)
直接描述需求,Agent自动选择和编排:
```
对青岛港做一轮完整的数智化转型咨询,要PPT
```

### 方式二: 指定专业Agent
```
用诊断Agent评估XX企业的数智化成熟度
用数据治理Agent设计XX企业的数据治理体系
```

### 方式三: 直接使用单个Skill
在 `skills/` 下找到需要的Skill,将SKILL.md内容提供给AI助手执行。

## 编写规范

- Skill 规范: [SKILL_SPECIFICATION.md](docs/SKILL_SPECIFICATION.md)
- Agent 规范: AGENT.md,格式类似SKILL.md,增加 `type: agent` 和 `sub_agents`/`available_skills` 字段

## 技术栈

- Skill/Agent 格式: Markdown (SKILL.md / AGENT.md)
- PPT生成: dashi-ppt-skill (12主题,1020版式,可编辑PPTX)
- 兼容平台: Trae / Claude Code / Cursor / Codex
- 版本管理: Git + GitHub
