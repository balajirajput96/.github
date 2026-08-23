
const lines = [
  { cmd: 'ag init', out: 'Initialized empty Antigravity repository.' },
  { cmd: 'ag login', out: 'Successfully authenticated as user@google.com' },
  { cmd: 'ag doctor', out: 'All checks passed. System ready.' },
  { cmd: 'ag update', out: 'Antigravity is already up to date.' },
  { cmd: 'ag plugins', out: '3 installed plugins: format, lint, deploy' },
  { cmd: 'ag deploy', out: 'Deploying to production... Done in 1.2s' }
];

const TERMINAL_HEADER = (
  <div style={{
    background: 'var(--surface-color)',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }}>
    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
    <div style={{ marginLeft: '1rem', color: 'var(--muted-color)', fontSize: '0.875rem', fontFamily: 'var(--font-code)' }}>
      bash — antigravity
    </div>
  </div>
);

// PERFORMANCE OPTIMIZATION:
// Extract purely static UI elements (prompt and cursor) completely outside
// the component function. Because TerminalPreview uses a high-frequency
// interval to update state (`text` and `currentLine`) for the typing animation,
// it re-renders constantly. Hoisting these elements prevents React from
// continuously re-allocating and diffing these nodes and their inline style
// objects on every frame, saving CPU cycles.
const TERMINAL_PROMPT = (
  <>
    <span style={{ color: 'var(--primary-accent)' }}>~</span>
    <span style={{ color: 'var(--secondary-accent)' }}>$</span>
  </>
);

const TERMINAL_CURSOR = (
  <span className="cursor-blink" style={{
    display: 'inline-block',
    width: '8px',
    height: '15px',
    background: 'var(--fg-color)',
    marginLeft: '2px',
    verticalAlign: 'middle'
  }} />
);

export function TerminalPreview() {
  const lineDelay = 1.5; // seconds per line
  const totalDuration = lines.length * lineDelay;

  return (
    <section style={{ padding: '8rem 0' }}>
      <div className="container">
        <div style={{
          background: 'var(--bg-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          overflow: 'hidden',
          maxWidth: '800px',
          margin: '0 auto',
          boxShadow: '0 20px 40px var(--shadow-color)',
        }}>
          {TERMINAL_HEADER}

          {/* Terminal Body */}
          <div style={{
            padding: '1.5rem',
            fontFamily: 'var(--font-code)',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            minHeight: '320px'
          }}>
            {lines.map((line, i) => (
              <div
                key={i}
                className="terminal-line"
                style={{
                  marginBottom: '1rem',
                  animationDelay: `${i * lineDelay}s`
                }}
              >
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {TERMINAL_PROMPT}
                  <span
                    className="terminal-typewriter"
                    style={{
                      color: 'var(--fg-color)',
                      animationDelay: `${i * lineDelay}s`
                    }}
                  >
                    {line.cmd}
                  </span>
                </div>
                <div
                  className="terminal-line"
                  style={{
                    color: 'var(--muted-color)',
                    paddingLeft: '2rem',
                    animationDelay: `${(i * lineDelay) + 1}s`
                  }}
                >
                  {line.out}
                </div>
              </div>
            ))}

            <div
              className="terminal-line"
              style={{
                display: 'flex',
                gap: '1rem',
                animationDelay: `${totalDuration}s`
              }}
            >
              {TERMINAL_PROMPT}
              {TERMINAL_CURSOR}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}