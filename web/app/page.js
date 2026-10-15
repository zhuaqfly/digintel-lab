'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const QUICK_ENTRIES = [
  {
    href: '/projects',
    title: '咨询项目',
    desc: '创建项目，沿六阶段开展咨询',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
        <path d="M8 13h8M8 16.5h5" />
      </svg>
    ),
  },
  {
    href: '/chat',
    title: 'AI 对话',
    desc: '直连大模型，选择 Agent 角色开展咨询',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: '/chat?agent=diagnosis-agent',
    title: '开始诊断',
    desc: '成熟度评估 + AI就绪度 + 差距分析',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    href: '/agents',
    title: 'Agent 编排',
    desc: '管理专业咨询Agent方法论',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <path d="M10 6.5h4M10 17.5h4M6.5 10v4M17.5 10v4" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    href: '/outputs',
    title: '交付物中心',
    desc: '咨询报告与PPT在线预览',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M8 13h8M8 17h5" />
      </svg>
    ),
  },
];

const AGENT_ICONS = {
  'consulting-workflow': '🎯',
  'diagnosis-agent': '🔍',
  'top-level-design-agent': '🏛️',
  'data-governance-agent': '🗄️',
  'scenario-planning-agent': '💡',
  'org-change-agent': '👥',
  'delivery-agent': '📦',
};

export default function Home() {
  const [data, setData] = useState({ agents: [], skills: [], outputs: [], providers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/agents').then((r) => r.json()).catch(() => ({})),
      fetch('/api/skills').then((r) => r.json()).catch(() => ({})),
      fetch('/api/outputs').then((r) => r.json()).catch(() => ({})),
      fetch('/api/models').then((r) => r.json()).catch(() => ({})),
    ]).then(([a, s, o, m]) => {
      setData({
        agents: a.agents || [],
        skills: s.skills || [],
        outputs: o.outputs || [],
        providers: m.providers || [],
      });
      setLoading(false);
    });
  }, []);

  const configured = data.providers.filter((p) => p.configured);

  return (
    <div className="page">
      {/* Hero 区域 - 科技感渐变 */}
      <div className="hero-section">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          系统就绪
          <span style={{ opacity: 0.5, marginLeft: 4, fontWeight: 400 }}>MVP v0.1</span>
        </div>
        <h1 className="hero-title">数智咨询工作台</h1>
        <p className="hero-desc">
          以 Multi-Agent 架构驱动企业数智化转型咨询 · 大模型直连 · 方法论沉淀 · 交付物自动化
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <Link href="/chat" className="btn primary lg">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            开始对话
          </Link>
          <Link href="/agents" className="btn lg">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            浏览 Agents
          </Link>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{data.agents.length}</div>
          <div className="stat-label">咨询 Agents</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.skills.length}</div>
          <div className="stat-label">原子 Skills</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.outputs.length}</div>
          <div className="stat-label">交付物</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {configured.length}
            <span className="stat-sub">/{data.providers.length}</span>
          </div>
          <div className="stat-label">模型接入</div>
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="section-title">快捷入口</div>
      <div className="quick-grid">
        {QUICK_ENTRIES.map((q) => (
          <Link key={q.href} href={q.href} className="quick-card">
            <div className="quick-icon">{q.icon}</div>
            <div className="quick-title">{q.title}</div>
            <div className="quick-desc">{q.desc}</div>
          </Link>
        ))}
      </div>

      {/* 下方双栏 */}
      <div className="two-col">
        {/* 模型接入状态 */}
        <div className="card">
          <div className="card-title">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 2v10l7 7" />
            </svg>
            模型接入
          </div>
          {data.providers.map((p) => (
            <div key={p.id} className="status-row">
              <div className="status-row-info">
                <div className="status-row-name">{p.name}</div>
                <div className="status-row-env">{p.apiKeyEnv}</div>
              </div>
              <span className={p.configured ? 'chip ok' : 'chip off'}>
                {p.configured ? '● 已接入' : '○ 未配置'}
              </span>
            </div>
          ))}
          {configured.length === 0 && (
            <div className="hint" style={{ marginTop: 16, padding: 16, background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(251,191,36,0.04) 100%)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ color: 'var(--warning)' }}>配置提示</strong>
              <p style={{ margin: '8px 0' }}>复制 <code className="mono" style={{ color: '#d97706' }}>web/.env.example</code> 为 <code className="mono" style={{ color: '#d97706' }}>web/.env.local</code>，填入任意一家的 API Key 后重启服务即可使用对话功能。</p>
              <pre className="mono" style={{ background: 'rgba(15,23,42,0.05)', color: '#b45309', padding: 12, borderRadius: 8, marginTop: 10, fontSize: 12 }}>
                DEEPSEEK_API_KEY=sk-xxxx
              </pre>
            </div>
          )}
        </div>

        {/* 最近交付物 */}
        <div className="card">
          <div className="card-title">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            最近交付物
          </div>
          {data.outputs.length === 0 ? (
            <p className="hint">暂无交付物，开始一段咨询对话即可生成</p>
          ) : (
            data.outputs.slice(0, 6).map((o) => (
              <Link
                key={o.name}
                href={`/outputs/${o.name}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--card-border)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{o.hasPpt ? '📊' : '📄'}</span>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13.5 }}>{o.title || o.name}</div>
                    <div className="hint mono" style={{ fontSize: 11 }}>{o.name}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {o.pageCount && <span className="chip cyan">{o.pageCount}页</span>}
                  <span className="hint" style={{ fontSize: 11 }}>{o.mtime}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Agent 全景 */}
      <div style={{ marginTop: 32 }}>
        <div className="section-title">咨询 Agents</div>
        <div className="card-grid">
          {data.agents.map((a) => (
            <div className="card card-glow" key={a.dir}>
              <div className="card-title-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="agent-card-icon">{AGENT_ICONS[a.dir] || '🤖'}</div>
                  <div>
                    <div className="card-name">{a.name}</div>
                    {a.version && <span className="chip" style={{ marginTop: 4 }}>v{a.version}</span>}
                  </div>
                </div>
              </div>
              <p className="card-desc">{a.description}</p>
              {a.tags?.length > 0 && (
                <div className="chips">
                  {a.tags.slice(0, 4).map((t) => (
                    <span className="chip purple" key={t}>{t}</span>
                  ))}
                </div>
              )}
              <div className="card-actions">
                <Link className="btn" href={`/agents/${a.dir}`}>
                  查看方法论
                </Link>
                <Link className="btn primary" href={`/chat?agent=${a.dir}`}>
                  启动对话 →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
