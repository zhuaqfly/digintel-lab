'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Markdown from '@/components/Markdown';

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

export default function AgentDetail() {
  const { name } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() {
    const res = await fetch(`/api/agents/${name}`);
    if (!res.ok) {
      setError('Agent 加载失败');
      return;
    }
    const d = await res.json();
    setData(d);
    setContent(d.raw || '');
  }

  useEffect(() => {
    load();
  }, [name]);

  async function save() {
    setSaving(true);
    setMsg('');
    const res = await fetch(`/api/agents/${name}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const d = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) {
      setMsg('已保存');
      setEditing(false);
      load();
      setTimeout(() => setMsg(''), 2000);
    } else {
      setMsg(d.error || '保存失败');
    }
  }

  if (error) {
    return (
      <div className="page">
        <div className="empty">
          <div className="empty-icon">⚠️</div>
          {error}
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="page">
        <div className="empty">
          <div className="empty-icon">⏳</div>
          加载中...
        </div>
      </div>
    );
  }

  const meta = data.meta || {};

  return (
    <div className="page">
      {/* 返回链接 */}
      <div style={{ marginBottom: 20 }}>
        <Link href="/agents" className="btn-ghost" style={{ padding: '6px 0', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <BackIcon />
          返回 Agents 列表
        </Link>
      </div>

      {/* 头部信息 */}
      <div style={{ 
        background: 'var(--card-bg)', 
        border: '1px solid var(--card-border)', 
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        marginBottom: 20,
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          width: 200, 
          height: 200, 
          background: 'radial-gradient(circle at top right, rgba(139,92,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none' 
        }} />
        
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span className="chip purple" style={{ fontSize: 11 }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-purple)', marginRight: 5, verticalAlign: 'middle' }} />
                Agent
              </span>
              {meta.version && <span className="chip">v{meta.version}</span>}
              {msg && (
                <span className="chip ok" style={{ animation: 'fadeIn 0.3s' }}>
                  ✓ {msg}
                </span>
              )}
            </div>
            <h1 style={{ 
              fontSize: 26, 
              fontWeight: 700, 
              margin: 0,
              background: 'linear-gradient(135deg, #f1f5f9 0%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {meta.name || name}
            </h1>
            {meta.description && (
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8, margin: '8px 0 0' }}>
                {meta.description}
              </p>
            )}
            {(Array.isArray(meta.tags) && meta.tags.length > 0) && (
              <div className="chips" style={{ marginTop: 14 }}>
                {meta.tags.map((t) => (
                  <span className="chip purple" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            {editing ? (
              <>
                <button 
                  className="btn primary" 
                  onClick={save} 
                  disabled={saving}
                  style={{ minWidth: 80 }}
                >
                  <SaveIcon />
                  {saving ? '保存中...' : '保存'}
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setEditing(false);
                    setContent(data.raw || '');
                    setMsg('');
                  }}
                >
                  取消
                </button>
              </>
            ) : (
              <>
                <Link className="btn primary" href={`/chat?agent=${name}`}>
                  <PlayIcon />
                  启动对话
                </Link>
                <button className="btn" onClick={() => setEditing(true)}>
                  <EditIcon />
                  编辑
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {editing ? (
          <div style={{ position: 'relative' }}>
            <div style={{ 
              padding: '12px 20px', 
              borderBottom: '1px solid var(--card-border)',
              background: 'rgba(139,92,246,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: '#a78bfa'
            }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              编辑模式 - 修改 Agent 提示词方法论
            </div>
            <textarea
              className="editor"
              style={{ 
                minHeight: 'calc(100vh - 400px)', 
                margin: 0, 
                border: 'none',
                borderRadius: 0,
                background: 'rgba(0,0,0,0.2)'
              }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              spellCheck={false}
            />
          </div>
        ) : (
          <div style={{ padding: '28px 32px' }}>
            <Markdown>{data.body || data.raw}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
