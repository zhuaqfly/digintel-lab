# digintel-lab

企业数智化转型咨询服务的 AI 技能库。

## 项目定位

将数智化转型咨询服务中的原子能力封装为可复用、可组合的 Skill,支撑企业数智化转型咨询的标准化、产品化、智能化交付。

## Skill 体系架构

| 域 | 目录 | 说明 |
|---|---|---|
| 诊断评估 | `skills/1-diagnosis/` | 成熟度评估、AI就绪度诊断、差距分析、数据资产盘点 |
| 战略规划 | `skills/2-strategy/` | 顶层设计、路径规划、价值链梳理、投入产出测算 |
| 流程重构 | `skills/3-process/` | 流程拆解、流程重组、智能化设计、指标体系 |
| AI场景规划 | `skills/4-scenario/` | 场景识别、优先级评估、POC设计、推广复制 |
| 治理体系 | `skills/5-governance/` | 数据治理、AI架构、风险合规、价值度量 |
| 组织变革 | `skills/6-organization/` | 组织优化、人才梯队、变革管理、培训体系 |
| 共享能力 | `skills/_shared/` | 报告模板、行业对标、工作流编排、Skill工具链 |

## 快速开始

1. 在 `skills/` 下找到需要的 Skill
2. 阅读 Skill 的 `SKILL.md` 了解输入输出
3. 将 Skill 内容提供给 AI 助手(Trae / Claude Code / Cursor 等)
4. 按步骤提供输入,获取结构化交付物

## Skill 编写规范

参考 [SKILL_SPECIFICATION.md](docs/SKILL_SPECIFICATION.md)

## 技术栈

- Skill 格式: Markdown (SKILL.md)
- 兼容平台: Trae / Claude Code / Cursor / Codex
- 版本管理: Git + GitHub
