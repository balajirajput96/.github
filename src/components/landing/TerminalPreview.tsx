import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [currentLine, setCurrentLine] = useState(0);

  const completedLines = useMemo(() => {
    return lines.slice(0, currentLine).map((line, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginBottom: '1rem' }}
      >
        <div style={{ display: 'flex', gap: '1rem' }}>
          {TERMINAL_PROMPT}
          <span style={{ color: 'var(--fg-color)' }}>{line.cmd}</span>
        </div>
        <div style={{ color: 'var(--muted-color)', paddingLeft: '2rem' }}>
          {line.out}
        </div>
      </motion.div>
    ));
  }, [currentLine]);

  useEffect(() => {
    if (currentLine >= lines.length) return;

    const fullText = lines[currentLine].cmd;
    const typingDuration = fullText.length * 100; // 100ms per char

    // PERFORMANCE OPTIMIZATION:
    // Instead of forcing a React state update and re-render every 100ms
    // for each character, we let CSS handle the typing animation smoothly.
    // We just need a timeout to move to the next line after the typing finishes.
    const nextLineTimeout = setTimeout(() => {
      setCurrentLine(prev => prev + 1);
    }, typingDuration + 1500); // typing time + wait before next command

    return () => clearTimeout(nextLineTimeout);
  }, [currentLine]);

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
            <AnimatePresence>
              {completedLines}
            </AnimatePresence>

            {currentLine < lines.length && (
              <div key={currentLine} style={{ display: 'flex', gap: '1rem' }}>
                {TERMINAL_PROMPT}
                <span
                  style={{
                    color: 'var(--fg-color)',
                    display: 'inline-block',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    verticalAlign: 'bottom',
                    width: `${lines[currentLine].cmd.length}ch`,
                    animation: `typing ${lines[currentLine].cmd.length * 100}ms steps(${lines[currentLine].cmd.length}, end) forwards`
                  }}
                >
                  {lines[currentLine].cmd}
                </span>
                {TERMINAL_CURSOR}
              </div>
            )}

            {currentLine >= lines.length && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                {TERMINAL_PROMPT}
                {TERMINAL_CURSOR}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
