---
name: ppt-generation
version: 1.0.0
domain: shared
description: 将数智化咨询报告转化为专业PPT演示文稿,基于dashi-ppt-skill生成可编辑PPTX
author: digintel-lab
tags: [PPT, 演示文稿, 报告交付, PPTX]
depends_on:
  - name: dashi-ppt-skill
    type: npm
    install: npx dashi-ppt-skill@latest
    description: 提供PPT版式库、主题和PPTX导出能力
inputs:
  - name: 咨询报告内容
    required: true
    description: 来自 consulting-workflow agent 或单个 skill 输出的 markdown 报告
  - name: PPT需求
    required: false
    description: 页数限制、受众、风格偏好等
outputs:
  - name: PPT演示文稿
    format: pptx
    description: 可在 PowerPoint 中编辑的 .pptx 文件
  - name: 网页版编辑器
    format: html
    description: 可在浏览器中实时编辑的PPT预览页面
---

# 咨询报告PPT生成

## 触发条件
当需要将咨询报告转化为PPT演示文稿时激活。典型场景: 咨询交付物准备、项目汇报、管理层汇报。

## 前置条件
- 已有咨询报告内容(来自 consulting-workflow 或单个 skill)
- Node.js 20+ 和 npm
- 导出 PPTX 需要本机有 Chrome/Chromium/Edge

## 依赖安装

首次使用前需安装 dashi-ppt-skill:
```bash
npx dashi-ppt-skill@latest
```
国内网络:
```bash
npx --registry=https://registry.npmmirror.com dashi-ppt-skill@latest
```

## 工作机制

### 报告到PPT的映射规则

咨询报告的结构化内容按以下规则映射为PPT页面:

| 报告章节 | PPT页面类型 | dashi-ppt版式 | 说明 |
|---------|-----------|-------------|------|
| 报告标题 + 企业信息 | 封面 | cover | 标题+副标题+日期 |
| 报告目录 | 目录页 | toc | 各章节标题 |
| 执行摘要 | 指标页 | metrics | 核心结论3-5点 |
| 成熟度评估结果 | 指标页 + 趋势页 | metrics + trend | 等级评分+雷达图数据 |
| 七维度评分表 | 对比页 | comparison | 表格形式展示维度评分 |
| AI就绪度评分 | 指标页 | metrics | 四维度评分+就绪级别 |
| 差距分析 | 风险页 | risk | P0-P3差距清单 |
| 差距闭合路线图 | 流程页 | process | 时间轴展示 |
| 数据资产盘点 | 指标页 | metrics | 资产数量+质量评分 |
| 数据治理建议 | 对比页 | comparison | 现状-建议对比 |
| 综合建议 | 流程页 | process | 三阶段路线图 |
| 结尾页 | 结尾 | ending | 致谢+联系方式 |

### 主题选择指南

| 咨询场景 | 推荐主题 | 理由 |
|---------|---------|------|
| 央国企/政府 | 深蓝杂志 | 稳重、专业 |
| 制造业/工业 | 轻拟态 | 清晰、务实 |
| 金融/咨询 | 黑金实验 | 高端、商务 |
| 互联网/科技 | 炫光紫绿 | 现代、科技感 |
| 通用场景 | 玻璃糖果 | 简洁、亲和 |

## 执行流程

### 步骤1: 报告内容解析
- 输入: 咨询报告 markdown
- 处理:
  1. 识别报告结构(章节标题、表格、列表)
  2. 提取核心数据(评分、等级、差距数量等)
  3. 提取关键结论和建议
  4. 确定PPT页数(默认: 报告章节数 + 封面目录结尾)
- 输出: PPT内容大纲(每页标题+要点)

### 步骤2: 页面规划
- 输入: PPT内容大纲
- 处理:
  1. 按映射规则为每页选择版式(cover/toc/metrics/trend/comparison/risk/process/ending)
  2. 为数据型页面准备图表数据(雷达图/柱状图/表格)
  3. 选择视觉主题(根据行业或用户偏好)
  4. 确定页面顺序
- 输出: PPT页面规划表

### 步骤3: 调用 dashi-ppt-skill 生成
- 输入: PPT页面规划表 + 主题选择
- 处理:
  1. 调用 dashi-ppt-skill
  2. 传入结构化内容(每页的标题、内容、版式、数据)
  3. 选择主题风格
  4. 等待生成完成
- 输出: 网页版PPT编辑器(HTML)

### 步骤4: 导出PPTX
- 输入: 生成的PPT项目目录
- 处理:
  ```bash
  npm --prefix <项目目录> run export:pptx -- <输出目录>/咨询报告.pptx
  ```
- 输出: 可编辑 .pptx 文件

### 步骤5: 质量检查
- 输入: 生成的PPTX
- 处理:
  1. 检查页数是否完整
  2. 检查关键数据是否正确(评分、等级、差距数量)
  3. 检查图表是否渲染正确
  4. 检查文字是否有截断
- 输出: 质量检查报告(如有问题则调整重新生成)

## 输出模板

### PPT内容大纲模板

```
第1页 - 封面
  标题: {企业名称} 数智化转型咨询报告
  副标题: {咨询范围} | {日期}
  版式: cover

第2页 - 目录
  内容: 报告各章节
  版式: toc

第3页 - 执行摘要
  核心结论: {1-3句话}
  关键发现: {3-5个要点}
  建议优先行动: {3条}
  版式: metrics

第4页 - 成熟度评估
  当前等级: L{X}
  综合得分: {X.X}/5.0
  七维度评分: {表格数据}
  版式: metrics + comparison

第5页 - 成熟度雷达图
  数据: {七维度评分JSON}
  版式: trend (雷达图)

第6页 - AI就绪度诊断
  综合就绪度: {级别}
  四维度评分: {表格}
  关键阻塞点: {列表}
  版式: metrics

第7页 - 差距分析
  P0差距: {列表}
  P1差距: {列表}
  版式: risk

第8页 - 数据资产盘点
  资产总数: {N}项
  质量评分: {X.X}/5.0
  高价值资产: {列表}
  版式: metrics

第9页 - 综合建议与路线图
  第一阶段({时间}): {要点}
  第二阶段({时间}): {要点}
  第三阶段({时间}): {要点}
  版式: process

第10页 - 结尾
  版式: ending
```

## 降级策略
- dashi-ppt-skill 未安装 → 提示用户运行安装命令,或改为输出markdown格式的大纲(用户自行制作PPT)
- PPTX导出失败(无Chrome) → 仅输出HTML版编辑器,提示用户在浏览器中查看和编辑
- 报告内容不足 → 基于已有内容生成精简版PPT(封面+摘要+核心结论+结尾)
- 图表数据不完整 → 用文字+表格替代图表

## 关联 Skill
- 上游: 
  - `consulting-workflow` (Agent) — 提供完整咨询报告
  - `maturity-assessment` 等单个skill — 提供专项报告
- 下游: 无(最终交付物)
