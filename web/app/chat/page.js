'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Markdown from '@/components/Markdown';
import { STAGES, STAGE_MAP, SKILL_MAP } from '@/lib/stages';

const EXAMPLES = [
  { title: '企业数智化诊断', text: '请为一家年营收 50 亿的港口物流企业做数智化成熟度诊断，涵盖七维度评分、AI就绪度和差距分析' },
  { title: '顶层规划设计', text: '为一家区域龙头制造企业设计数智化转型顶层规划，包括愿景目标、业务架构、技术架构和三年路线图' },
  { title: '数据治理方案', text: '请为一家拥有4个分公司的集团企业设计数据治理体系，包括组织架构、数据标准、质量管理和实施路线' },
  { title: 'AI场景规划', text: '请为港口行业识别TOP10 AI应用场景，并按价值潜力和实施难度做优先级矩阵，推荐前3个POC场景' },
];

const COMPANY_LABELS = {
  industry: '所属行业',
  revenue: '年营收规模',
  employees: '员工规模',
  systems: '核心系统清单',
  dataStatus: '数据现状',
  painPoints: '核心痛点',
};

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function Chat() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectParam = searchParams.get('project');
  const stageParam = searchParams.get('stage');
  const skillParam = searchParams.get('skill');
  const promptParam = searchParams.get('prompt');

  const [providers, setProviders] = useState([]);
  const [project, setProject] = useState(null);
  const [stageInfo, setStageInfo] = useState(null);

  const [providerId, setProviderId] = useState('');
  const [model, setModel] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [showSystem, setShowSystem] = useState(false);

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [reasoning, setReasoning] = useState('');
  const [error, setError] = useState('');
  const [reportTheme, setReportTheme] = useState('red');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genMessage, setGenMessage] = useState('');
  const [genStatus, setGenStatus] = useState('');
  const [generatedDeliverables, setGeneratedDeliverables] = useState([]);
  const [slidesJsonFound, setSlidesJsonFound] = useState(false);
  const [autoStarted, setAutoStarted] = useState(false);
  const [savingConvo, setSavingConvo] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [historyConvos, setHistoryConvos] = useState([]);

  const currentSkillInfo = skillParam ? SKILL_MAP[skillParam] : null;

  const abortRef = useRef(null);
  const bottomRef = useRef(null);
  const taRef = useRef(null);
  const autoStartRef = useRef(false);

  useEffect(() => {
    fetch('/api/models')
      .then((r) => r.json())
      .then((d) => {
        const list = d.providers || [];
        setProviders(list);
        const first = list.find((p) => p.configured);
        if (first) {
          setProviderId(first.id);
          setModel(first.models[0]);
        }
      })
      .catch(() => {});

    if (projectParam) {
      fetch(`/api/projects/${projectParam}`)
        .then((r) => r.json())
        .then((d) => {
          setProject(d.project || null);
          if (stageParam) {
            const st = STAGE_MAP[stageParam];
            setStageInfo(st || null);
          }
        })
        .catch(() => {});
    }
  }, []);

  // 构建系统提示词：项目上下文 + 阶段Agent方法论 + 当前Skill（精确聚焦）
  useEffect(() => {
    let cancelled = false;

    const buildPrompt = async () => {
      if (!project || !stageParam) return;

      const stage = STAGE_MAP[stageParam];
      if (!stage) return;

      const currentSkill = skillParam ? SKILL_MAP[skillParam] : null;

      // 1. 项目上下文（企业信息 + 阶段任务）
      const cp = project.companyProfile || {};
      const infoMap = {
        industry: project.industry || cp.industry,
        revenue: cp.revenue,
        employees: cp.employees,
        systems: cp.systems,
        dataStatus: cp.dataStatus,
        painPoints: cp.painPoints,
      };
      const filled = Object.entries(infoMap)
        .filter(([, v]) => v && String(v).trim())
        .map(([k, v]) => `- ${COMPANY_LABELS[k] || k}：${v}`)
        .join('\n');

      let context = `# 项目背景\n你正在为以下咨询项目提供服务：\n`;
      context += `- 项目名称：${project.name}\n- 客户企业（全称）：${project.client || '未设置'}`;
      if (project.description) context += `\n- 项目说明：${project.description}`;
      if (filled) context += `\n\n## 企业已知信息\n${filled}`;
      else context += `\n\n## 企业已知信息\n（企业详细信息尚未完善，请先通过对话了解企业的行业、规模、系统现状、数据现状和核心痛点）`;
      context += `\n\n当前所处阶段：${stage.index}. ${stage.name}（${stage.goal}）\n阶段关键活动：${stage.activities.join('；')}`;
      context += `\n预期交付物：${stage.deliverables.join('、')}`;

      if (currentSkill) {
        context += `\n\n# 当前原子能力\n你正在使用「${currentSkill.name}」能力开展咨询工作，本次对话将聚焦于该能力的方法论和产出物：${currentSkill.primaryDeliverable || '专项咨询成果'}。\n`;
      }

      context += `\n\n# 你的工作方式
你是资深数智化转型咨询顾问，需要通过对话方式为企业开展${stage.name}。请严格遵循以下规则：

1. **遵循方法论**：你必须严格按照下面提供的"原子能力方法论"中定义的评估维度、评分标准、分析框架来开展对话和分析，不要自行发明维度或评分体系。
2. **聚焦当前能力**：${currentSkill ? `当前聚焦于「${currentSkill.name}」原子能力，请围绕该能力的核心维度展开提问和分析，不要发散到其他能力或阶段。` : '请根据用户选择的具体原子能力开展对应工作，或在自由咨询模式下根据用户需要灵活选择。'}
3. **引导访谈**：先了解企业基本信息和现状，再按方法论的维度逐一询问关键信息，最终给出明确的评分、结论、优势/短板分析。
4. **输出明确结论**：分析完成后，必须给出每个维度的**具体评分（L1-L5或数值分数）**、**明确的优势项和短板项**、**关键差距**、**根因分析**和**改进建议**——这些结论将直接用于生成正式交付物，不可模糊笼统。
5. **结论先行**：每次回复先给出核心结论/评分，再展开分析，便于后续沉淀为交付物。
6. **禁止空话**：所有判断必须基于企业实际情况，要求具体事实支撑，避免"有待加强""需要重视"等无信息量表述。`;

      // 2. Agent 方法论（该阶段主Agent）+ 相关Skills并行加载
      let rolePrompt = '';
      const mainAgent = (stage.agents || [])[0];
      const fetchPromises = [];

      if (mainAgent) {
        fetchPromises.push(
          fetch(`/api/agents/${mainAgent.dir}`)
            .then(r => r.json())
            .then(d => { if (d.raw) return `# 你的角色与方法论\n${d.raw}\n\n`; return ''; })
            .catch(() => '')
        );
      } else {
        fetchPromises.push(Promise.resolve(''));
      }

      // Skills加载策略：
      // - 有skillParam（点击具体原子能力进入）：只加载当前Skill（聚焦深度，不截断）
      // - 无skillParam（自由咨询）：加载该阶段所有Skills（每个截断到3000字符，避免token浪费）
      const skillsToLoad = currentSkill
        ? [currentSkill]
        : (stage.skills || []);

      const skillPromises = skillsToLoad.map(s =>
        fetch(`/api/skills/${s.dir}`)
          .then(r => r.json())
          .then(d => {
            if (d.raw) {
              const body = d.raw.replace(/^---[\s\S]*?---\n/, '');
              const truncated = currentSkill ? body : (body.length > 3000 ? body.slice(0, 3000) + '\n...（方法论已截断）' : body);
              return `## ${s.name}\n${truncated}\n\n`;
            }
            return '';
          })
          .catch(() => '')
      );
      fetchPromises.push(...skillPromises);

      const results = await Promise.all(fetchPromises);
      if (mainAgent && results[0]) rolePrompt += results[0];
      const skillTexts = mainAgent ? results.slice(1) : results;
      if (skillTexts.length > 0 && skillTexts.some(t => t)) {
        rolePrompt += `# ${currentSkill ? '当前原子能力方法论（必须严格遵循）' : '本阶段原子能力方法论（对话和分析必须严格遵循以下标准）'}\n\n`;
        rolePrompt += `【重要】以上方法论中定义的维度、评分标准、分析框架是你开展咨询的唯一依据。你必须：\n`;
        rolePrompt += `- 按这些维度向用户提问并收集信息\n`;
        rolePrompt += `- 按这些维度给出评分和分析结论\n`;
        rolePrompt += `- 后续生成交付物时，将严格使用你在对话中给出的评分和结论\n\n`;
        rolePrompt += skillTexts.join('');
      }

      if (!cancelled) {
        setSystemPrompt(context + (rolePrompt ? `\n${rolePrompt}` : ''));
      }
    };

    buildPrompt();
    return () => {
      cancelled = true;
    };
  }, [project, stageParam, skillParam]);

  // 页面初始化：不自动加载历史对话，不自动发送任何消息
  useEffect(() => {
    if (!projectParam || !stageParam || autoStarted || autoStartRef.current) return;

    autoStartRef.current = true;
    setAutoStarted(true);

    // URL带prompt参数时只填充到输入框，等待用户确认后再发送
    if (promptParam && promptParam.trim()) {
      setInput(promptParam.trim());
      requestAnimationFrame(() => taRef.current?.focus());
    }

    // 获取当前Skill的历史对话（按skillDir筛选，按更新时间倒序）
    const historyUrl = skillParam
      ? `/api/projects/${projectParam}/conversations?stageKey=${stageParam}&skillDir=${encodeURIComponent(skillParam)}`
      : `/api/projects/${projectParam}/conversations?stageKey=${stageParam}`;
    fetch(historyUrl)
      .then((r) => r.json())
      .then((d) => {
        const convos = (d.conversations || []).sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
        setHistoryConvos(convos);
        setHistoryCount(convos.length);
      })
      .catch(() => {});
  }, [projectParam, stageParam, skillParam, autoStarted, promptParam]);

  // 加载指定的历史对话
  function loadConversation(convo) {
    if (!convo) return;
    setConversationId(convo.id);
    setMessages(convo.messages || []);
    setError('');
    setReasoning('');
  }

  // 用户主动点击"继续上次对话"时才加载（最新一条）
  function loadLastConversation() {
    if (historyConvos.length > 0) {
      loadConversation(historyConvos[0]);
    }
  }

  // 自动保存对话（每次消息更新后，延迟保存）
  useEffect(() => {
    if (!projectParam || !stageParam || messages.length === 0 || streaming) return;

    const timer = setTimeout(async () => {
      if (savingConvo) return;
      setSavingConvo(true);
      try {
        if (conversationId) {
          await fetch(`/api/projects/${projectParam}/conversations`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              stageKey: stageParam,
              skillDir: skillParam || null,
              conversationId,
              messages,
              model,
            }),
          });
        } else {
          const res = await fetch(`/api/projects/${projectParam}/conversations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              stageKey: stageParam,
              skillDir: skillParam || null,
              messages,
              model,
            }),
          });
          const d = await res.json();
          if (d.conversation) setConversationId(d.conversation.id);
        }
      } catch {}
      setSavingConvo(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [messages, streaming, projectParam, stageParam, conversationId, model, savingConvo]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, reasoning]);

  const currentProvider = providers.find((p) => p.id === providerId);

  function onProviderChange(id) {
    setProviderId(id);
    const p = providers.find((x) => x.id === id);
    setModel(p && p.models[0] ? p.models[0] : '');
  }

  function useExample(text) {
    setInput(text);
    send(text);
  }

  async function send(overrideText, isAuto = false) {
    const text = (overrideText ?? input).trim();
    if (!text || streaming) return;
    if (!currentProvider?.configured) {
      setError('当前模型未配置 API Key，请先在 web/.env.local 中配置并重启服务');
      return;
    }
    if (!model) {
      setError('请选择模型');
      return;
    }
    setError('');

    const history = [...messages, { role: 'user', content: text }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    if (!isAuto) setInput('');
    if (taRef.current && !isAuto) {
      taRef.current.style.height = 'auto';
    }
    setStreaming(true);

    const ac = new AbortController();
    abortRef.current = ac;
    let acc = '';
    let rAcc = '';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          model,
          systemPrompt: systemPrompt || undefined,
          messages: history,
        }),
        signal: ac.signal,
      });
      if (!res.ok) {
        let msg = `请求失败 (${res.status})`;
        try {
          const j = await res.json();
          if (j.error) msg = j.error;
        } catch {}
        throw new Error(msg);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop();
        for (const line of lines) {
          if (!line.trim()) continue;
          let evt;
          try {
            evt = JSON.parse(line);
          } catch {
            continue;
          }
          if (evt.type === 'token') {
            acc += evt.content;
            setMessages((m) => {
              const c = [...m];
              c[c.length - 1] = { role: 'assistant', content: acc };
              return c;
            });
          } else if (evt.type === 'reasoning') {
            rAcc += evt.content;
            setReasoning(rAcc);
          } else if (evt.type === 'warning') {
            setError(evt.message || '');
          } else if (evt.type === 'error') {
            setError(evt.message || '生成中断');
          }
        }
      }
    } catch (e) {
      if (e.name !== 'AbortError') setError(e.message || String(e));
    } finally {
      setStreaming(false);
      setReasoning('');
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  function clearChat() {
    if (streaming) return;
    setMessages([]);
    setError('');
    setReasoning('');
    setSlidesJsonFound(false);
    setConversationId(null);
    setGeneratedDeliverables([]);
  }

  // 检测消息中是否包含slides-json代码块
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === 'assistant' && lastMsg.content) {
      const hasSlides = /```slides-json[\s\S]*?```/.test(lastMsg.content);
      setSlidesJsonFound(hasSlides);
    } else {
      setSlidesJsonFound(false);
    }
  }, [messages]);

  // 一键生成交付物并归档到项目
  async function generateAndArchiveDeliverable() {
    setGeneratingReport(true);
    setError('');
    setGenProgress(0);
    setGenMessage('正在提交生成任务...');
    setGenStatus('preparing');

    let pollTimer = null;
    const startTime = Date.now();
    const TIMEOUT_MS = 15 * 60 * 1000; // 15分钟超时（与后端模型调用上限对齐）
    let currentTaskId = null;
    let resubmitCount = 0;
    const MAX_RESUBMIT = 1;

    // 提交任务的函数（支持失败后重新提交）
    const submitTask = async () => {
      // 默认交付物标题：优先使用当前Skill的primaryDeliverable
      const defaultTitle = currentSkillInfo?.primaryDeliverable
        || stageInfo?.deliverables?.[0]
        || `${stageInfo?.name || '阶段'}交付物`;
      const res = await fetch(`/api/projects/${projectParam}/deliverables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageKey: stageParam,
          skillDir: skillParam || null,
          title: defaultTitle,
          requirement: '',
          useConversation: true,
          conversationMessages: messages,
          theme: reportTheme,
        }),
      });
      // 先检查响应是否为JSON
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const text = await res.text().catch(() => '');
        throw new Error(`服务返回了非JSON响应（${res.status}），可能是模型服务不可达。请检查：1) API Key是否有效 2) 模型服务地址是否正确 3) 网络是否通畅`);
      }
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || '提交任务失败');
      if (!d.taskId) throw new Error('未获取到任务ID');
      currentTaskId = d.taskId;
      return d.taskId;
    };

    try {
      // 1. 首次提交任务
      await submitTask();

      // 2. 轮询任务状态
      const result = await new Promise((resolve, reject) => {
        const poll = async () => {
          try {
            // 超时检查
            if (Date.now() - startTime > TIMEOUT_MS) {
              reject(new Error('生成超时（超过15分钟），任务仍在后台运行，可稍后在项目工作台查看结果'));
              return;
            }

            const statusRes = await fetch(`/api/projects/${projectParam}/deliverables?taskId=${currentTaskId}`);
            const statusData = await statusRes.json();

            // 任务不存在：可能因服务重启/HMR导致，尝试重新提交一次
            if (!statusRes.ok && statusData.error === '任务不存在' && resubmitCount < MAX_RESUBMIT) {
              resubmitCount++;
              setGenMessage('检测到服务重启，正在重新提交任务...');
              try {
                await submitTask();
                pollTimer = setTimeout(poll, 2000);
                return;
              } catch (reErr) {
                reject(reErr);
                return;
              }
            }

            if (!statusRes.ok) {
              reject(new Error(statusData.error || '查询任务状态失败'));
              return;
            }

            const task = statusData.task;
            if (!task) {
              reject(new Error('任务不存在'));
              return;
            }

            setGenProgress(task.progress || 0);
            setGenMessage(task.message || '');
            setGenStatus(task.status);

            if (task.status === 'done') {
              resolve(task.result);
              return;
            }

            if (task.status === 'error') {
              reject(new Error(task.error || '生成失败'));
              return;
            }

            // 继续轮询（2秒间隔）
            pollTimer = setTimeout(poll, 2000);
          } catch (e) {
            if (e.message && (e.message.includes('超时') || e.message.includes('失败') || e.message.includes('不存在'))) {
              // "任务不存在"且已达重提上限才拒绝
              if (e.message.includes('不存在') && resubmitCount < MAX_RESUBMIT) {
                resubmitCount++;
                setGenMessage('检测到任务中断，正在重新提交...');
                try {
                  await submitTask();
                  pollTimer = setTimeout(poll, 2000);
                } catch (reErr) {
                  reject(reErr);
                }
                return;
              }
              reject(e);
            } else {
              // 网络错误，继续轮询
              pollTimer = setTimeout(poll, 3000);
            }
          }
        };

        pollTimer = setTimeout(poll, 1500);
      });

      // 3. 处理结果
      const deliverable = result?.deliverable;
      const updatedProject = result?.project;

      if (deliverable?.path) {
        setGeneratedDeliverables((prev) => {
          const exists = prev.find((x) => x.id === deliverable.id);
          if (exists) return prev;
          return [...prev, deliverable];
        });
        if (updatedProject) setProject(updatedProject);
        window.open(`/api/files/${deliverable.path}`, '_blank');
        setGenMessage('✓ 生成完成！已在新窗口打开预览');
        setGenProgress(100);
      } else {
        throw new Error('生成结果异常，请重试');
      }
    } catch (e) {
      setError('报告生成失败：' + (e.message || String(e)));
      setGenStatus('error');
      setGenMessage('生成失败：' + (e.message || String(e)));
    } finally {
      if (pollTimer) clearTimeout(pollTimer);
      // 延迟关闭loading状态，让用户看到完成/失败提示
      setTimeout(() => {
        setGeneratingReport(false);
      }, 2000);
    }
  }

  function viewDeliverable(path) {
    window.open(`/api/files/${path}`, '_blank');
  }

  function goToProject() {
    router.push(`/projects/${projectParam}`);
  }

  // 兼容旧方式：从AI回复提取slides JSON生成
  async function generateReportFromChat() {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || !lastMsg.content) return;

    const match = lastMsg.content.match(/```slides-json\s*([\s\S]*?)```/);
    if (!match) {
      setError('未找到结构化幻灯片数据');
      return;
    }

    setGeneratingReport(true);
    setError('');

    try {
      let jsonStr = match[1].trim();
      jsonStr = jsonStr.replace(/^json\s*/i, '');
      const deck = JSON.parse(jsonStr);

      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: deck.title,
          slides: deck.slides,
          theme: reportTheme,
          projectName: project?.name,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `生成失败 (${res.status})`);
      }

      const data = await res.json();
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (e) {
      setError('报告生成失败：' + (e.message || String(e)));
    } finally {
      setGeneratingReport(false);
    }
  }

  function exportChat() {
    const lines = [
      `# 对话记录 · ${project ? project.name : ''} ${stageInfo ? '· ' + stageInfo.name : ''}`,
      `模型：${currentProvider?.name || ''} / ${model}`,
      `时间：${new Date().toLocaleString()}`,
      '',
    ];
    for (const m of messages) {
      lines.push(m.role === 'user' ? '## 提问' : '## 回答', '', m.content, '');
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `digintel-chat-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const noProvider = providers.length > 0 && providers.every((p) => !p.configured);
  const hasProjectContext = project && stageInfo;

  return (
    <div className="chat-page">
      {/* 顶部工具栏 */}
      <div className="chat-top">
            {project && (
              <Link
                href={`/projects/${project.id}`}
                className="project-chip"
                title="返回项目工作台"
                style={{ textDecoration: 'none' }}
              >
                <span className="project-chip-dot" />
                {project.name}
                {stageParam && STAGE_MAP[stageParam] && (
                  <span className="project-chip-stage">{STAGE_MAP[stageParam].name}</span>
                )}
                {currentSkillInfo && (
                  <span className="project-chip-stage" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                    ⚙ {currentSkillInfo.name}
                  </span>
                )}
              </Link>
            )}
        <select value={providerId} onChange={(e) => onProviderChange(e.target.value)}>
          {providers.map((p) => (
            <option key={p.id} value={p.id} disabled={!p.configured}>
              {p.name}{p.configured ? '' : '（未配置Key）'}
            </option>
          ))}
        </select>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={!currentProvider?.configured}
        >
          {(currentProvider?.models || []).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        {stageInfo && (
          <span className="chip purple" style={{ fontSize: 11 }}>
            {stageInfo.icon} {stageInfo.agents[0]?.name || '咨询顾问'}
          </span>
        )}
        <div className="spacer" />
        <button className="btn-ghost" onClick={() => setShowSystem((v) => !v)} title="查看/编辑系统提示词">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 4 }}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          提示词
        </button>
        <button className="btn-ghost" onClick={exportChat} disabled={messages.length === 0} title="导出对话">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 4 }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          导出
        </button>
        <button className="btn-ghost" onClick={clearChat} disabled={messages.length === 0 || streaming} title="清空对话">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 4 }}>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          新对话
        </button>
      </div>

      {/* 系统提示词编辑区 */}
      {showSystem && (
        <div style={{ padding: '0 28px', borderBottom: '1px solid var(--card-border)' }}>
          <textarea
            className="editor"
            style={{ minHeight: 120, margin: '12px 0' }}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="系统提示词（自动加载阶段方法论与原子能力，可直接编辑）"
            spellCheck={false}
          />
        </div>
      )}

      {noProvider && (
        <div style={{ padding: '12px 28px' }}>
          <div className="error-box">
            <strong>⚠️ 尚未配置模型 API Key</strong>
            <p style={{ margin: '6px 0' }}>请复制 <code className="mono">web/.env.example</code> 为 <code className="mono">web/.env.local</code>，填入任意一家的 API Key 后重启服务（npm run dev）。</p>
            <pre className="mono">DEEPSEEK_API_KEY=sk-xxxx</pre>
          </div>
        </div>
      )}
      {error && <div style={{ padding: '0 28px', marginTop: 8 }}><div className="error-box">{error}</div></div>}

      {/* 消息区 */}
      <div className="chat-msgs">
        {messages.length === 0 && (
          <div className="welcome-panel">
            <h2>{hasProjectContext ? `${project.name} · ${stageInfo.name}` : '开启数智咨询对话'}</h2>
            {hasProjectContext ? (
              <>
                <p>
                  {project.client}
                  {project.industry ? ` · ${project.industry}` : ''}
                </p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>
                  ✨ {stageInfo.agents[0]?.name}已就绪
                  {currentSkillInfo
                    ? `，当前聚焦「${currentSkillInfo.name}」原子能力，预期产出：${currentSkillInfo.primaryDeliverable || '专项咨询成果'}`
                    : (stageInfo.skills.length > 0 ? `，已加载${stageInfo.skills.length}项原子能力` : '')}
                </p>

                {/* 历史对话列表（按skill隔离显示） */}
                {historyCount > 0 && (
                  <div style={{ marginTop: 14, width: '100%', maxWidth: 560 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 8, textAlign: 'left', paddingLeft: 4 }}>
                      {currentSkillInfo ? `「${currentSkillInfo.name}」的历史对话：` : '本阶段历史对话：'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {historyConvos.slice(0, 5).map((c, idx) => (
                        <button
                          key={c.id}
                          className="btn btn-ghost"
                          onClick={() => loadConversation(c)}
                          style={{
                            textAlign: 'left',
                            padding: '8px 14px',
                            fontSize: 12,
                            background: idx === 0 ? 'rgba(199,0,11,0.04)' : '#fff',
                            border: idx === 0 ? '1px solid rgba(199,0,11,0.15)' : '1px solid var(--card-border)',
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <span>💬</span>
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.skillName ? `${c.skillName} · ` : ''}
                            {c.messageCount || (c.messages?.length || 0)}条消息
                          </span>
                          <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>
                            {c.updatedAt ? new Date(c.updatedAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 提示词选择区 */}
                {stageInfo.skills && stageInfo.skills.length > 0 && !streaming && (() => {
                  // 根据URL参数过滤：点击具体原子能力进入→只显示该能力；自由咨询→显示所有
                  let skillsToShow = stageInfo.skills;
                  let titleText = '选择原子能力开始：';
                  if (skillParam) {
                    const filtered = stageInfo.skills.filter(s => s.dir === skillParam || s.name === skillParam);
                    if (filtered.length > 0) {
                      skillsToShow = filtered;
                      titleText = `⚙ ${filtered[0].name} - 选择提问方式：`;
                    }
                  }
                  return (
                    <div style={{ marginTop: 20, width: '100%', maxWidth: 720 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, textAlign: 'left', paddingLeft: 4 }}>
                        {titleText}
                      </div>
                      <div style={{ display: 'grid', gap: 10 }}>
                        {skillsToShow.map((s) => (
                          <div key={s.dir} style={{
                            background: '#fff',
                            border: '1px solid var(--card-border)',
                            borderRadius: 10,
                            padding: skillsToShow.length === 1 ? '16px' : '12px 14px',
                            transition: 'all 0.15s',
                            textAlign: 'left',
                          }}>
                            {skillsToShow.length > 1 && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                <span style={{ fontSize: 16 }}>⚙</span>
                                <span style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</span>
                              </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {(s.prompts || [`请使用${s.name}能力，基于当前项目信息开展分析`]).map((prompt, i) => (
                                <div
                                  key={i}
                                  style={{
                                    fontSize: 13,
                                    color: 'var(--text-primary)',
                                    padding: '10px 14px',
                                    background: 'var(--bg-hover)',
                                    borderRadius: 8,
                                    lineHeight: 1.5,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    border: '1px solid transparent',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(199, 0, 11, 0.06)';
                                    e.currentTarget.style.borderColor = 'rgba(199, 0, 11, 0.2)';
                                    e.currentTarget.style.color = 'var(--accent)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--bg-hover)';
                                    e.currentTarget.style.borderColor = 'transparent';
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                  }}
                                  onClick={() => send(prompt, true)}
                                >
                                  {prompt}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      {skillsToShow.length === 1 && (
                        <div style={{ marginTop: 12, textAlign: 'center' }}>
                          <Link
                            href={`/chat?project=${projectParam}&stage=${stageParam}`}
                            style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                          >
                            ← 返回查看所有原子能力
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </>
            ) : (
              <>
                <p>选择模型与专业 Agent 角色，或直接自由提问</p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>AI 将基于沉淀的咨询方法论输出专业分析</p>
              </>
            )}
            {!hasProjectContext && (
              <div className="welcome-examples">
                {EXAMPLES.map((ex, i) => (
                  <div key={i} className="welcome-example" onClick={() => useExample(ex.text)}>
                    <strong>{ex.title}</strong>
                    {ex.text}
                  </div>
                ))}
              </div>
            )}
            {streaming && messages.length === 0 && (
              <div style={{ display: 'flex', gap: 4, padding: '20px', justifyContent: 'center' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-dot 1.2s infinite' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-dot 1.2s infinite 0.2s' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-dot 1.2s infinite 0.4s' }} />
                <span style={{ marginLeft: 10, color: 'var(--text-tertiary)' }}>AI 正在分析...</span>
              </div>
            )}
          </div>
        )}
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className="msg-user">{m.content}</div>
          ) : (
            <div key={i} className="msg-ai">
              <div className="msg-role">
                {currentProvider?.name} / {model}
                {stageInfo ? ` · ${stageInfo.agents[0]?.name || ''}` : ''}
              </div>
              {i === messages.length - 1 && reasoning && (
                <details className="reasoning" open>
                  <summary>思考过程</summary>
                  <div>{reasoning}</div>
                </details>
              )}
              {m.content ? (
                <Markdown>{m.content}</Markdown>
              ) : streaming && i === messages.length - 1 ? (
                <div style={{ display: 'flex', gap: 4, padding: '8px 0' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-dot 1.2s infinite' }} />
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-dot 1.2s infinite 0.2s' }} />
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-dot 1.2s infinite 0.4s' }} />
                </div>
              ) : null}
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* 交付物生成工具栏 - 智能生成模式（在项目上下文中） */}
      {hasProjectContext && messages.length >= 2 && !streaming && (
        <div style={{
          padding: '12px 28px',
          background: generatedDeliverables.length > 0
            ? 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(245,158,11,0.03) 100%)'
            : 'linear-gradient(135deg, rgba(139,0,0,0.04) 0%, rgba(199,0,11,0.02) 100%)',
          borderTop: generatedDeliverables.length > 0 ? '1px solid rgba(16,185,129,0.15)' : '1px solid rgba(199,0,11,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
              {generatedDeliverables.length > 0
                ? `✓ 已生成 ${generatedDeliverables.length} 份交付物`
                : `✦ 基于当前对话生成《${currentSkillInfo?.primaryDeliverable || stageInfo?.deliverables?.[0] || '阶段交付物'}》`
              }
            </span>

            {generatedDeliverables.map((d) => (
              <button
                key={d.id}
                onClick={() => viewDeliverable(d.path)}
                style={{
                  padding: '5px 12px',
                  fontSize: 12,
                  border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 6,
                  background: 'rgba(16,185,129,0.08)',
                  color: '#059669',
                  cursor: 'pointer',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                📊 {d.title.slice(0, 12)}{d.title.length > 12 ? '...' : ''} · {d.pageCount}页
                <span style={{ fontSize: 10, opacity: 0.8 }}>▶ 查看</span>
              </button>
            ))}

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>主题：</span>
              <button
                onClick={() => setReportTheme('red')}
                style={{
                  padding: '5px 10px',
                  fontSize: 11,
                  border: reportTheme === 'red' ? '2px solid #C7000B' : '1px solid var(--card-border)',
                  borderRadius: 6,
                  background: reportTheme === 'red' ? '#fff5f5' : '#fff',
                  color: reportTheme === 'red' ? '#8B0000' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: reportTheme === 'red' ? 600 : 400,
                }}
              >
                ● 红
              </button>
              <button
                onClick={() => setReportTheme('blue')}
                style={{
                  padding: '5px 10px',
                  fontSize: 11,
                  border: reportTheme === 'blue' ? '2px solid #2563eb' : '1px solid var(--card-border)',
                  borderRadius: 6,
                  background: reportTheme === 'blue' ? '#eff6ff' : '#fff',
                  color: reportTheme === 'blue' ? '#0f4c81' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: reportTheme === 'blue' ? 600 : 400,
                }}
              >
                ● 蓝
              </button>
            </div>
            {generatingReport ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 14px',
                fontSize: 12,
                background: genStatus === 'error' ? '#fef2f2' : genStatus === 'done' ? '#f0fdf4' : '#fffbeb',
                border: genStatus === 'error' ? '1px solid #fecaca' : genStatus === 'done' ? '1px solid #bbf7d0' : '1px solid #fde68a',
                borderRadius: 8,
                color: genStatus === 'error' ? '#dc2626' : genStatus === 'done' ? '#16a34a' : '#92400e',
                minWidth: 240,
                maxWidth: 360,
              }}>
                <span style={{
                  fontSize: 16,
                  animation: (genStatus === 'done' || genStatus === 'error') ? 'none' : 'spin 1.2s linear infinite',
                  display: 'inline-block',
                }}>
                  {genStatus === 'error' ? '❌' : genStatus === 'done' ? '✓' : '⏳'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {genMessage || '生成中...'}
                  </div>
                  <div style={{
                    marginTop: 4,
                    height: 4,
                    background: 'rgba(0,0,0,0.08)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.max(genProgress, 5)}%`,
                      background: genStatus === 'error' ? '#dc2626' : genStatus === 'done' ? '#16a34a' : 'linear-gradient(90deg, #C7000B, #E63946)',
                      borderRadius: 2,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              </div>
            ) : (
              <button
                className="btn primary"
                onClick={generateAndArchiveDeliverable}
                style={{ fontSize: 12, padding: '7px 16px' }}
              >
                {generatedDeliverables.length > 0 ? '重新生成' : '✦ 生成并归档'}
              </button>
            )}
            <button
              className="btn"
              onClick={goToProject}
              style={{ fontSize: 12, padding: '7px 14px' }}
              title="返回项目工作台"
            >
              ← 返回项目
            </button>
          </div>
        </div>
      )}

      {/* 兼容旧模式：AI主动输出slides-json时显示 */}
      {slidesJsonFound && !streaming && !hasProjectContext && (
        <div style={{
          padding: '12px 28px',
          background: 'linear-gradient(135deg, rgba(139,0,0,0.04) 0%, rgba(199,0,11,0.02) 100%)',
          borderTop: '1px solid rgba(199,0,11,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
            📊 AI已输出结构化报告数据
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
            <button
              className="btn primary"
              onClick={generateReportFromChat}
              disabled={generatingReport}
              style={{ fontSize: 13, padding: '8px 18px' }}
            >
              {generatingReport ? '生成中...' : '✨ 生成HTML报告'}
            </button>
          </div>
        </div>
      )}

      {/* 输入区 */}
      <div className="chat-bottom">
        {/* 常用提示词快捷按钮 - 基于当前阶段Skills */}
        {stageInfo && stageInfo.skills && stageInfo.skills.length > 0 && messages.length > 0 && !streaming && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, paddingLeft: 4 }}>
              💡 继续深入（点击发送）：
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {stageInfo.skills.flatMap((s) =>
                (s.prompts || []).slice(0, 2).map((prompt, i) => (
                  <button
                    key={`${s.name}-${i}`}
                    onClick={() => {
                      send(prompt);
                    }}
                    style={{
                      fontSize: 11,
                      padding: '5px 10px',
                      background: 'var(--bg-hover)',
                      border: '1px solid var(--card-border)',
                      borderRadius: 12,
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      lineHeight: 1.3,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(199, 0, 11, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(199, 0, 11, 0.2)';
                      e.currentTarget.style.color = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-hover)';
                      e.currentTarget.style.borderColor = 'var(--card-border)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {prompt.length > 28 ? prompt.slice(0, 28) + '...' : prompt}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <div className="chat-input-wrap">
          <div className="chat-input">
            <textarea
              ref={taRef}
              value={input}
              placeholder={hasProjectContext ? "继续咨询，或补充企业信息..." : "输入咨询问题...  Enter 发送 · Shift+Enter 换行"}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
            />
            {streaming ? (
              <button className="send-btn" onClick={stop} title="停止生成" style={{ background: 'rgba(239,68,68,0.8)' }}>
                <StopIcon />
              </button>
            ) : (
              <button
                className="send-btn"
                onClick={() => send()}
                disabled={!input.trim()}
                title="发送"
              >
                <SendIcon />
              </button>
            )}
          </div>
          <div className="chat-hint">
            {currentProvider?.configured
              ? `${currentProvider.name} / ${model}${stageInfo ? ` · ${stageInfo.name}` : ''}${savingConvo ? ' · 保存中...' : ' · 对话自动保存'}`
              : '请先配置 API Key'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="empty">加载中...</div>}>
      <Chat />
    </Suspense>
  );
}
