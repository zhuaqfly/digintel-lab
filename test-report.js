// 测试脚本：生成示例成熟度评估报告验证双主题
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 动态导入slides-template
const { renderSlides } = await import('./web/lib/slides-template.js');

// 示例成熟度评估slides数据
const sampleDeck = {
  title: '示例港口物流企业 数智化成熟度评估报告',
  slides: [
    {
      type: 'cover',
      badge: '成熟度评估',
      title: '示例港口物流企业\n数智化成熟度评估报告',
      subtitle: '基于GB/T 43439-2023国家标准 · L1-L5五级 × 七维度全景评估',
      meta: ['客户：示例港口集团', '日期：2026年8月', '数智咨询实验室']
    },
    {
      type: 'toc',
      kicker: 'CONTENTS',
      title: '目录',
      quote: '综合成熟度2.14分，处于L2单元级，距行业均值有0.86分差距',
      items: ['评估概述', '成熟度模型', '七维框架', '综合定级', '维度详解', '根因分析', '评分对比', '改进路线'],
      chapter: '目录'
    },
    {
      type: 'metrics',
      kicker: '01 评估概述',
      title: '核心指标速览——综合成熟度2.14分，处L2单元级',
      quote: '自动化领先但全域治理不足，数据价值未释放制约转型深化',
      cards: [
        { value: '2.14', label: '综合成熟度', unit: '分', note: '满分5.0' },
        { value: 'L2', label: '当前定级', note: '单元级' },
        { value: '11', label: '关键差距', unit: '项', note: 'P0阻塞3项' },
        { value: '35', label: '预期收益', unit: '%', note: '运营效率提升预估' }
      ],
      chapter: '评估概述'
    },
    {
      type: 'pyramid',
      kicker: '02 成熟度模型',
      title: '当前处于L2单元级——部门级系统初见成效但全局协同不足',
      chapter: '成熟度模型',
      quote: '模型依据：GB/T 43439-2023、中信联/AIITRE IOMM、DCMM',
      levels: [
        { level: 'L1', name: '起始级', feature: '局部信息化，无转型战略', passed: false },
        { level: 'L2', name: '单元级', feature: '部门级系统，单点应用', current: true },
        { level: 'L3', name: '流程级', feature: '跨部门流程贯通，数据驱动运营', passed: false },
        { level: 'L4', name: '网络级', feature: '企业级平台化，智能嵌入业务', passed: false },
        { level: 'L5', name: '生态级', feature: '数智原生，产业链协同', passed: false }
      ]
    },
    {
      type: 'polygon',
      kicker: '03 评估框架',
      title: '七维度评估框架——覆盖战略-组织-业务-数据-技术-智能-生态全景',
      chapter: '评估框架',
      center: '数智化转型',
      nodes: [
        { title: '战略与领导力', desc: '转型战略、高层推动、治理机制' },
        { title: '组织与人才', desc: '组织设置、人才梯队、变革文化' },
        { title: '业务与流程', desc: '业务线上化、流程集成、体验数字化' },
        { title: '数据要素', desc: '数据资产化、治理水平、数据驱动' },
        { title: '技术与架构', desc: '云平台、系统集成、架构现代化' },
        { title: '智能应用', desc: 'AI场景覆盖、价值量化、AI治理' },
        { title: '价值与生态', desc: 'ROI显性化、模式创新、生态协同' }
      ]
    },
    {
      type: 'radar',
      kicker: '04 综合定级',
      title: '七维度评分总览——业务流程领先，数据要素亟待补强',
      chapter: '综合定级',
      quote: '综合得分2.14/5.0，较行业均值3.0有0.86分差距',
      dims: [
        { label: '战略与领导力', value: 2.5, peer: 3.0, target: 3.5 },
        { label: '组织与人才', value: 2.0, peer: 2.8, target: 3.2 },
        { label: '业务与流程', value: 2.8, peer: 3.2, target: 3.8 },
        { label: '数据要素', value: 1.5, peer: 2.7, target: 3.0 },
        { label: '技术与架构', value: 2.2, peer: 2.9, target: 3.4 },
        { label: '智能应用', value: 1.8, peer: 2.5, target: 3.2 },
        { label: '价值与生态', value: 2.2, peer: 3.0, target: 3.5 }
      ],
      bullets: [
        { text: '优势维度：业务与流程(2.8)、战略与领导力(2.5)，基础较好', sub: '核心业务系统已覆盖，可作为标杆推广' },
        { text: '短板维度：数据要素(1.5)，距行业均值差距1.2分最大', sub: '需作为P0优先级重点突破' },
        { text: '目标水平：12个月内达到L3，综合分3.2分', sub: '聚焦数据治理+AI场景双轮驱动' }
      ]
    },
    {
      type: 'cards',
      kicker: '05 维度详解',
      title: '七维度深度解析——优势与短板逐项拆解',
      chapter: '维度详解',
      cols: 2,
      cards: [
        { title: '战略与领导力', score: 2.5, status: '待提升', statusClass: 'warn', items: ['现状：有数字化专项规划，但与业务战略结合不够紧密', '优势：高层重视，有专项预算和CIO岗位', '不足：转型治理机制待完善，跨部门协同弱', '评分依据：有规划但未贯穿业务，部门墙明显'] },
        { title: '组织与人才', score: 2.0, status: '待提升', statusClass: 'warn', items: ['现状：设IT部门，但数字化人才占比不足5%', '优势：有培训体系，员工数字化意识逐步提升', '不足：复合型人才稀缺，考核未与转型挂钩', '评分依据：IT支撑为主，业务与数字化两张皮'] },
        { title: '业务与流程', score: 2.8, status: '达标', statusClass: 'ok', items: ['现状：TOS/ERP等核心系统上线，覆盖率80%', '优势：核心业务线上化程度高，自动化领先', '不足：端到端流程未贯通，客户体验断点多', '评分依据：部门内系统成熟，但跨部门协同不足'] },
        { title: '数据要素', score: 1.5, status: '落后', statusClass: 'danger', items: ['现状：数据散落各系统，无统一数据标准', '优势：核心业务系统数据沉淀较完整', '不足：数据质量差，无治理体系，数据孤岛严重', '评分依据：DCMM对标初始级，数据价值未释放'] },
        { title: '技术与架构', score: 2.2, status: '待提升', statusClass: 'warn', items: ['现状：传统架构为主，部分系统上云', '优势：基础设施完善，网络稳定性好', '不足：烟囱式系统多，集成困难，无中台能力', '评分依据：系统部分集成，但架构现代化不足'] },
        { title: '智能应用', score: 1.8, status: '待提升', statusClass: 'warn', items: ['现状：个别AI试点(如智能闸口)，未规模化', '优势：有AI探索意识和试点基础', '不足：场景碎片化，无闭环，价值未量化', '评分依据：点状试点，未形成规模化应用'] }
      ]
    },
    {
      type: 'tree',
      kicker: '06 根因分析',
      title: '核心短板根因分析——数据价值未释放的三层MECE拆解',
      chapter: '根因分析',
      problem: '数据要素短板制约数智化转型深化',
      roots: [
        { title: '战略层缺失', causes: ['数据战略未对齐业务战略', '无CDO/数据治理组织', '数据投入优先级低'] },
        { title: '治理层空白', causes: ['无统一数据标准', '数据质量无管控', '数据安全体系不完善'] },
        { title: '技术层薄弱', causes: ['无统一数据平台', '系统集成度低', '数据工具链缺失'] }
      ]
    },
    {
      type: 'bar',
      kicker: '07 评分对比',
      title: '七维度评分 vs 行业均值对比——数据要素差距1.2分最大',
      chapter: '评分对比',
      bars: [
        { label: '战略与领导力', value: 2.5, peer: 3.0, max: 5 },
        { label: '组织与人才', value: 2.0, peer: 2.8, max: 5 },
        { label: '业务与流程', value: 2.8, peer: 3.2, max: 5 },
        { label: '数据要素', value: 1.5, peer: 2.7, max: 5 },
        { label: '技术与架构', value: 2.2, peer: 2.9, max: 5 },
        { label: '智能应用', value: 1.8, peer: 2.5, max: 5 },
        { label: '价值与生态', value: 2.2, peer: 3.0, max: 5 }
      ]
    },
    {
      type: 'process',
      kicker: '08 改进路线',
      title: '三阶段改进路线图——筑基→跃升→引领，18个月达到L3',
      chapter: '改进路线',
      steps: [
        { phase: '短期·筑基', time: '0-3个月', num: '01', desc: '顶层设计+数据治理启动+3个高价值AI场景POC验证' },
        { phase: '中期·跃升', time: '3-12个月', num: '02', desc: '数据平台建设+核心流程贯通+AI场景规模化推广' },
        { phase: '长期·引领', time: '12-18个月', num: '03', desc: '数据资产运营+生态协同对接+数智能力对外输出' }
      ],
      bullets: [
        { text: '预期投入：约2800万，分阶段投入', sub: '优先保障P0数据治理和AI场景举措' },
        { text: '里程碑：3个月见效，12个月L3，18个月行业领先', sub: '建立PMO月度跟踪机制' },
        { text: '风险提示：组织变革阻力是最大风险', sub: '建议高层挂帅，配套激励机制' }
      ]
    },
    {
      type: 'ending',
      title: '谢 谢',
      subtitle: '数智化转型是一场长期主义的变革',
      meta: ['数智咨询实验室', 'DIGINTEL LAB', 'www.digintel-lab.com']
    }
  ]
};

