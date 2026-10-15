'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const AGENT_ICONS = {
  'consulting-workflow': (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24" />
    </svg>
  ),
  'diagnosis-agent': (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
    </svg>
  ),
  'top-level-design-agent': (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1" />
    </svg>
  ),
  'data-governance-agent': (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12v7c0 1.66 4 3 9 3s9-1.34 9-3v-7" />
    </svg>
  ),
  'scenario-planning-agent': (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
    </svg>
  ),
  'org-change-agent': (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  'delivery-agent': (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96M12 22.08V12" />
    </svg>
  ),
};

export default function AgentsPage() {
  const [agents, setAgents] = useState(null);

  useEffect(() => {
    fetch('/api/agents')
      .then((r) => r.json())
      .then((d) => setAgents(d.agents || []));
  }, []);

  return (
    <div className="page">
      <div className="page-head" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span className="chip" style={{ fontSize: 11 }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', marginRight: 5, verticalAlign: 'middle' }} />
            Methodology Engine
          </span>
        </div>
        <h1>Agents</h1>
        <p>专业咨询 Agent 编排：每个 Agent 是沉淀了行业方法论的系统提示词，可在线编辑、版本管理与对话执行</p>
      </div>
      {agents === null ? (
        <div className="empty">
          <div className="empty-icon">⏳</div>
          加载中...
        </div>
      ) : agents.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🤖</div>
          未发现 Agent
        </div>
      ) : (
        <div className="card-grid">
          {agents.map((a) => (
            <div className="card card-glow" key={a.dir}>
              <div className="card-title-row" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="agent-card-icon" style={{ fontSize: 'inherit' }}>
                    {AGENT_ICONS[a.dir] || AGENT_ICONS['consulting-workflow']}
                  </div>
                  <div>
                    <span className="card-name" style={{ fontSize: 15 }}>{a.name}</span>
                    <div style={{ marginTop: 4 }}>
                      {a.version && <span className="chip" style={{ marginRight: 0 }}>v{a.version}</span>}
                    </div>
                  </div>
                </div>
              </div>
              <p className="card-desc" style={{ minHeight: 48 }}>{a.description}</p>
              {a.tags?.length > 0 && (
                <div className="chips" style={{ marginTop: 14 }}>
                  {a.tags.map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="card-actions" style={{ marginTop: 20 }}>
                <Link className="btn" href={`/agents/${a.dir}`}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  查看方法论
                </Link>
                <Link className="btn primary" href={`/chat?agent=${a.dir}`}>
                  启动对话
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
