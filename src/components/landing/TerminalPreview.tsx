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
    <span aria-hidden="true" style={{ color: 'var(--primary-accent)', userSelect: 'none' }}>~</span>
    <span aria-hidden="true" style={{ color: 'var(--secondary-accent)', userSelect: 'none' }}>$</span>
  </>
);

const TERMINAL_CURSOR = (
  <span aria-hidden="true" className="cursor-blink" style={{
    display: 'inline-block',
    width: '8px',
    height: '15px',
    background: 'var(--fg-color)',
    marginLeft: '2px',
    verticalAlign: 'middle'
  }} />
);

const SR_ONLY_STYLE = {
  position: 'absolute' as const,
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden' as const,
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap' as const,
  borderWidth: 0,
};

// PERFORMANCE OPTIMIZATION:
// Extract static SR-only JSX block outside of the component.
// Because TerminalPreview triggers frequent state-driven re-renders (setInterval
// for typing animation), this prevents React from needlessly recreating and diffing
// this static block of elements and their mapped lists on every animation frame.
const SR_ONLY_CONTENT = (
  <div style={SR_ONLY_STYLE}>
    Terminal preview showing Antigravity CLI commands:
    <ul>
      {lines.map((line, i) => (
        <li key={i}>
          Command: {line.cmd}. Output: {line.out}
        </li>
      ))}
    </ul>
  </div>
);

export function TerminalPreview() {
  const [currentLine, setCurrentLine] = useState(0);
  const [text, setText] = useState('');

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
    let charIndex = 0;
    let completionTimeout: ReturnType<typeof setTimeout> | undefined;

    const typingInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setText(fullText.substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        completionTimeout = setTimeout(() => {
          setCurrentLine(prev => prev + 1);
          setText('');
        }, 1500); // Wait before next command
      }
    }, 100); // Typing speed

    return () => {
      clearInterval(typingInterval);
      if (completionTimeout) clearTimeout(completionTimeout);
    };
  }, [currentLine]);

  return (
    <section style={{ padding: '8rem 0' }}>
      <div className="container">
        {SR_ONLY_CONTENT}

        <div aria-hidden="true" style={{
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
              <div style={{ display: 'flex', gap: '1rem' }}>
                {TERMINAL_PROMPT}
                <span style={{ color: 'var(--fg-color)' }}>
                  {text}
                  {TERMINAL_CURSOR}
                </span>
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
