'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const DOMAIN_CONFIG = {
  '_shared': {
    label: '共享能力层',
    color: 'purple',
    desc: '通用基础能力，可被所有 Agent 调用',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  '1-diagnosis': {
    label: '诊断域',
    color: 'cyan',
    desc: '成熟度评估、AI就绪度诊断、差距分析',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  '2-top-level-design': {
    label: '顶层设计域',
    color: 'blue',
    desc: '愿景规划、架构设计、路线图制定',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  '3-data-governance': {
    label: '数据治理域',
    color: 'green',
    desc: '数据资产盘点、标准体系、质量管理',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  '4-scenario-planning': {
    label: '场景规划域',
    color: 'orange',
    desc: 'AI场景识别、优先级评估、POC设计',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  '5-org-change': {
    label: '组织变革域',
    color: 'pink',
    desc: '组织架构、人才培养、变革管理',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      </svg>
    ),
  },
  '6-delivery': {
    label: '交付域',
    color: 'indigo',
    desc: 'PPT生成、报告输出、成果可视化',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
};

export default function SkillsPage() {
  const [skills, setSkills] = useState(null);

  useEffect(() => {
    fetch('/api/skills')
      .then((r) => r.json())
      .then((d) => setSkills(d.skills || []));
  }, []);

  if (skills === null) {
    return (
      <div className="page">
        <div className="empty">
          <div className="empty-icon">⏳</div>
          加载中...
        </div>
      </div>
    );
  }

  const groups = {};
  for (const s of skills) {
    const g = s.dir.includes('/') ? s.dir.split('/')[0] : '其他';
    (groups[g] = groups[g] || []).push(s);
  }
  const order = Object.keys(groups).sort((a, b) =>
    a === '_shared' ? -1 : b === '_shared' ? 1 : a.localeCompare(b)
  );

  return (
    <div className="page">
      <div className="page-head" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span className="chip" style={{ fontSize: 11 }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', marginRight: 5, verticalAlign: 'middle' }} />
            Atomic Capabilities
          </span>
        </div>
        <h1>Skills</h1>
        <p>原子咨询能力库：每个 Skill 是可复用的专业方法论模块，支持直接调用或作为 Agent 的组成部分</p>
      </div>

      {order.map((g) => {
        const config = DOMAIN_CONFIG[g] || {
          label: g,
          color: 'blue',
          desc: '专业能力模块',
          icon: null,
        };
        return (
          <div key={g} style={{ marginBottom: 36 }}>
            <div className="section-title" style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: 'var(--radius-md)', 
                  background: 'var(--gradient-card)',
                  border: '1px solid var(--card-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)'
                }}>
                  {config.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', textTransform: 'none', letterSpacing: 'normal' }}>
                    {config.label}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>
                    {config.desc}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-grid">
              {groups[g].map((s) => (
                <div className="card card-glow" key={s.dir}>
                  <div className="card-title-row" style={{ marginBottom: 12 }}>
                    <span className="card-name" style={{ fontSize: 15 }}>{s.name}</span>
                    {s.version && <span className="chip">v{s.version}</span>}
                  </div>
                  <p className="card-desc">{s.description}</p>
                  <div className="chips" style={{ marginTop: 12 }}>
                    {(s.tags || []).map((t) => (
                      <span className="chip" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="card-actions" style={{ marginTop: 18 }}>
                    <Link className="btn" href={`/skills/${s.dir}`}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      查看详情
                    </Link>
                    <Link className="btn primary" href={`/chat?skill=${s.dir}`}>
                      直接调用
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {skills.length === 0 && (
        <div className="empty">
          <div className="empty-icon">⚙️</div>
          未发现 Skill
        </div>
      )}
    </div>
  );
}
