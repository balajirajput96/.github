export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '3rem 0',
      background: 'var(--bg-color)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.25rem',
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: 'var(--primary-accent)',
            borderRadius: '4px'
          }} />
          Google Antigravity
        </div>

        <div style={{ color: 'var(--muted-color)', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} Google LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
