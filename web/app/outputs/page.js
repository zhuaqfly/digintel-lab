'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

function PptIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export default function OutputsPage() {
  const [outputs, setOutputs] = useState(null);

  useEffect(() => {
    fetch('/api/outputs')
      .then((r) => r.json())
      .then((d) => setOutputs(d.outputs || []));
  }, []);

  return (
    <div className="page">
      <div className="page-head" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span className="chip" style={{ fontSize: 11 }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', marginRight: 5, verticalAlign: 'middle' }} />
            Deliverables
          </span>
        </div>
        <h1>交付物中心</h1>
        <p>咨询项目产出的报告与 PPT 文件，支持在线预览、版本管理与导出</p>
      </div>

      {outputs === null ? (
        <div className="empty">
          <div className="empty-icon">⏳</div>
          加载中...
        </div>
      ) : outputs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-lg)', background: 'var(--gradient-card)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--accent)' }}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>暂无交付物</h3>
          <p className="hint" style={{ maxWidth: 400, margin: '0 auto' }}>
            开始一段咨询对话，系统将自动生成专业的咨询报告与 PPT 交付物
          </p>
          <div style={{ marginTop: 24 }}>
            <Link className="btn primary lg" href="/chat">
              开始咨询对话
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      ) : (
        <div className="card-grid">
          {outputs.map((o) => (
            <div className="card card-glow" key={o.name} style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                width: 100, 
                height: 100, 
                background: o.hasPpt 
                  ? 'radial-gradient(circle at top right, rgba(139,92,246,0.1) 0%, transparent 70%)'
                  : 'radial-gradient(circle at top right, rgba(59,130,246,0.08) 0%, transparent 70%)',
                pointerEvents: 'none' 
              }} />
              
              <div className="card-title-row" style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="agent-card-icon" style={{ 
                    background: o.hasPpt 
                      ? 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.1) 100%)'
                      : 'var(--gradient-card)',
                    color: o.hasPpt ? '#a78bfa' : 'var(--accent)'
                  }}>
                    {o.hasPpt ? <PptIcon /> : <ReportIcon />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span className="card-name" style={{ fontSize: 15, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {o.title || o.name}
                    </span>
                  </div>
                </div>
              </div>

              <p className="hint mono" style={{ margin: '0 0 10px', fontSize: 11, opacity: 0.7 }}>
                {o.name}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {o.pageCount && (
                  <span className="chip cyan">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 3 }}>
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                    </svg>
                    {o.pageCount} 页
                  </span>
                )}
                {o.hasPpt ? (
                  <span className="chip purple">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 3 }}>
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    PPT 预览
                  </span>
                ) : (
                  <span className="chip off">无 PPT</span>
                )}
                <span className="hint" style={{ fontSize: 11, marginLeft: 'auto' }}>
                  {o.mtime || '-'}
                </span>
              </div>

              <div className="card-actions" style={{ marginTop: 'auto' }}>
                <Link className="btn primary" href={`/outputs/${o.name.split('/').map(encodeURIComponent).join('/')}`} style={{ width: '100%' }}>
                  {o.hasPpt ? (
                    <>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      在线预览
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      查看详情
                    </>
                  )}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
