// 数智化转型咨询全生命周期 · 六阶段定义
// 纯常量模块，客户端组件与服务端 API 均可引用

export const STAGES = [
  {
    key: 'align',
    index: 1,
    name: '战略启航',
    en: 'Align',
    icon: '🧭',
    duration: '2-4 周',
    goal: '统一思想，找准锚点',
    desc: '高层达成转型共识，明确转型动机、范围与预期，完成立项',
    activities: [
      '设计高层访谈提纲',
      '开展高管访谈并形成纪要',
      '战略对齐与愿景梳理（战略屋）',
      '编制立项书与项目章程',
      '召开项目启动会',
    ],
    agents: [{ dir: 'consulting-workflow', name: '咨询总编排' }],
    skills: [
      {
        dir: '0-strategy/executive-interview',
        name: '高层访谈提纲设计',
        primaryDeliverable: '高层访谈提纲',
        deliverableTemplate: 'interview-outline',
        prompts: [
          '我需要设计数智化转型项目的高层访谈提纲，访谈对象包括CEO/总裁、业务VP、CIO/CDO、CFO。请基于executive-interview方法论，为每个角色设计结构化访谈提纲，包含开场、核心问题、收尾三部分，标注每个问题的挖掘要点',
          '基于当前企业背景（行业、规模），设计CEO/一号位的深度访谈提纲，重点挖掘转型动机、战略意图、期望成果、底线顾虑、决心投入五个维度',
          '我们即将开展高管访谈，请输出访谈准备清单（含访谈安排建议、材料准备、注意事项、追问技巧）'
        ]
      },
      {
        dir: '0-strategy/interview-summary',
        name: '高层访谈纪要整理',
        primaryDeliverable: '高层访谈纪要',
        deliverableTemplate: 'interview-notes',
        prompts: [
          '以下是我们完成的高管访谈记录（用户将粘贴访谈笔记/录音转写），请基于访谈纪要方法论，按角色整理为结构化访谈纪要，提炼核心诉求、关键痛点、期望成果、底线顾虑、情绪信号（🔴强信号/🟡中信号/🟢弱信号）',
          '请基于访谈内容，输出高管观点对比矩阵：对比CEO/业务VP/CIO/CFO在转型动机、期望、顾虑、投入意愿四个维度的共识与分歧',
          '请基于多轮高管访谈结论，提炼3-5条核心战略洞察和速赢机会，为后续战略对齐提供输入'
        ]
      },
      {
        dir: '0-strategy/strategy-alignment',
        name: '战略对齐与愿景梳理',
        primaryDeliverable: '转型战略屋',
        deliverableTemplate: 'strategy-house',
        prompts: [
          '基于高层访谈结论，帮助梳理数智化转型愿景：请使用战略屋（Strategy House）方法论，输出包含转型愿景（屋顶）、战略目标（横梁）、核心战场（支柱）、关键举措（基石）、保障体系（地基）的完整框架',
          '我需要对齐高管团队的转型共识。请基于访谈结论，识别不同高管之间的共识点和分歧点（愿景分歧/优先级分歧/投入分歧/主导权分歧），给出弥合建议',
          '请用SMART原则帮助制定转型战略目标：从业务增长、效率提升、客户体验、决策智能、能力底座五个维度中选择3-5个核心目标，给出基线值→目标值→衡量方式的具体建议'
        ]
      },
      {
        dir: '0-strategy/project-charter',
        name: '转型立项与章程',
        primaryDeliverable: '转型立项书',
        deliverableTemplate: 'project-charter',
        prompts: [
          '基于已完成的高层访谈和战略对齐结论，编制数智化转型项目立项书，包含背景动因、愿景目标、项目范围（用MoSCoW法则标注优先级）、核心价值、路线图里程碑、治理结构、资源预算、风险管理、成功标准、下一步行动十个章节',
          '请输出项目章程（Project Charter），包含项目名称编号、Sponsor/Owner/PM明确到人、决策机制、变更控制流程、沟通机制、签字栏等核心条款',
          '请设计项目启动会（Kick-off Meeting）材料大纲，Sponsor站台、项目目标、路线图、团队介绍、支持要求、Q&A六个模块，标注每个模块的建议时长和主讲人'
        ]
      }
    ],
    deliverables: ['高层访谈提纲', '高层访谈纪要', '转型战略屋', '转型立项书', '项目章程', '启动会材料'],
    kickoff:
      '我们即将启动数智化转型战略启航阶段。首先需要设计高层访谈提纲，对CEO/业务VP/CIO/CFO等关键高管开展访谈；完成访谈后整理访谈纪要，提炼战略洞察；然后基于访谈结论完成战略对齐，梳理转型愿景和战略目标（输出战略屋）；最后编制立项书和项目章程，召开项目启动会完成正式立项。请引导我们一步步完成本阶段工作。',
  },
  {
    key: 'diagnose',
    index: 2,
    name: '诊断评估',
    en: 'Diagnose',
    icon: '🔍',
    duration: '4-6 周',
    goal: '摸清家底，找准差距',
    desc: '客观评估现状，量化成熟度与就绪度，识别关键差距与改进优先级',
    activities: [
      '数智化成熟度七维评估',
      'AI 就绪度评估',
      '数据资产盘点',
      '差距分析与标杆对标',
    ],
    agents: [{ dir: 'diagnosis-agent', name: '诊断评估专家' }],
    skills: [
      {
        dir: '1-diagnosis/maturity-assessment',
        name: '成熟度评估',
        primaryDeliverable: '成熟度评估报告',
        deliverableTemplate: 'maturity-report',
        prompts: [
          '基于当前企业信息，按照成熟度评估Skill方法论，开展七维度L1-L5成熟度评估，给出综合得分、各维度评分、优劣势分析',
          '我已经提供了企业基本信息和系统现状，请完成成熟度定级，并输出雷达图评分数据和关键发现',
          '请基于GB/T 43439-2023标准，对战略、组织、业务、数据、技术、AI、价值七个维度进行详细评分，每个维度给出评分依据'
        ]
      },
      {
        dir: '1-diagnosis/readiness-diagnosis',
        name: 'AI就绪度诊断',
        primaryDeliverable: 'AI就绪度诊断报告',
        deliverableTemplate: 'ai-readiness',
        prompts: [
          '开展AI就绪度四维诊断（数据、技术、组织、场景），评估企业当前AI应用基础，给出就绪度等级和关键缺口',
          '基于企业现状，分析AI转型就绪度，指出数据基础、技术能力、组织准备、场景储备四个方面的差距'
        ]
      },
      {
        dir: '1-diagnosis/data-asset-audit',
        name: '数据资产盘点',
        primaryDeliverable: '数据资产盘点表',
        deliverableTemplate: 'data-asset-audit',
        prompts: [
          '开展数据资产盘点：梳理主数据、交易数据、IoT数据、非结构化数据等六类资产现状，评估数据质量和价值',
          '基于企业现有系统，盘点数据资产分布，识别数据孤岛和断点，给出数据资产全景视图'
        ]
      },
      {
        dir: '1-diagnosis/gap-analysis',
        name: '差距分析',
        primaryDeliverable: '差距分析报告',
        deliverableTemplate: 'gap-analysis',
        prompts: [
          '对标行业领先企业，开展差距分析：识别P0-P3优先级差距，进行根因诊断，给出闭合建议',
          '基于成熟度评估结果，对比行业标杆，量化各维度差距，找出核心瓶颈和根因，给出优先级排序'
        ]
      }
    ],
    deliverables: ['成熟度评估报告', 'AI就绪度诊断报告', '数据资产盘点表', '差距分析报告'],
    kickoff:
      '请基于本项目企业信息，开展数智化转型成熟度诊断：依据 GB/T 43439-2023 五大视角与中信联/AIITRE 五级体系，完成七维度评分（战略与领导力、组织与人才、业务与流程、数据要素、技术与架构、智能应用、价值与生态），输出成熟度定级（L1-L5）、雷达图数据、评分依据与改进优先级建议。',
  },
  {
    key: 'design',
    index: 3,
    name: '顶层设计',
    en: 'Design',
    icon: '🏛️',
    duration: '6-8 周',
    goal: '绘就蓝图，定好路线',
    desc: '从战略到架构的完整蓝图设计，回答"去哪里、怎么走"',
    activities: [
      '业务架构与能力地图设计',
      '应用架构与技术架构选型',
      '数据架构设计',
      '三年分阶段路线图编制',
    ],
    agents: [{ dir: 'top-level-design-agent', name: '顶层设计专家' }],
    skills: [
      {
        dir: '2-design/business-architecture',
        name: '业务架构设计',
        primaryDeliverable: '转型蓝图报告',
        deliverableTemplate: 'blueprint-report',
        prompts: [
          '基于诊断评估结论，设计数智化转型业务架构：绘制业务能力地图（价值链→能力域→能力项三级），识别能力短板和数字化赋能点',
          '请梳理企业核心业务流程，识别端到端价值流中的断点和数字化改造机会点，输出业务架构蓝图'
        ]
      },
      {
        dir: '2-design/tech-architecture',
        name: '技术架构设计',
        primaryDeliverable: '架构设计方案',
        deliverableTemplate: 'architecture-design',
        prompts: [
          '基于业务架构要求，设计数智化转型技术架构：包括云基础设施、技术中台、数据平台、AI平台、集成架构、安全架构六大板块',
          '请完成技术选型建议：对比主流技术方案（云平台选型、数据中台技术栈、AI平台方案），给出推荐方案和理由'
        ]
      },
      {
        dir: '2-design/roadmap',
        name: '实施路线图规划',
        primaryDeliverable: '三年实施路线图',
        deliverableTemplate: 'three-year-roadmap',
        prompts: [
          '请基于业务架构和技术架构设计，编制三年分阶段实施路线图：Phase1筑基（0-12月）速赢+基础建设，Phase2规模推广（13-24月）核心平台建设+场景规模化，Phase3创新引领（25-36月）新模式跑通+数据驱动',
          '请输出项目工作流甘特图（业务/数据/技术/组织四条泳道），标注关键里程碑M1-M5及预期价值兑现点'
        ]
      }
    ],
    deliverables: ['转型蓝图报告', '架构设计方案', '三年实施路线图'],
    kickoff:
      '请基于诊断评估结论，开展数智化转型顶层设计：设计业务能力架构和技术架构，输出转型蓝图，并编制三年分阶段实施路线图。',
  },
  {
    key: 'incubate',
    index: 4,
    name: '场景孵化',
    en: 'Incubate',
    icon: '💡',
    duration: '4-6 周',
    goal: '小步快跑，验证价值',
    desc: '识别高价值场景，通过 POC 验证可行性，快速建立转型信心',
    activities: [
      'AI/数智化场景识别与全景梳理',
      '价值-难度优先级矩阵排序',
      'Top3 场景 POC 方案设计',
      'POC 执行与验证复盘',
    ],
    agents: [{ dir: 'scenario-planning-agent', name: 'AI场景规划专家' }],
    skills: [
      {
        dir: '3-incubate/scenario-landscape',
        name: '场景全景梳理',
        primaryDeliverable: '场景全景清单',
        deliverableTemplate: 'scenario-landscape',
        prompts: [
          '结合本企业所处行业和诊断结论，识别TOP15数智化/AI应用场景，按业务域分类（生产/供应链/营销/服务/管理/风控），每个场景描述场景名称、业务痛点、AI/数智化方案、预期价值',
          '请组织场景头脑风暴框架：从效率提升、成本降低、收入增长、体验改善、风险管控五个价值维度出发，系统梳理候选场景'
        ]
      },
      {
        dir: '3-incubate/priority-matrix',
        name: '场景优先级排序',
        primaryDeliverable: '优先级矩阵',
        deliverableTemplate: 'priority-matrix',
        prompts: [
          '请对已识别的数智化场景进行价值-难度评估，构建2×2优先级矩阵：速赢区（高价值低难度）、战略攻坚区（高价值高难度）、补充优化区（低价值低难度）、暂缓观察区（低价值高难度），推荐前3个POC场景',
          '请从业务价值、技术可行性、数据就绪度、组织准备度四个维度对候选场景打分排序，输出优先级矩阵'
        ]
      },
      {
        dir: '3-incubate/poc-design',
        name: 'POC方案设计与验证',
        primaryDeliverable: 'POC方案与验证报告',
        deliverableTemplate: 'poc-plan',
        prompts: [
          '请为推荐的Top3 POC场景设计详细验证方案：每个场景包含POC目标、验证范围、数据需求、技术方案、成功标准（可量化KPI）、实施计划（4-6周）、资源需求、风险预案',
          '请设计POC效果评估框架：如何衡量POC是否成功？需要采集哪些数据？如何判断是否进入规模化推广？'
        ]
      }
    ],
    deliverables: ['场景全景清单', '优先级矩阵', 'POC方案与验证报告'],
    kickoff:
      '请结合本企业所处行业与诊断结论，识别 TOP10-15 数智化/AI 应用场景，按价值潜力与实施难度构建优先级矩阵，并推荐前 3 个 POC 场景及验证方案。',
  },
  {
    key: 'implement',
    index: 5,
    name: '实施落地',
    en: 'Implement',
    icon: '🚧',
    duration: '12-36 月',
    goal: '体系建设，组织就绪',
    desc: '数据治理、组织变革、能力建设同步推进，保障蓝图落地',
    activities: [
      '数据治理体系建设（组织/标准/质量/安全）',
      '组织架构调整与人才引进',
      '培训赋能体系搭建',
      '试点上线与复盘优化',
    ],
    agents: [
      { dir: 'data-governance-agent', name: '数据治理专家' },
      { dir: 'org-change-agent', name: '组织变革专家' },
    ],
    skills: [
      {
        dir: '4-implement/data-governance',
        name: '数据治理体系建设',
        primaryDeliverable: '数据治理体系文件',
        deliverableTemplate: 'data-governance',
        prompts: [
          '请为本企业设计数据治理体系：包括治理组织架构与职责（数据治理委员会/数据Owner/数据管家）、数据标准框架、数据质量管理机制、数据安全合规策略，以及分阶段实施路线',
          '请输出数据管理制度框架：数据标准管理办法、数据质量管理办法、数据安全管理办法、主数据管理规范等核心制度目录和要点'
        ]
      },
      {
        dir: '4-implement/org-change',
        name: '组织变革与人才',
        primaryDeliverable: '组织变革方案',
        deliverableTemplate: 'org-change',
        prompts: [
          '请设计数智化转型组织变革方案：目标组织架构（CDO岗位设置、数字化团队编制）、关键岗位JD、人才来源策略（内部培养vs外部引进）、变革路径（渐进式调整vs激进式重组）',
          '请分析组织变革阻力来源（中层抵触/能力断层/文化惯性），设计阻力化解策略和变革沟通计划'
        ]
      },
      {
        dir: '4-implement/training',
        name: '培训赋能体系',
        primaryDeliverable: '培训体系',
        deliverableTemplate: 'training-system',
        prompts: [
          '请设计分层分类培训赋能体系：高管层（数字化认知）、中层（数字化管理）、骨干层（数据/AI技能）、全员（数字化素养）四个层级，包含课程体系、培训方式、考核机制',
          '请输出培训实施计划：首年培训时间表、师资配置、预算估算、效果评估四层模型（反应/学习/行为/结果）'
        ]
      },
      {
        dir: '4-implement/pilot-review',
        name: '试点复盘',
        primaryDeliverable: '试点复盘报告',
        deliverableTemplate: 'pilot-review',
        prompts: [
          '请设计试点项目复盘框架（AAR）：回顾目标→评估结果→分析原因→总结经验→行动计划，包含定量KPI对比和定性经验总结',
          '请基于试点结果，输出规模化推广建议：哪些经验可以复制？哪些问题需要在推广前解决？推广节奏如何安排？'
        ]
      }
    ],
    deliverables: ['数据治理体系文件', '组织变革方案', '培训体系', '试点复盘报告'],
    kickoff:
      '请为本企业设计数据治理体系：包括治理组织架构与职责、数据标准框架、数据质量管理机制、数据安全合规策略，以及分阶段实施路线。',
  },
  {
    key: 'evolve',
    index: 6,
    name: '运营进化',
    en: 'Evolve',
    icon: '📈',
    duration: '持续',
    goal: '度量价值，持续迭代',
    desc: '量化转型价值，规模化复制成功经验，驱动持续进化',
    activities: [
      '价值度量体系（KPI/ROI）建设',
      '运营监控与迭代规划',
      '成功经验规模化推广',
      '年度复盘与知识沉淀',
    ],
    agents: [{ dir: 'consulting-workflow', name: '咨询总编排' }],
    skills: [
      {
        dir: '5-evolve/value-measurement',
        name: '价值度量体系',
        primaryDeliverable: '价值度量看板',
        deliverableTemplate: 'value-assessment',
        prompts: [
          '请设计数智化转型价值度量体系：定义业务增长/效率提升/客户体验/能力建设四类KPI指标，给出每个指标的定义、计算公式、基线值、目标值、采集频率、责任部门',
          '请设计ROI测算模型：如何量化转型投入（人力/技术/咨询/培训）和产出（直接收益/间接收益/战略价值）？回本期如何计算？'
        ]
      },
      {
        dir: '5-evolve/annual-review',
        name: '年度复盘',
        primaryDeliverable: '年度复盘报告',
        deliverableTemplate: 'generic-report',
        prompts: [
          '请设计年度转型复盘报告框架：年度目标回顾、KPI达成情况、重点项目总结、经验教训、存在问题、下年度计划',
          '请基于年度转型进展，输出"红黄绿"灯健康度评估：战略对齐度、项目进度、价值兑现、组织能力、风险管控五个维度'
        ]
      },
      {
        dir: '5-evolve/scaling',
        name: '规模化推广',
        primaryDeliverable: '规模化推广方案',
        deliverableTemplate: 'evolution-roadmap',
        prompts: [
          '请设计成功场景规模化推广方案：推广路径（试点→部门→全公司→生态）、推广节奏、资源需求、推广风险及应对',
          '请输出持续进化路线图：基于已建成的能力底座，下一年度的创新方向、新场景孵化计划、能力升级路径'
        ]
      }
    ],
    deliverables: ['价值度量看板', '年度复盘报告', '规模化推广方案'],
    kickoff:
      '请为本企业设计数智化转型价值度量体系：定义业务/效率/体验三类 KPI 与 ROI 测算模型，输出年度复盘框架与规模化推广策略。',
  },
];

