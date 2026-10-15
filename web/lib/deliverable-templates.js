// 交付物模板注册表
// 按交付物类型定义：章节结构、推荐版式、页数范围、核心内容要求
// 匹配策略：根据交付物标题关键词匹配最适合的模板

export const DELIVERABLE_TEMPLATES = {
  // ========== 战略启航阶段 ==========
  'interview-outline': {
    id: 'interview-outline',
    name: '高层访谈提纲',
    match: ['访谈提纲', '访谈大纲', 'interview outline', '访谈问题'],
    pageCount: '12-18',
    badge: '战略启航 · 访谈准备',
    style: '访谈提纲风格：结构化问题清单，按角色分章节，含挖掘要点和追问技巧',
    chapters: [
      { label: '一、访谈计划概览', slideTypes: ['summary'], desc: '访谈目的、访谈对象清单（CEO/业务VP/CIO/CFO等）、时间安排、访谈方式、注意事项' },
      { label: '二、访谈方法论', slideTypes: ['content', 'content'], desc: '访谈五维框架（转型动机/战略意图/期望成果/底线顾虑/决心投入）、挖掘要点符号说明（🔴核心必问/🟡深度追问/🟢补充探询）' },
      { label: '三、CEO/一号位访谈提纲', slideTypes: ['content', 'content'], desc: '开场(5分钟)→核心问题(40-50分钟，覆盖转型动因、战略雄心、投入决心、底线顾虑)→收尾(5分钟)，每题标注挖掘要点' },
      { label: '四、业务VP访谈提纲', slideTypes: ['content', 'content'], desc: '开场(5分钟)→核心问题(40-50分钟，覆盖业务痛点、数字化现状、期望、变革阻力)→收尾(5分钟)，每题标注挖掘要点' },
      { label: '五、CIO/CDO访谈提纲', slideTypes: ['content', 'content'], desc: '开场(5分钟)→核心问题(40-50分钟，覆盖IT现状、数据现状、团队能力、历史项目经验)→收尾(5分钟)，每题标注挖掘要点' },
      { label: '六、CFO/财务负责人访谈提纲', slideTypes: ['content', 'content'], desc: '开场(5分钟)→核心问题(40-50分钟，覆盖预算量级、ROI预期、资本支出vs运营支出)→收尾(5分钟)，每题标注挖掘要点' },
      { label: '七、其他关键角色访谈', slideTypes: ['content'], desc: 'HR负责人、风控负责人、核心业务骨干等补充访谈提纲（可选）' },
      { label: '八、访谈纪要模板', slideTypes: ['table', 'summary'], desc: '统一的访谈记录模板：基本信息栏、核心诉求、痛点记录、原话引述、情绪信号、待跟进事项' },
      { label: '九、访谈准备Checklist', slideTypes: ['content', 'summary'], desc: '访谈前准备事项、所需材料、访谈技巧与注意事项、追问技巧' },
    ],
    preferredLayouts: ['content', 'table', 'summary', 'divider'],
  },
  'interview-notes': {
    id: 'interview-notes',
    name: '高层访谈纪要',
    match: ['访谈纪要', '访谈记录', '访谈总结', 'interview'],
    pageCount: '10-15',
    badge: '战略启航 · 访谈交付物',
    style: '麦肯锡访谈纪要风格：引述框+观点矩阵，原话用引号呈现',
    chapters: [
      { label: '一、访谈概览', slideTypes: ['divider', 'summary'], desc: '访谈目的、对象、时间、方式、核心发现总览' },
      { label: '二、一号位访谈', slideTypes: ['interview', 'interview', 'summary'], desc: 'CEO/总裁访谈：战略意图、转型动机、期望成果、底线顾虑、决心投入' },
      { label: '三、业务负责人访谈', slideTypes: ['interview', 'interview', 'summary'], desc: 'COO/业务VP访谈：业务痛点、数字化现状、转型期望、变革准备度' },
      { label: '四、技术负责人访谈', slideTypes: ['interview', 'summary'], desc: 'CIO/CDO访谈：IT架构现状、数据现状、团队能力、历史项目复盘' },
      { label: '五、观点对比矩阵', slideTypes: ['matrix', 'summary'], desc: '多角色对比表：按维度对比不同高管观点，标注共识与分歧' },
      { label: '六、关键发现与速赢', slideTypes: ['summary', 'initiatives'], desc: '核心诉求汇总、关键痛点、🔴强信号清单、初步速赢机会' },
    ],
    preferredLayouts: ['interview', 'matrix', 'summary', 'divider'],
  },
  'strategy-house': {
    id: 'strategy-house',
    name: '转型战略屋',
    match: ['战略屋', '战略对齐', '愿景', 'strategy house', '战略框架'],
    pageCount: '10-14',
    badge: '战略启航 · 核心交付物',
    style: '麦肯锡战略屋风格：五层次屋形框架，视觉化呈现愿景-目标-战场-举措-保障',
    chapters: [
      { label: '一、战略背景与洞察', slideTypes: ['divider', 'content', 'metrics'], desc: '行业趋势、内部挑战、转型紧迫性、核心矛盾' },
      { label: '二、转型愿景', slideTypes: ['content', 'summary'], desc: '一句话愿景陈述、愿景解读、与企业总体战略的关系' },
      { label: '三、战略屋全景', slideTypes: ['house'], desc: '完整五层次战略屋：屋顶(愿景)→横梁(SMART目标)→支柱(核心战场)→基石(里程碑)→地基(六大保障)' },
      { label: '四、战略目标拆解', slideTypes: ['kpi', 'kpi', 'summary'], desc: '3-5个SMART目标：业务增长/效率/客户体验/决策智能/能力底座，基线→目标值' },
      { label: '五、核心战场', slideTypes: ['content', 'scenario', 'summary'], desc: '3-5个必赢之战，每个战场有业务Owner和标志性成果' },
      { label: '六、里程碑路线', slideTypes: ['gantt', 'roadmap'], desc: 'Year1-Year3分阶段里程碑，速赢成果在6个月内' },
      { label: '七、保障体系', slideTypes: ['org', 'content', 'summary'], desc: '治理机制、组织人才、技术底座、数据治理、变革管理、投入保障' },
    ],
    preferredLayouts: ['house', 'kpi', 'gantt', 'org', 'summary', 'divider'],
  },
  'project-charter': {
    id: 'project-charter',
    name: '转型立项书',
    match: ['立项书', '立项报告', '项目立项', 'charter', '项目章程'],
    pageCount: '12-16',
    badge: '战略启航 · 正式交付物',
    style: '正式立项文件风格：结构严谨，数据详实，包含治理结构、预算、风险、签字栏',
    chapters: [
      { label: '一、项目背景与动因', slideTypes: ['divider', 'content', 'summary'], desc: '外部环境、内部压力、触发事件、紧迫性分析（回答"为什么是现在"）' },
      { label: '二、愿景与目标', slideTypes: ['content', 'kpi'], desc: '愿景陈述、3-5个SMART业务目标、能力建设目标、Out of Scope明确边界' },
      { label: '三、项目范围', slideTypes: ['moscow', 'table', 'summary'], desc: 'MoSCoW优先级：Must/Should/Could/Won\'t，业务/功能/技术/数据/组织五维度范围边界' },
      { label: '四、核心价值与收益', slideTypes: ['metrics', 'content', 'summary'], desc: '财务价值/业务价值/战略价值三类收益，速赢项目价值量化' },
      { label: '五、路线图与里程碑', slideTypes: ['gantt', 'roadmap'], desc: 'Phase1-3分阶段计划，5个关键里程碑M1-M5及验收标准' },
      { label: '六、治理结构', slideTypes: ['org', 'matrix'], desc: '指导委员会-PMO-三组(业务/技术/变革)三级治理，关键角色RACI' },
      { label: '七、资源预算', slideTypes: ['budget', 'summary'], desc: '人力/技术/咨询三类投入，预算区间，分年预算，ROI测算' },
      { label: '八、风险管理', slideTypes: ['risk', 'risk'], desc: 'Top5-8风险，概率×影响评估，应对策略，责任人' },
      { label: '九、成功标准与验收', slideTypes: ['kpi', 'summary'], desc: '项目成功/业务成功/adoption成功三层标准，验收机制' },
      { label: '十、章程签署', slideTypes: ['signature'], desc: 'Sponsor/业务Owner/项目经理签字栏' },
    ],
    preferredLayouts: ['moscow', 'org', 'budget', 'risk', 'gantt', 'kpi', 'signature', 'divider'],
  },
  'kickoff-material': {
    id: 'kickoff-material',
    name: '启动会材料',
    match: ['启动会', 'kick-off', 'kickoff', '启动材料'],
    pageCount: '8-12',
    badge: '战略启航 · 启动材料',
    style: '简洁有力的启动会PPT风格：大字标题、观点鲜明、Sponsor友好',
    chapters: [
      { label: '一、为什么做', slideTypes: ['divider', 'summary', 'metrics'], desc: 'Sponsor站台部分：转型背景、战略必要性、不做的代价' },
      { label: '二、做什么', slideTypes: ['house', 'summary'], desc: '愿景目标、项目范围、核心价值' },
      { label: '三、怎么做', slideTypes: ['gantt', 'roadmap', 'org'], desc: '方法论、路线图里程碑、治理架构、团队介绍' },
      { label: '四、需要什么支持', slideTypes: ['content', 'summary'], desc: '对各部门的期望配合事项、时间投入要求、沟通机制' },
      { label: '五、Q&A', slideTypes: ['ending'], desc: '问答环节与联系方式' },
    ],
    preferredLayouts: ['divider', 'summary', 'gantt', 'org'],
  },

  // ========== 诊断评估阶段 ==========
  'maturity-report': {
    id: 'maturity-report',
    name: '成熟度评估报告',
    match: ['成熟度评估', '成熟度报告', 'maturity'],
    pageCount: '12-18',
    badge: '诊断评估 · 核心交付物',
    style: '麦肯锡诊断报告风格：雷达图+金字塔+优劣势深度分析，数据说话',
    chapters: [
      { label: '一、评估背景与模型', slideTypes: ['divider', 'pyramid', 'content'], desc: '评估依据(GB/T 43439-2023)、七维度模型、L1-L5等级定义、评估方法' },
      { label: '二、综合评估结果', slideTypes: ['radar', 'metrics', 'summary'], desc: '七维度雷达图、综合得分、整体成熟度定级、一句话核心结论' },
      { label: '三、维度评分详解', slideTypes: ['radar', 'bar'], desc: '七维度逐一评分：每个维度分数+等级+一句话评价，与行业均值/目标对比' },
      { label: '四、核心优势', slideTypes: ['strengths', 'strengths'], desc: '3-4个高维度深度分析：现状事实、证据支撑、业务价值' },
      { label: '五、关键短板', slideTypes: ['weaknesses', 'weaknesses'], desc: '3-4个低维度深度分析：差距量化、根因分析、业务影响' },
      { label: '六、差距与对标', slideTypes: ['gap', 'gap', 'bar'], desc: '行业标杆对比、标杆企业实践、P0-P3优先级差距清单' },
      { label: '七、根因诊断', slideTypes: ['root_cause', 'summary'], desc: '核心问题逻辑树分析、根因结论' },
      { label: '八、改进建议', slideTypes: ['initiatives', 'roadmap', 'summary'], desc: '优先级举措矩阵、分阶段路线图、预期价值' },
    ],
    preferredLayouts: ['pyramid', 'radar', 'bar', 'strengths', 'weaknesses', 'gap', 'root_cause', 'initiatives', 'roadmap', 'divider'],
  },
  'ai-readiness': {
    id: 'ai-readiness',
    name: 'AI就绪度诊断报告',
    match: ['AI就绪度', '就绪度诊断', 'AI readiness', 'readiness'],
    pageCount: '10-14',
    badge: '诊断评估 · AI专项',
    style: '诊断报告风格：四维雷达+短板分析，突出数据基础和场景储备',
    chapters: [
      { label: '一、诊断框架', slideTypes: ['divider', 'house', 'content'], desc: 'AI就绪度四维模型(数据/技术/组织/场景)、评估方法与依据' },
      { label: '二、总体就绪度', slideTypes: ['radar', 'metrics', 'summary'], desc: '四维雷达图、综合就绪度等级、核心结论' },
      { label: '三、数据基础评估', slideTypes: ['weaknesses', 'bar', 'content'], desc: '数据可用性、质量、治理、安全四维评估' },
      { label: '四、技术能力评估', slideTypes: ['bar', 'content'], desc: '算力、平台、MLOps、技术栈评估' },
      { label: '五、组织准备度', slideTypes: ['strengths', 'weaknesses'], desc: '人才、文化、机制、领导力评估' },
      { label: '六、场景储备度', slideTypes: ['scenario', 'prio_matrix'], desc: 'AI场景储备清单、价值×难度矩阵、Top速赢场景' },
      { label: '七、关键缺口', slideTypes: ['gap', 'risk'], desc: '四大维度关键缺口、优先级排序' },
      { label: '八、提升路径', slideTypes: ['roadmap', 'initiatives'], desc: 'AI能力建设路线图、关键举措' },
    ],
    preferredLayouts: ['radar', 'house', 'bar', 'strengths', 'weaknesses', 'gap', 'scenario', 'prio_matrix', 'risk', 'roadmap', 'divider'],
  },
  'data-asset-audit': {
    id: 'data-asset-audit',
    name: '数据资产盘点表',
    match: ['数据资产盘点', '数据盘点', '数据资产', 'data asset', '资产盘点'],
    pageCount: '10-14',
    badge: '诊断评估 · 数据专项',
    style: '数据盘点报告风格：表格矩阵为主，全景图+分类盘点+质量评估',
    chapters: [
      { label: '一、盘点方法与范围', slideTypes: ['divider', 'content', 'pyramid'], desc: '六类数据资产分类、盘点方法、范围说明' },
      { label: '二、数据资产全景', slideTypes: ['metrics', 'house'], desc: '总体规模、分布概览、资产总量关键指标' },
      { label: '三、主数据盘点', slideTypes: ['table', 'content'], desc: '客户/产品/供应商/组织等主数据清单、质量评估' },
      { label: '四、交易数据盘点', slideTypes: ['table', 'bar'], desc: '业务交易数据规模、覆盖范围、时效性' },
      { label: '五、IoT/设备数据', slideTypes: ['table', 'content'], desc: '设备数据接入情况、数据量、采集频率' },
      { label: '六、非结构化数据', slideTypes: ['table', 'content'], desc: '文档/图像/音视频等数据资产现状' },
      { label: '七、数据质量评估', slideTypes: ['radar', 'bar', 'summary'], desc: '完整性/准确性/一致性/时效性六维质量评分' },
      { label: '八、数据孤岛与断点', slideTypes: ['gap', 'summary'], desc: '系统间数据断点、孤岛识别、打通优先级' },
      { label: '九、数据价值评估', slideTypes: ['prio_matrix', 'initiatives'], desc: '高价值数据资产识别、数据价值释放建议' },
    ],
    preferredLayouts: ['table', 'datatable', 'metrics', 'bar', 'radar', 'gap', 'prio_matrix', 'house', 'divider'],
  },
  'gap-analysis': {
    id: 'gap-analysis',
    name: '差距分析报告',
    match: ['差距分析', 'gap analysis', '差距报告', '标杆对比'],
    pageCount: '10-14',
    badge: '诊断评估 · 对比分析',
    style: '麦肯锡差距分析风格：量化对比+根因诊断+优先级矩阵',
    chapters: [
      { label: '一、分析框架', slideTypes: ['divider', 'content'], desc: '对标基准选择(行业均值/领先标杆/目标态)、差距维度' },
      { label: '二、总体差距概览', slideTypes: ['bar', 'radar', 'summary'], desc: '各维度差距量化对比图，核心差距一句话总结' },
      { label: '三、维度差距详析', slideTypes: ['gap', 'gap', 'gap'], desc: '按维度逐一分析差距：当前值vs标杆值，差距大小，业务含义' },
      { label: '四、标杆实践', slideTypes: ['content', 'table'], desc: '行业领先企业具体实践和量化成效' },
      { label: '五、根因分析', slideTypes: ['root_cause', 'tree'], desc: '差距背后的根本原因MECE拆解' },
      { label: '六、优先级排序', slideTypes: ['prio_matrix', 'initiatives'], desc: '差距×影响矩阵，P0-P3优先级差距清单' },
      { label: '七、闭合建议', slideTypes: ['initiatives', 'roadmap'], desc: '分阶段差距闭合路线图，关键举措' },
    ],
    preferredLayouts: ['bar', 'radar', 'gap', 'root_cause', 'prio_matrix', 'initiatives', 'roadmap', 'divider'],
  },

  // ========== 顶层设计阶段 ==========
  'blueprint-report': {
    id: 'blueprint-report',
    name: '转型蓝图报告',
    match: ['蓝图报告', '转型蓝图', 'blueprint', '顶层设计'],
    pageCount: '14-20',
    badge: '顶层设计 · 核心交付物',
    style: 'BCG蓝图设计风格：业务架构+数据架构+技术架构+治理架构四大板块',
    chapters: [
      { label: '一、蓝图总论', slideTypes: ['divider', 'house', 'summary'], desc: '蓝图愿景、设计原则、四大架构全景图' },
      { label: '二、业务架构', slideTypes: ['house', 'process', 'scenario'], desc: '业务能力地图、核心业务流程、端到端价值流' },
      { label: '三、应用架构', slideTypes: ['house', 'table'], desc: '应用系统全景、核心平台规划、系统集成关系' },
      { label: '四、数据架构', slideTypes: ['house', 'content'], desc: '数据资产目录、数据流转、数据湖/仓设计' },
      { label: '五、技术架构', slideTypes: ['house', 'content'], desc: '云基础设施、技术中台、AI平台、安全架构' },
      { label: '六、集成架构', slideTypes: ['content', 'table'], desc: '系统集成方式、API规划、数据流转路径' },
      { label: '七、部署架构', slideTypes: ['content'], desc: '云部署方案、环境规划、容灾设计' },
      { label: '八、架构演进', slideTypes: ['roadmap', 'gantt'], desc: '从现状到目标态的架构演进路线' },
    ],
    preferredLayouts: ['house', 'process', 'scenario', 'roadmap', 'gantt', 'table', 'divider'],
  },
  'architecture-design': {
    id: 'architecture-design',
    name: '架构设计方案',
    match: ['架构设计', '架构方案', 'architecture', '技术架构'],
    pageCount: '12-16',
    badge: '顶层设计 · 技术专项',
    style: '技术方案风格：架构图为主，技术选型、接口设计、部署方案',
    chapters: [
      { label: '一、设计原则', slideTypes: ['divider', 'content', 'summary'], desc: '架构设计原则、技术选型标准、约束条件' },
      { label: '二、现状架构', slideTypes: ['content', 'weaknesses'], desc: '现有架构盘点、技术债识别、痛点分析' },
      { label: '三、目标架构', slideTypes: ['house', 'content'], desc: '目标架构全景图、分层设计、核心组件' },
      { label: '四、技术选型', slideTypes: ['table', 'matrix'], desc: '关键技术对比选型、推荐方案、理由' },
      { label: '五、接口设计', slideTypes: ['table', 'content'], desc: '核心API设计、数据接口规范' },
      { label: '六、部署方案', slideTypes: ['content', 'table'], desc: '部署拓扑、环境规划、资源需求' },
      { label: '七、安全合规', slideTypes: ['risk', 'content'], desc: '安全架构、合规要求、数据保护方案' },
      { label: '八、演进计划', slideTypes: ['gantt', 'roadmap'], desc: '架构分阶段演进路线、风险点' },
    ],
    preferredLayouts: ['house', 'table', 'matrix', 'risk', 'gantt', 'roadmap', 'divider'],
  },
  'three-year-roadmap': {
    id: 'three-year-roadmap',
    name: '三年实施路线图',
    match: ['三年路线', '路线图', 'roadmap', '实施路线', '三年规划'],
    pageCount: '10-14',
    badge: '顶层设计 · 规划交付物',
    style: '麦肯锡路线图风格：甘特图+泳道+里程碑，分阶段价值兑现',
    chapters: [
      { label: '一、路线总览', slideTypes: ['divider', 'gantt', 'summary'], desc: '三年整体节奏(筑基→规模→创新)、阶段目标、价值曲线' },
      { label: '二、Year1·筑基', slideTypes: ['content', 'scenario', 'kpi'], desc: '速赢场景、基础建设、团队到位、M1-M4里程碑' },
      { label: '三、Year2·规模推广', slideTypes: ['content', 'scenario', 'kpi'], desc: '核心平台建设、场景规模化推广、M5-M8里程碑' },
      { label: '四、Year3·创新引领', slideTypes: ['content', 'scenario', 'kpi'], desc: '新模式跑通、数据/AI驱动创新、M9-M12里程碑' },
      { label: '五、工作流泳道', slideTypes: ['gantt'], desc: '业务/数据/技术/组织四泳道甘特图' },
      { label: '六、投入节奏', slideTypes: ['budget', 'bar'], desc: '分年预算投入、资源需求曲线' },
      { label: '七、价值兑现', slideTypes: ['metrics', 'kpi', 'summary'], desc: '分年价值兑现点、累计ROI预期' },
      { label: '八、关键依赖', slideTypes: ['risk', 'summary'], desc: '关键路径依赖、风险点、应对策略' },
    ],
    preferredLayouts: ['gantt', 'kpi', 'metrics', 'budget', 'risk', 'scenario', 'summary', 'divider'],
  },

  // ========== 场景孵化阶段 ==========
  'scenario-landscape': {
    id: 'scenario-landscape',
    name: '场景全景清单',
    match: ['场景全景', '场景清单', 'scenario landscape', '场景地图'],
    pageCount: '10-14',
    badge: '场景孵化 · 全景交付物',
    style: 'BCG场景矩阵风格：场景卡+分类矩阵，信息密度高',
    chapters: [
      { label: '一、场景识别方法', slideTypes: ['divider', 'content'], desc: '场景识别维度、评估标准、筛选漏斗' },
      { label: '二、场景全景图', slideTypes: ['house', 'scenario', 'scenario'], desc: '按业务域分类的全量场景清单(Top15-20)' },
      { label: '三、场景分类', slideTypes: ['matrix', 'table'], desc: '按业务域/技术类型/成熟度分类矩阵' },
      { label: '四、价值评估', slideTypes: ['prio_matrix', 'bar'], desc: '价值×难度矩阵、TOP10排序' },
      { label: '五、场景详单', slideTypes: ['scenario', 'table'], desc: '每个场景的描述、价值、难度、业务Owner、预期ROI' },
      { label: '六、推荐POC', slideTypes: ['scenario', 'summary'], desc: '推荐前3个POC场景及理由' },
    ],
    preferredLayouts: ['scenario', 'prio_matrix', 'matrix', 'table', 'bar', 'summary', 'divider'],
  },
  'priority-matrix': {
    id: 'priority-matrix',
    name: '优先级矩阵',
    match: ['优先级矩阵', '优先矩阵', 'priority matrix', '场景优先级'],
    pageCount: '8-10',
    badge: '场景孵化 · 分析交付物',
    style: '经典2x2优先级矩阵，速赢-战略-暂缓-补充四象限',
    chapters: [
      { label: '一、评估方法', slideTypes: ['divider', 'content'], desc: '价值维度评分标准、难度维度评分标准' },
      { label: '二、优先级矩阵全景', slideTypes: ['prio_matrix'], desc: '2x2矩阵全景，所有场景分布' },
      { label: '三、速赢象限', slideTypes: ['scenario', 'summary'], desc: '高价值低难度场景：立即启动，速赢价值' },
      { label: '四、战略攻坚', slideTypes: ['scenario', 'summary'], desc: '高价值高难度场景：重点投入，战略意义' },
      { label: '五、补充优化', slideTypes: ['scenario'], desc: '低价值低难度场景：顺手完成' },
      { label: '六、暂缓观察', slideTypes: ['scenario'], desc: '低价值高难度场景：暂不投入' },
    ],
    preferredLayouts: ['prio_matrix', 'scenario', 'summary', 'divider'],
  },
  'poc-plan': {
    id: 'poc-plan',
    name: 'POC方案与验证报告',
    match: ['POC', 'poc方案', 'POC验证', '概念验证', '验证报告'],
    pageCount: '10-14',
    badge: '场景孵化 · POC交付物',
    style: '实施方案风格：目标清晰、方案具体、验收标准可量化',
    chapters: [
      { label: '一、POC概述', slideTypes: ['divider', 'content', 'kpi'], desc: 'POC目标、范围、周期、成功标准' },
      { label: '二、场景方案', slideTypes: ['content', 'house'], desc: '场景业务流程、AI/技术方案、数据需求' },
      { label: '三、技术方案', slideTypes: ['content', 'table'], desc: '模型选型、技术架构、接口设计' },
      { label: '四、实施计划', slideTypes: ['gantt', 'roadmap'], desc: 'POC时间表、里程碑、资源需求' },
      { label: '五、团队分工', slideTypes: ['org', 'matrix'], desc: 'POC团队、角色职责、RACI' },
      { label: '六、验收标准', slideTypes: ['kpi', 'metrics'], desc: '量化验收指标、测试用例、效果评估方法' },
      { label: '七、风险预案', slideTypes: ['risk'], desc: '技术/业务/数据风险及应对' },
      { label: '八、推广建议', slideTypes: ['summary', 'initiatives'], desc: 'POC成功后的规模化推广路径' },
    ],
    preferredLayouts: ['kpi', 'house', 'gantt', 'org', 'risk', 'initiatives', 'summary', 'divider'],
  },

  // ========== 实施落地阶段 ==========
  'data-governance': {
    id: 'data-governance',
    name: '数据治理体系文件',
    match: ['数据治理', '治理体系', 'data governance', '数据管理体系'],
    pageCount: '12-16',
    badge: '实施落地 · 治理交付物',
    style: 'DAMA-DMBOK体系风格：组织+标准+流程+质量+安全五要素',
    chapters: [
      { label: '一、治理框架', slideTypes: ['divider', 'house', 'summary'], desc: '数据治理体系框架(DAMA)、治理目标、原则' },
      { label: '二、治理组织', slideTypes: ['org', 'matrix'], desc: '数据治理委员会、数据Owner、数据管家、职责RACI' },
      { label: '三、数据标准', slideTypes: ['table', 'content'], desc: '数据标准框架、主数据标准、指标标准、编码规范' },
      { label: '四、数据质量', slideTypes: ['metrics', 'content', 'kpi'], desc: '质量维度定义、质量规则、质量监控、考核机制' },
      { label: '五、数据安全', slideTypes: ['risk', 'content', 'matrix'], desc: '数据分级分类、访问控制、脱敏策略、合规要求' },
      { label: '六、数据生命周期', slideTypes: ['process', 'content'], desc: '数据从产生到归档的全生命周期管理流程' },
      { label: '七、工具平台', slideTypes: ['content', 'table'], desc: '数据治理平台功能规划、工具选型' },
      { label: '八、实施路线', slideTypes: ['roadmap', 'gantt'], desc: '分阶段实施计划、里程碑' },
    ],
    preferredLayouts: ['house', 'org', 'matrix', 'table', 'metrics', 'kpi', 'risk', 'process', 'roadmap', 'gantt', 'divider'],
  },
  'org-change': {
    id: 'org-change',
    name: '组织变革方案',
    match: ['组织变革', '变革方案', '组织调整', 'org change', '变革管理'],
    pageCount: '10-14',
    badge: '实施落地 · 组织交付物',
    style: '麦肯锡变革管理风格：7S模型+变革曲线+阻力管理',
    chapters: [
      { label: '一、变革必要性', slideTypes: ['divider', 'summary', 'content'], desc: '变革背景、组织现状痛点、变革目标' },
      { label: '二、组织设计', slideTypes: ['org', 'matrix'], desc: '目标组织架构、关键岗位设置、编制规划' },
      { label: '三、人才策略', slideTypes: ['content', 'table'], desc: '关键岗位JD、人才来源(内培/外引)、能力模型' },
      { label: '四、变革路径', slideTypes: ['roadmap', 'gantt'], desc: '组织调整节奏、过渡方案、关键节点' },
      { label: '五、阻力管理', slideTypes: ['risk', 'matrix'], desc: '变革阻力分析、利益相关者地图、应对策略' },
      { label: '六、激励机制', slideTypes: ['content', 'table'], desc: '考核机制调整、激励方案设计' },
      { label: '七、文化建设', slideTypes: ['summary', 'content'], desc: '数字化文化培育、沟通计划' },
    ],
    preferredLayouts: ['org', 'matrix', 'risk', 'roadmap', 'gantt', 'table', 'summary', 'divider'],
  },
  'training-system': {
    id: 'training-system',
    name: '培训体系',
    match: ['培训体系', '培训方案', '培训计划', 'training', '人才培养'],
    pageCount: '8-12',
    badge: '实施落地 · 赋能交付物',
    style: '培训方案风格：分层分类+课程体系+时间表',
    chapters: [
      { label: '一、能力差距', slideTypes: ['divider', 'gap', 'bar'], desc: '全员数字化能力现状vs目标，差距识别' },
      { label: '二、培训体系', slideTypes: ['house', 'content'], desc: '分层(高管/中层/骨干/全员)分类(意识/技能/专业)课程体系' },
      { label: '三、课程清单', slideTypes: ['table', 'scenario'], desc: '课程目录、目标受众、形式、时长' },
      { label: '四、实施计划', slideTypes: ['gantt', 'roadmap'], desc: '培训时间表、轮次安排、师资配置' },
      { label: '五、效果评估', slideTypes: ['kpi', 'metrics'], desc: '培训效果四层评估模型、考核机制' },
      { label: '六、资源预算', slideTypes: ['budget'], desc: '培训预算、外部师资需求' },
    ],
    preferredLayouts: ['house', 'gap', 'bar', 'table', 'scenario', 'gantt', 'roadmap', 'kpi', 'metrics', 'budget', 'divider'],
  },
  'pilot-review': {
    id: 'pilot-review',
    name: '试点复盘报告',
    match: ['试点复盘', '复盘报告', 'pilot review', '试点总结', '项目复盘'],
    pageCount: '10-14',
    badge: '实施落地 · 复盘交付物',
    style: '复盘报告风格：事实+数据+洞察+改进，AAR(After Action Review)结构',
    chapters: [
      { label: '一、试点概况', slideTypes: ['divider', 'kpi', 'content'], desc: '试点目标、范围、周期、预期vs实际对比' },
      { label: '二、成果达成', slideTypes: ['metrics', 'kpi', 'bar'], desc: '关键指标达成情况、价值兑现、成功经验' },
      { label: '三、问题复盘', slideTypes: ['weaknesses', 'root_cause'], desc: '遇到的问题、根因分析、未达成目标项' },
      { label: '四、经验沉淀', slideTypes: ['summary', 'content'], desc: '可复用经验、最佳实践、避坑指南' },
      { label: '五、风险更新', slideTypes: ['risk'], desc: '新识别风险、风险状态更新' },
      { label: '六、推广建议', slideTypes: ['initiatives', 'roadmap'], desc: '规模化推广调整建议、推广路线图' },
      { label: '七、下一步行动', slideTypes: ['initiatives', 'summary'], desc: '具体Action Items、责任人、时间节点' },
    ],
    preferredLayouts: ['kpi', 'metrics', 'bar', 'weaknesses', 'root_cause', 'risk', 'initiatives', 'roadmap', 'summary', 'divider'],
  },

  // ========== 运营进化阶段 ==========
  'ops-framework': {
    id: 'ops-framework',
    name: '运营体系框架',
    match: ['运营体系', '运营框架', '运营机制', 'ops framework', '持续运营'],
    pageCount: '10-14',
    badge: '运营进化 · 体系交付物',
    style: '运营体系风格：流程+组织+KPI+工具四件套',
    chapters: [
      { label: '一、运营现状', slideTypes: ['divider', 'weaknesses', 'metrics'], desc: '运营现状评估、痛点识别' },
      { label: '二、运营体系', slideTypes: ['house', 'content'], desc: '运营组织+流程+KPI+工具四件套框架' },
      { label: '三、运营组织', slideTypes: ['org', 'matrix'], desc: '运营团队配置、角色职责' },
      { label: '四、运营流程', slideTypes: ['process', 'content'], desc: '日常运营SOP、事件响应流程、优化迭代机制' },
      { label: '五、运营KPI', slideTypes: ['kpi', 'metrics'], desc: '运营指标体系、监控看板设计' },
      { label: '六、持续优化', slideTypes: ['roadmap', 'initiatives'], desc: 'PDCA循环、持续优化机制' },
    ],
    preferredLayouts: ['house', 'org', 'matrix', 'process', 'kpi', 'metrics', 'roadmap', 'initiatives', 'divider'],
  },
  'value-assessment': {
    id: 'value-assessment',
    name: '价值度量看板',
    match: ['价值度量', '价值评估', '价值报告', 'ROI', '价值看板', '效益评估'],
    pageCount: '10-12',
    badge: '运营进化 · 价值交付物',
    style: '价值度量风格：量化ROI，KPI卡片+前后对比，财务/业务/战略三维价值',
    chapters: [
      { label: '一、评估框架', slideTypes: ['divider', 'content'], desc: '价值评估模型(财务/业务/战略)、评估方法、基线' },
      { label: '二、财务价值', slideTypes: ['metrics', 'bar', 'kpi'], desc: '成本节约、营收增长、ROI计算、回本期' },
      { label: '三、业务价值', slideTypes: ['metrics', 'kpi', 'bar'], desc: '效率提升、客户体验改善、质量提升等量化指标' },
      { label: '四、战略价值', slideTypes: ['content', 'summary'], desc: '能力建设、人才储备、文化转变、竞争壁垒' },
      { label: '五、前后对比', slideTypes: ['bar', 'radar'], desc: '转型前vs转型后关键指标对比' },
      { label: '六、价值释放建议', slideTypes: ['initiatives', 'summary'], desc: '尚未释放的价值点、深化方向' },
    ],
    preferredLayouts: ['metrics', 'kpi', 'bar', 'radar', 'initiatives', 'summary', 'divider'],
  },
  'evolution-roadmap': {
    id: 'evolution-roadmap',
    name: '持续进化路线',
    match: ['持续进化', '进化路线', 'evolution', '持续优化', '下一阶段'],
    pageCount: '8-12',
    badge: '运营进化 · 规划交付物',
    style: '持续优化规划风格：PDCA+创新方向+能力升级',
    chapters: [
      { label: '一、阶段回顾', slideTypes: ['divider', 'metrics', 'summary'], desc: '已完成成果、能力现状、经验沉淀' },
      { label: '二、进化方向', slideTypes: ['content', 'scenario'], desc: '下一阶段重点方向、AI技术新趋势应用' },
      { label: '三、能力升级', slideTypes: ['radar', 'roadmap'], desc: '能力成熟度现状→目标态升级路径' },
      { label: '四、创新场景', slideTypes: ['scenario', 'prio_matrix'], desc: '下一阶段创新场景储备' },
      { label: '五、进化路线', slideTypes: ['gantt', 'roadmap'], desc: '持续优化路线图、里程碑' },
    ],
    preferredLayouts: ['metrics', 'summary', 'scenario', 'prio_matrix', 'radar', 'gantt', 'roadmap', 'divider'],
  },

  // ========== 通用回退模板 ==========
  'generic-report': {
    id: 'generic-report',
    name: '通用咨询报告',
    match: [],
    pageCount: '12-16',
    badge: '咨询交付物',
    style: '通用麦肯锡/BCG咨询报告风格',
    chapters: [
      { label: '一、背景与目标', slideTypes: ['divider', 'content', 'summary'], desc: '项目背景、分析目标、方法说明' },
      { label: '二、现状分析', slideTypes: ['metrics', 'content', 'bar'], desc: '关键数据、现状描述、核心问题' },
      { label: '三、深度诊断', slideTypes: ['strengths', 'weaknesses', 'root_cause'], desc: '优势、短板、根因分析' },
      { label: '四、方案建议', slideTypes: ['house', 'initiatives'], desc: '解决方案框架、关键举措' },
      { label: '五、实施路线', slideTypes: ['roadmap', 'gantt'], desc: '实施计划、里程碑' },
      { label: '六、预期价值', slideTypes: ['metrics', 'kpi', 'summary'], desc: '预期收益、成功标准' },
    ],
    preferredLayouts: ['metrics', 'bar', 'strengths', 'weaknesses', 'root_cause', 'house', 'initiatives', 'roadmap', 'summary', 'divider'],
  },
};

