export default function Loading() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
      padding: 40,
    }}>
      <div style={{
        width: 36,
        height: 36,
        border: '3px solid #f0f0f0',
        borderTop: '3px solid #C7000B',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>加载中...</div>
    </div>
  );
}