export const STAGE_MAP = Object.fromEntries(STAGES.map((s) => [s.key, s]));

// 按 dir 快速查找 Skill 定义
export const SKILL_MAP = {};
for (const stage of STAGES) {
  for (const skill of (stage.skills || [])) {
    SKILL_MAP[skill.dir] = { ...skill, stageKey: stage.key, stageName: stage.name };
  }
}

export const STAGE_STATUS = {
  pending: { label: '未开始', cls: 'off' },
  active: { label: '进行中', cls: 'cyan' },
  done: { label: '已完成', cls: 'ok' },
};

// 企业信息字段定义（创建/编辑表单共用）
export const COMPANY_FIELDS = [
  { key: 'industry', label: '所属行业', placeholder: '如：港口物流' },
  { key: 'revenue', label: '年营收规模', placeholder: '如：50 亿元' },
  { key: 'employees', label: '员工规模', placeholder: '如：3000 人' },
  { key: 'systems', label: '核心系统清单', placeholder: '如：ERP、TOS、OA，及建设情况', type: 'textarea' },
  { key: 'dataStatus', label: '数据现状', placeholder: '如：主数据分散、数据质量参差、无统一数据平台', type: 'textarea' },
  { key: 'painPoints', label: '核心痛点', placeholder: '如：决策靠经验、作业效率低、数据孤岛严重', type: 'textarea' },
];
