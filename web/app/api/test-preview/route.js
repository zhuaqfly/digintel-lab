import { renderSlides } from '@/lib/slides-template';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TEST_DECK = {
  title: '某港口集团数智化成熟度评估报告',
  slides: [
    {
      type: 'cover',
      badge: '成熟度评估',
      title: '某港口集团数智化成熟度评估报告',
      subtitle: '基于GB/T 43439-2023国家标准 · L1-L5五级 × 七维度全景评估',
      meta: ['客户：某港口集团', '日期：2026年8月', '数智咨询实验室']
    },
    {
      type: 'toc',
      kicker: 'CONTENTS',
      title: '目录',
      items: [
        { main: '成熟度模型与评估框架', sub: '评估方法论与能力框架介绍' },
        { main: '成熟度评估结果', sub: '综合定级、七维度评分与优劣势分析' },
        { main: '差距诊断与根因分析', sub: '量化差距对比与核心问题根因拆解' },
        { main: '改进举措与路线图', sub: '优先级排序、实施路径与预期价值' }
      ]
    },
    {
      type: 'pyramid',
      kicker: '01 成熟度模型与评估框架',
      title: '成熟度分级模型——GB/T 43439-2023 L1-L5五级演进路径',
      chapter: '01 成熟度模型与评估框架',
      modelDesc: '本评估依据GB/T 43439-2023《数字化成熟度模型》国家标准，结合港口行业特性，将数智化成熟度划分为5个递进等级，从单点信息化到生态化引领，逐级递进。评估覆盖战略、组织、业务、数据、技术、AI、价值七大核心维度。',
      levels: [
        { 
          level: 'L1', name: '起始级',
          features: ['业务单点信息化', '无统一转型战略', '数据分散孤立', 'IT仅作支撑职能']
        },
        { 
          level: 'L2', name: '单元级',
          features: ['部门级系统建设', '核心业务线上化', '部门内数据可用', 'IT驱动局部优化']
        },
        { 
          level: 'L3', name: '流程级',
          features: ['跨部门流程贯通', '企业级数据共享', '数据驱动决策', '业务IT深度融合']
        },
        { 
          level: 'L4', name: '网络级',
          features: ['平台化能力复用', 'AI深度嵌入业务', '产业链数据协同', '数字业务创新']
        },
        { 
          level: 'L5', name: '生态级',
          features: ['数智原生组织', '智能自主决策', '生态价值网络', '行业能力输出']
        }
      ]
    },
    {
      type: 'house',
      kicker: '01 成熟度模型与评估框架',
      title: '七维度评估框架——麦肯锡屋形模型：七大能力支柱共同支撑数智化转型',
      chapter: '01 成熟度模型与评估框架',
      frameworkNote: '该框架采用"屋形"结构：以价值实现为屋顶目标，七大核心能力为支柱，治理/组织/人才/安全为地基，系统评估企业数智化转型的完整能力体系。各维度相互支撑、协同演进。',
      goal: '数智化价值实现',
      goalSub: '效率提升 · 成本优化 · 模式创新',
      foundation: '治理体系 · 组织架构 · 人才文化 · 安全合规',
      pillars: [
        { title: '战略领导力', keyPoints: ['转型战略规划', '高层推动力度', '治理机制设计'] },
        { title: '组织人才', keyPoints: ['组织设置', '人才梯队', '变革文化'] },
        { title: '业务流程', keyPoints: ['业务线上化', '流程集成度', '体验数字化'] },
        { title: '数据要素', keyPoints: ['数据资产化', '治理体系', '数据驱动'] },
        { title: '技术架构', keyPoints: ['云原生平台', '系统集成', '架构现代化'] },
        { title: '智能应用', keyPoints: ['AI场景覆盖', '价值量化', 'AI治理'] },
        { title: '价值生态', keyPoints: ['ROI度量', '模式创新', '生态协同'] }
      ]
    },
    {
      type: 'metrics',
      kicker: '02 成熟度评估结果',
      title: '核心指标速览——综合成熟度2.14分，处于L2单元级向L3流程级跨越关键期',
      chapter: '02 成熟度评估结果',
      cards: [
        { value: '2.14', label: '综合成熟度', unit: '分', benchmark: '行业均值2.41', highlight: true },
        { value: 'L2', label: '当前定级', benchmark: '目标：18个月达L3' },
        { value: '3', label: '优势维度', unit: '项', benchmark: '战略/组织/业务基础较好', trend: '高于均值', trendDir: 'up' },
        { value: '4', label: '短板维度', unit: '项', benchmark: '数据/技术/AI/价值待提升', trend: '低于均值', trendDir: 'down' }
      ],
      findings: [
        { text: '战略与组织基础扎实，高层共识是核心优势', implication: '董事长挂帅、三年规划发布、预算逐年增长，为系统性转型奠定了组织保障和资源基础' },
        { text: '核心生产系统成熟，但跨系统协同不足', implication: 'TOS、ERP等核心系统深度应用，但20+系统烟囱式建设，形成数据孤岛，跨部门协同依赖人工' },
        { text: '数据孤岛问题突出，成为最大瓶颈制约', implication: '数据标准不统一、主数据缺失、质量无考核，报表周期T+3，无法支撑实时运营决策' },
        { text: 'AI应用几乎空白，与头部企业差距显著', implication: '仅财务OCR试点，智能调度、预测维护等核心场景未涉及，作业效率依赖人工经验' },
        { text: '技术架构滞后，云原生和中台能力薄弱', implication: '系统间点对点集成，无统一技术平台，算力资源分散，新功能上线周期平均3-6个月' },
        { text: '价值度量体系缺失，投入产出难以量化', implication: '无ROI追踪框架，数字化价值无法显性化，影响持续投入信心和业务部门参与积极性' }
      ]
    },
    {
      type: 'radar',
      kicker: '02 成熟度评估结果',
      title: '七维度成熟度雷达图——战略领先，AI应用短板最为突出',
      chapter: '02 成熟度评估结果',
      summary: '综合得分2.14/5.0，较行业均值2.41存在0.27分差距。呈现"头重脚轻"特征：战略组织层表现较好，但数据、AI等执行层能力严重滞后，形成"战略-执行断层"。',
      dims: [
        { label: '战略与领导力', value: 2.8, peer: 2.5, target: 3.5, comment: '三年规划已发布，高层共识度高，预算占比超行业均值' },
        { label: '组织与人才', value: 2.5, peer: 2.3, target: 3.2, comment: '专职数推办运作良好，但复合型人才缺口明显' },
        { label: '业务与流程', value: 2.3, peer: 2.5, target: 3.3, comment: '核心系统成熟，跨部门端到端流程尚未打通' },
        { label: '数据要素', value: 1.9, peer: 2.4, target: 3.0, comment: '数据孤岛严重，缺治理体系，是基础性短板' },
        { label: '技术与架构', value: 2.2, peer: 2.6, target: 3.4, comment: '烟囱式系统为主，无统一中台，云原生比例低' },
        { label: '智能应用', value: 1.2, peer: 2.0, target: 2.8, comment: '仅OCR试点，核心生产场景AI应用完全空白' },
        { label: '价值与生态', value: 1.8, peer: 2.2, target: 3.0, comment: '价值度量缺失，口岸生态协同尚未起步' }
      ]
    },
    {
      type: 'strengths',
      kicker: '02 成熟度评估结果',
      title: '优势维度深度分析——已建立良好基础的能力领域',
      chapter: '02 成熟度评估结果',
      dimensions: [
        {
          title: '战略与领导力',
          score: '2.8',
          level: 'L2+ 接近L3',
          status: '集团层面已发布三年数字化转型战略，成立由董事长挂帅的数字化转型领导小组，转型预算逐年增长，C级管理层共识度高',
          evidence: [
            '已发布《数字化转型三年规划(2025-2027)》',
            '数字化转型领导小组每季度召开推进会',
            '年度数字化预算占营收1.2%，高于行业平均0.8%',
            '将数字化KPI纳入部门负责人考核'
          ],
          value: '高层共识和战略定力是转型成功的首要条件，为后续系统性变革提供了组织保障和资源基础'
        },
        {
          title: '组织与人才',
          score: '2.5',
          level: 'L2 单元级',
          status: '已设立数字化推进办公室（15人专职团队），各业务部门设有数字化对接人，年度数字化培训覆盖核心管理层',
          evidence: [
            '数字化推进办公室独立运作，直接向CIO汇报',
            '已建立内部数字化人才认证体系',
            '每年组织2次中高层数字化认知培训',
            '核心业务部门IT人员配比达1:20'
          ],
          value: '专职团队和对接人机制保障了转型举措的落地执行，人才意识培养初见成效'
        },
        {
          title: '业务与流程',
          score: '2.3',
          level: 'L2 单元级',
          status: '核心生产系统（TOS码头操作系统、ERP）已成熟应用，码头作业、堆场管理等核心流程数字化覆盖率达80%',
          evidence: [
            'TOS系统覆盖所有集装箱码头作业',
            'ERP系统实现财务、采购、HR一体化',
            '电子单证覆盖率达70%',
            '客户服务线上化率65%'
          ],
          value: '核心生产系统的成熟应用为后续跨部门流程集成和数据驱动奠定了业务基础'
        }
      ]
    },
    {
      type: 'weaknesses',
      kicker: '02 成熟度评估结果',
      title: '短板维度深度分析——制约价值释放的核心瓶颈',
      chapter: '02 成熟度评估结果',
      dimensions: [
        {
          title: '智能应用',
          score: '1.2',
          gap: '较行业均值低0.8分',
          status: 'AI应用几乎空白，仅在财务OCR有试点，生产运营、客户服务、决策支持等核心场景未引入AI',
          gapDesc: '行业头部港口已在智能调度、设备预测维护、智能闸口等场景实现规模化AI应用，效率提升15-30%',
          rootCause: '①数据基础薄弱无法支撑AI建模；②业务部门对AI场景价值认知不足；③缺乏AI专业团队和方法论',
          businessImpact: '作业效率依赖人工经验，设备非计划停机率高（8% vs 行业5%），高峰期拥堵频发，运营成本居高不下'
        },
        {
          title: '数据要素',
          score: '1.9',
          gap: '较行业均值低0.5分',
          status: '数据分散在20+独立系统中，数据标准不统一，主数据管理缺失，数据质量问题突出，跨系统数据共享困难',
          gapDesc: '行业领先企业已建成统一数据中台，数据可用率达90%+，支撑实时决策和智能应用',
          rootCause: '①缺乏企业级数据治理组织和流程；②无统一数据平台，系统间点对点集成；③数据质量无人负责，无考核机制',
          businessImpact: '数据不一致导致决策偏差，跨部门协同依赖人工对账，报表产出周期长（T+3），无法支撑实时运营'
        },
        {
          title: '价值与生态',
          score: '1.8',
          gap: '较行业均值低0.4分',
          status: '数字化投入价值难以量化，未建立ROI度量体系，数据价值未变现，口岸生态协同尚未起步',
          gapDesc: '领先港口已通过数据服务、智慧口岸协同等模式创造新收入，数字化贡献营收占比达5-8%',
          rootCause: '①缺少价值度量框架和追踪机制；②数据未资产化，无对外服务能力；③口岸单位协同机制缺失',
          businessImpact: '持续投入信心不足，数字化价值无法显性化，错失港口生态主导权和数据变现机会'
        }
      ]
    },
    {
      type: 'gap',
      kicker: '03 差距诊断与根因分析',
      title: '维度差距量化对比——智能应用差距0.8分为最大短板',
      chapter: '03 差距诊断与根因分析',
      comparisonNote: '对比基准：本企业得分基于30+高管访谈、50+份问卷、系统调研综合评定；行业均值基于国内15家同等规模港口集团2025年调研数据',
      gapInterpretation: '差距呈现"执行层>战略层"特征：战略和组织（顶层）差距较小甚至领先，但数据、AI等执行层面差距显著，形成典型的"战略-执行断层"。智能应用1.2分与行业2.0分的0.8分差距是当前最突出短板，直接制约价值释放；数据要素1.9分是基础性瓶颈，不解决数据问题，AI和价值实现无从谈起。',
      bars: [
        { label: '战略与领导力', value: 2.8, peer: 2.5, max: 5 },
        { label: '组织与人才', value: 2.5, peer: 2.3, max: 5 },
        { label: '业务与流程', value: 2.3, peer: 2.5, max: 5 },
        { label: '技术与架构', value: 2.2, peer: 2.6, max: 5 },
        { label: '价值与生态', value: 1.8, peer: 2.2, max: 5 },
        { label: '数据要素', value: 1.9, peer: 2.4, max: 5 },
        { label: '智能应用', value: 1.2, peer: 2.0, max: 5 }
      ],
      benchmarks: [
        {
          company: '新加坡港PSA',
          score: '4.2',
          level: 'L4 网络级（全球标杆）',
          practices: [
            '建成统一数据湖，200+AI场景规模化运营',
            '智能调度系统使船舶周转效率提升40%',
            '数字孪生码头实现全流程仿真优化',
            '数据服务API对外开放，年创收超2亿美元'
          ]
        },
        {
          company: '上海港集团',
          score: '3.5',
          level: 'L3+ 流程级领先',
          practices: [
            '数据中台整合30+业务系统，数据可用率95%',
            '洋山四期全自动化码头，AI调度全覆盖',
            '设备预测性维护降低非计划停机率至3%',
            '口岸单位数据协同效率提升60%'
          ]
        },
        {
          company: '招商局港口',
          score: '3.1',
          level: 'L3 流程级（国内先进）',
          practices: [
            '"一体三翼"数字化治理架构，CTO直管',
            '6大核心业务平台实现跨港区协同',
            '智能闸口覆盖率100%，集卡停留时间降50%',
            '建立数字化价值度量体系，ROI可追踪'
          ]
        }
      ]
    },
    {
      type: 'root_cause',
      kicker: '03 差距诊断与根因分析',
      title: '核心短板根因诊断——MECE逻辑树拆解与优先级排序',
      chapter: '03 差距诊断与根因分析',
      problem: '数据孤岛严重、AI场景空白制约数智化价值释放',
      conclusion: '根因诊断结论：数据治理缺失是"因"，AI场景空白是"果"，复合型人才短缺和价值度量空白是持续制约因素。建议按照"数据筑基→AI破局→平台赋能→价值闭环"的路径推进，优先解决数据治理和AI高价值场景两大P0级问题。',
      roots: [
        { 
          title: '数据治理体系缺失', 
          priority: 'P0',
          impact: '影响所有维度',
          causes: ['无企业级数据标准', '缺少数据治理组织', '数据质量无考核', '主数据管理空白']
        },
        { 
          title: 'AI场景方法论缺失', 
          priority: 'P0',
          impact: '直接影响价值实现',
          causes: ['业务痛点未系统梳理', 'AI技术认知不足', '缺少场景筛选机制', '无POC快速验证流程']
        },
        { 
          title: '技术平台底座薄弱', 
          priority: 'P1',
          impact: '制约规模化推广',
          causes: ['系统烟囱式建设', '无统一集成平台', '算力资源分散', '云原生架构未落地']
        },
        { 
          title: '复合型人才断层', 
          priority: 'P1',
          impact: '长期能力建设',
          causes: ['业务不懂技术', '技术不懂业务', 'AI专业团队缺失', '激励机制不匹配']
        },
        { 
          title: '价值度量体系空白', 
          priority: 'P2',
          impact: '影响持续投入',
          causes: ['无价值评估框架', 'ROI难以量化追踪', '成功标准不清晰', '业务价值认同度低']
        }
      ]
    },
    {
      type: 'roadmap',
      kicker: '04 改进举措与路线图',
      title: '三阶段实施路线图——筑基→跃升→引领，18个月达成L3流程级',
      chapter: '04 改进举措与路线图',
      totalMonths: 18,
      roadmapSummary: '整体策略："短期速赢建立信心→中期体系化构建能力→长期创新引领发展"。18个月内实现从L2单元级到L3流程级的跨越，综合成熟度提升至3.0+，重点打造"数据驱动+智能运营"两大核心能力。',
      steps: [
        {
          phase: '短期·筑基',
          time: '0-3个月',
          startMonth: 0,
          endMonth: 3,
          objective: '顶层设计完成，启动数据治理，2个高价值AI场景POC快速见效，建立变革信心',
          investment: '约1300万',
          deliverables: '转型顶层规划、数据治理方案、AI场景POC成果',
          milestones: ['完成转型顶层规划设计', '成立数据治理委员会', '发布数据标准V1.0', '设备预测维护POC启动', '智能调度POC启动', '首批速赢项目见效']
        },
        {
          phase: '中期·跃升',
          time: '3-12个月',
          startMonth: 3,
          endMonth: 12,
          objective: '数据平台建成投用，核心流程端到端贯通，5+AI场景规模化落地，能力体系化',
          investment: '约3200万',
          deliverables: '数据中台一期、核心流程贯通、AI场景规模化应用',
          milestones: ['数据平台一期上线', '核心主数据治理完成', 'TOS-ERP端到端贯通', '5个AI场景生产化', '数字化人才梯队成型', '价值度量体系建立']
        },
        {
          phase: '长期·引领',
          time: '12-18个月',
          startMonth: 12,
          endMonth: 18,
          objective: '数据资产化运营，口岸生态协同起步，能力对外输出，达成L3流程级',
          investment: '约2000万',
          deliverables: '数据资产运营体系、口岸协同平台、能力输出产品',
          milestones: ['数据资产目录发布', '数据服务API上线', '口岸数据协同启动', 'AI自主决策闭环', '对外输出解决方案', '综合成熟度达3.0+']
        }
      ]
    },
    {
      type: 'initiatives',
      kicker: '04 改进举措与路线图',
      title: '关键举措优先级矩阵——影响×难度二维排序，聚焦高价值快赢',
      chapter: '04 改进举措与路线图',
      expectedOutcome: '18个月整体预期：综合成熟度从2.14提升至3.0+，达到L3流程级；运营效率提升20%，设备非计划停机率降低40%，库存周转率提升25%，数字化转型投入ROI达1:3，新业务（数据服务）年收入贡献超5000万。',
      initiatives: [
        {
          priority: 'P0',
          name: '数据治理专项行动',
          desc: '建立企业级数据治理组织、标准、流程，启动核心主数据治理',
          impact: 'high',
          difficulty: 'low',
          value: '数据可用率提升至90%+',
          roi: '1:4',
          timeline: '0-6个月'
        },
        {
          priority: 'P0',
          name: 'AI高价值场景快速突破',
          desc: '设备预测维护、智能调度2个场景POC→生产化，快速验证价值',
          impact: 'high',
          difficulty: 'low',
          value: '作业效率提升15%+',
          roi: '1:5',
          timeline: '0-6个月'
        },
        {
          priority: 'P1',
          name: '统一数据中台建设',
          desc: '构建企业级数据平台，实现数据统一采集、存储、计算、服务',
          impact: 'high',
          difficulty: 'high',
          value: '支撑全集团数据共享',
          roi: '1:3',
          timeline: '3-12个月'
        },
        {
          priority: 'P1',
          name: '核心流程端到端贯通',
          desc: 'TOS-ERP-财务-客户全流程打通，消除流程断点',
          impact: 'high',
          difficulty: 'high',
          value: '流程效率提升30%',
          roi: '1:2.5',
          timeline: '6-12个月'
        },
        {
          priority: 'P1',
          name: '数字化人才梯队建设',
          desc: '培养业务+技术+AI复合型人才，建立数字化人才认证体系',
          impact: 'high',
          difficulty: 'medium',
          value: '人才自给率达80%',
          roi: '长期',
          timeline: '3-18个月'
        },
        {
          priority: 'P2',
          name: '价值度量体系建立',
          desc: '建立数字化项目ROI度量框架和追踪机制',
          impact: 'medium',
          difficulty: 'low',
          value: '投入价值显性化',
          roi: '-',
          timeline: '6-9个月'
        },
        {
          priority: 'P2',
          name: '口岸数据协同平台',
          desc: '联合海关、海事、物流企业构建口岸数据共享生态',
          impact: 'medium',
          difficulty: 'high',
          value: '口岸效率提升20%',
          roi: '生态价值',
          timeline: '12-18个月'
        }
      ]
    },
    {
      type: 'ending',
      title: '谢 谢',
      subtitle: '数智化转型是一场长期主义的变革',
      contact: '如有任何问题，请联系数智咨询实验室',
      meta: ['数智咨询实验室', 'DIGINTEL LAB', '2026年8月']
    }
  ]
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const theme = searchParams.get('theme') || 'red';
  
  const html = renderSlides(TEST_DECK, { theme, brand: '数智咨询实验室' });
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
