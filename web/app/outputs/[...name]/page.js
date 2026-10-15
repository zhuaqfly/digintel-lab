'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

export default function OutputDetail() {
  const params = useParams();
  const nameParts = params.name || [];
  const [item, setItem] = useState(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const decodedName = nameParts.map((p) => decodeURIComponent(p)).join('/');
  const iframeRef = useRef(null);

  const loadItem = useCallback(() => {
    fetch('/api/outputs')
      .then((r) => r.json())
      .then((d) => {
        const found = (d.outputs || []).find((o) => o.name === decodedName);
        setItem(found || { name: decodedName, hasPpt: false, files: [] });
      })
      .catch(() => setItem({ name: decodedName, hasPpt: false, files: [] }));
  }, [decodedName]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  const pptUrl = item?.path ? `/api/files/${item.path}` : `/api/files/${decodedName}/index.html`;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // 尝试查找项目ID和交付物ID
      const pathParts = decodedName.split('/');
      if (pathParts.length >= 2) {
        const projectId = pathParts[0];
        const deliverableTitle = pathParts[pathParts.length - 1];
        const stageKey = pathParts[1] || '';

        // 尝试通过项目API查找交付物ID
        const res = await fetch(`/api/projects/${projectId}/deliverables`);
        if (res.ok) {
          const data = await res.json();
          const d = (data.deliverables || []).find(
            (x) => x.title === deliverableTitle || x.path?.includes(deliverableTitle)
          );
          if (d) {
            const rerenderRes = await fetch(
              `/api/projects/${projectId}/deliverables?rerender=${d.id}`
            );
            if (rerenderRes.ok) {
              const result = await rerenderRes.json();
              if (result.success) {
                // 强制刷新 iframe
                setIframeKey((k) => k + 1);
                loadItem();
                return;
              }
            }
          }
        }
      }

      // 如果找不到项目，直接重新加载 iframe
      setIframeKey((k) => k + 1);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const handleMouseEnter = () => {
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.focus();
      } catch {}
    }
  };

  return (
    <div className="page" style={{ maxWidth: '1400px' }}>
      {/* 返回链接 */}
      <div style={{ marginBottom: 20 }}>
        <Link href="/outputs" className="btn-ghost" style={{ padding: '6px 0', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <BackIcon />
          返回交付物列表
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
          background: item?.hasPpt 
            ? 'radial-gradient(circle at top right, rgba(139,92,246,0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle at top right, rgba(59,130,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none' 
        }} />
        
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span className={item?.hasPpt ? 'chip purple' : 'chip'} style={{ fontSize: 11 }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: item?.hasPpt ? 'var(--accent-purple)' : 'var(--accent)', marginRight: 5, verticalAlign: 'middle' }} />
                PPT 演示文稿
              </span>
              {item?.pageCount && <span className="chip cyan">{item.pageCount} 页</span>}
              {item?.mtime && <span className="chip off">更新 {item.mtime}</span>}
            </div>
            <h1 style={{ 
              fontSize: 24, 
              fontWeight: 700, 
              margin: 0,
              background: 'linear-gradient(135deg, #f1f5f9 0%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {item?.title || decodedName}
            </h1>
            {item?.name && (
              <p className="hint mono" style={{ marginTop: 8, fontSize: 12 }}>
                {item.name}
              </p>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <button
              className="btn"
              onClick={handleRefresh}
              disabled={refreshing}
              title="重新渲染交付物（修复导航问题）"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                background: refreshing ? 'var(--card-border)' : 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                fontSize: 13,
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
            >
              <span style={{ display: 'inline-block', animation: refreshing ? 'spin 1s linear infinite' : 'none' }}>
                <RefreshIcon />
              </span>
              {refreshing ? '修复中...' : '修复导航'}
            </button>
            {item?.hasPpt && (
              <a
                className="btn primary"
                href={pptUrl}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalIcon />
                新窗口打开
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 预览/内容区域 */}
      {item?.hasPpt ? (
        <div style={{ 
          background: 'var(--card-bg)', 
          border: '1px solid var(--card-border)', 
          borderRadius: 'var(--radius-lg)',
          padding: 16,
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <iframe
            key={iframeKey}
            ref={iframeRef}
            className="ppt-frame"
            src={pptUrl}
            title="PPT 预览"
            tabIndex={0}
            onMouseEnter={handleMouseEnter}
            onLoad={handleMouseEnter}
            style={{ 
              width: '100%', 
              height: 'calc(100vh - 320px)', 
              border: 'none',
              borderRadius: 'var(--radius-md)',
              background: '#fff',
              outline: 'none',
            }}
          />
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-lg)', background: 'var(--gradient-card)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--accent)' }}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>该交付物暂无 PPT 预览</h3>
          <p className="hint" style={{ maxWidth: 500, margin: '0 auto 20px' }}>
            文件清单：{(item?.files || []).join('、') || '—'}
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}