/**
 * 根据模板ID直接获取模板（用于前端/后端明确知道skill对应的templateId时）
 */
export function getTemplateById(templateId) {
  return DELIVERABLE_TEMPLATES[templateId] || null;
}

/**
 * 根据交付物标题匹配最合适的模板
 */
export function matchDeliverableTemplate(title, stageKey) {
  if (!title) return DELIVERABLE_TEMPLATES['generic-report'];
  const lower = title.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;
  for (const tpl of Object.values(DELIVERABLE_TEMPLATES)) {
    let score = 0;
    for (const kw of tpl.match) {
      if (lower.includes(kw.toLowerCase())) {
        score += kw.length; // 更长的关键词匹配权重更高
      }
    }
    // 精确名匹配加权重
    if (tpl.name === title) score += 50;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = tpl;
    }
  }
  return bestMatch || DELIVERABLE_TEMPLATES['generic-report'];
}

/**
 * 生成模板指南Prompt片段（注入到大模型生成指令中）
 */
export function buildTemplateGuide(tpl) {
  if (!tpl) return '';
  const lines = [];
  lines.push(`\n# 【交付物模板强制要求——必须严格遵守】`);
  lines.push(`本次生成的是《${tpl.name}》，${tpl.style}。`);
  lines.push(`- 页数：${tpl.pageCount}页左右（不含封面和目录）`);
  lines.push(`- 徽章标签（cover.badge）："${tpl.badge}"`);
  lines.push(``);
  lines.push(`## ⚠️ 幻灯片结构强制要求（违反将导致交付物不完整）`);
  lines.push(`所有幻灯片【必须】严格按以下顺序排列：`);
  lines.push(``);
  lines.push(`1. **第1页【必须】是 cover 封面**：{"type":"cover","badge":"${tpl.badge}","title":"${tpl.name}","subtitle":"一句副标题（核心观点）","meta":["客户企业名称","日期"]}`);
  lines.push(`   ❌ 禁止省略封面页，❌ 禁止将封面放在其他位置`);
  lines.push(``);
  lines.push(`2. **第2页【必须】是 toc 目录**：{"type":"toc","title":"目 录","items":[...与下面章节一一对应，每个item含main和sub字段...]}`);
  lines.push(`   ❌ 禁止省略目录页，目录必须与章节一一对应`);
  lines.push(``);
  lines.push(`3. **第3页起按章节顺序展开**（每个章节用divider分隔页开头，然后是内容页）`);
  lines.push(``);
  lines.push(`4. **最后一页【必须】是 ending 结尾/致谢页**：{"type":"ending","title":"谢 谢","subtitle":"一句结语","contact":"咨询团队","meta":["机构名称","年月"]}`);
  lines.push(`   ❌ 禁止省略结尾页`);
  lines.push(``);
  lines.push(`## 正确的幻灯片结构示例：`);
  lines.push(`[cover封面] → [toc目录] → [divider第1章] → [content第1章内容] → [divider第2章] → ... → [ending结尾]`);
  lines.push(``);
  lines.push(`## 章节结构（目录items必须与以下章节一一对应）：\n`);
  tpl.chapters.forEach((ch, i) => {
    lines.push(`### 第${i + 1}章：${ch.label}`);
    lines.push(`- 内容：${ch.desc}`);
    lines.push(`- 本章节使用的slide type（必须按顺序使用）：divider → ${ch.slideTypes.join(' → ')}`);
    lines.push('');
  });
  lines.push(`## 可用版式优先级：${tpl.preferredLayouts.join(' > ')}`);
  lines.push(`优先使用以上版式，避免使用与本模板风格不符的版式。`);
  lines.push(``);
  lines.push(`## 关键红线`);
  lines.push(`- 🔥 最少页数：含封面+目录+结尾在内，总计不得少于5页`);
  lines.push(`- 🔥 必须包含cover和toc和ending三种页面类型`);
  lines.push(`- 禁止输出空壳页面：每页必须有实质性内容（数据/结论/洞察），禁止占位符文字`);
  lines.push(`- 禁止跨页数据不一致：所有数字/评分跨页一致`);
  lines.push(`- 图形优先：全篇图形化版式≥80%，纯文字content页≤3页（访谈提纲除外，可适当增加content页）`);
  return lines.join('\n');
}
