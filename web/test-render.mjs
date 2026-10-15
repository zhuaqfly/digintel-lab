// 真实测试脚本：直接调用renderSlides生成报告，验证实际效果
import { renderSlides } from './lib/slides-template.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 符合新规范的测试数据（严格按照SKILL.md定义的13页结构）
const testDeck = {
  title: "某港口集团数智化成熟度评估报告",
  slides: [
    {
      type: "cover",
      badge: "成熟度评估",
      title: "某港口集团数智化成熟度评估报告",
      subtitle: "基于GB/T 43439-2023国家标准 · L1-L5五级 × 七维度全景评估",
      meta: ["客户：某港口集团", "日期：2026年8月", "数智咨询实验室"]
    },
    {
      type: "toc",
      kicker: "CONTENTS",
      title: "目录",
      quote: "综合成熟度2.14分，处于L2单元级，数据孤岛与AI空白是核心瓶颈",
      items: ["成熟度模型与评估框架", "成熟度评估结果", "差距诊断与根因分析", "改进举措与路线图"]
    },
    {
      type: "pyramid",
      kicker: "01 成熟度模型与评估框架",
      title: "成熟度分级模型——当前处于L2单元级：部门级系统建设，数据孤岛突出",
      chapter: "0