// 输出目录
const outputDir = path.join(__dirname, 'output', 'test-theme-demo');
const pptDir = path.join(outputDir, 'ppt');
await fs.mkdir(pptDir, { recursive: true });

// 生成红色主题报告
const htmlRed = renderSlides(sampleDeck, { theme: 'red', projectName: '示例项目' });
await fs.writeFile(path.join(pptDir, 'theme-red.html'), htmlRed, 'utf8');
console.log('✅ 红色主题报告已生成: output/test-theme-demo/ppt/theme-red.html');

// 生成蓝色主题报告
const htmlBlue = renderSlides(sampleDeck, { theme: 'blue', projectName: '示例项目' });
await fs.writeFile(path.join(pptDir, 'theme-blue.html'), htmlBlue, 'utf8');
console.log('✅ 蓝色主题报告已生成: output/test-theme-demo/ppt/theme-blue.html');

// 保存goal.json
const goal = {
  id: 'test-theme-demo',
  title: '双主题演示 - 数智化成熟度评估报告',
  theme: 'both',
  pageCount: sampleDeck.slides.length,
  slides: sampleDeck.slides,
  createdAt: new Date().toISOString(),
};
await fs.writeFile(path.join(outputDir, 'goal.json'), JSON.stringify(goal, null, 2), 'utf8');

console.log('\n🎉 双主题报告生成完成！');
console.log('📊 报告页数:', sampleDeck.slides.length);
console.log('🎨 主题: 品牌红(red) + 科技蓝(blue)');
console.log('\n预览方式:');
console.log('  1. 启动开发服务器: cd web && npm run dev');
console.log('  2. 访问: http://localhost:3100/api/files/test-theme-demo/ppt/theme-red.html');
console.log('  3. 访问: http://localhost:3100/api/files/test-theme-demo/ppt/theme-blue.html');
