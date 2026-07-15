import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ⚡ Bolt: Extract constant array outside component to prevent reallocation on every render
const lines = [
  { cmd: 'ag init', out: 'Initialized empty Antigravity repository.' },
  { cmd: 'ag login', out: 'Successfully authenticated as user@google.com' },
  { cmd: 'ag doctor', out: 'All checks passed. System ready.' },
  { cmd: 'ag update', out: 'Antigravity is already up to date.' },
  { cmd: 'ag plugins', out: '3 installed plugins: format, lint, deploy' },
  { cmd: 'ag deploy', out: 'Deploying to production... Done in 1.2s' }
];

export function TerminalPreview() {
  const [currentLine, setCurrentLine] = useState(0);
  const [text, setText] = useState('');

  // ⚡ Bolt: Memoize previously completed lines to prevent re-rendering them every 100ms
  // during the typing animation. This avoids unnecessary React element creation and reconciliation.
  const renderedCompletedLines = useMemo(() => {
    return lines.slice(0, currentLine).map((line, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginBottom: '1rem' }}
      >
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ color: 'var(--primary-accent)' }}>~</span>
          <span style={{ color: 'var(--secondary-accent)' }}>$</span>
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

    const typingInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setText(fullText.substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentLine(prev => prev + 1);
          setText('');
        }, 1500); // Wait before next command
      }
    }, 100); // Typing speed

    return () => clearInterval(typingInterval);
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
          {/* Terminal Header */}
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

          {/* Terminal Body */}
          <div style={{
            padding: '1.5rem',
            fontFamily: 'var(--font-code)',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            minHeight: '320px'
          }}>
            <AnimatePresence>
              {renderedCompletedLines}
            </AnimatePresence>

            {currentLine < lines.length && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ color: 'var(--primary-accent)' }}>~</span>
                <span style={{ color: 'var(--secondary-accent)' }}>$</span>
                <span style={{ color: 'var(--fg-color)' }}>
                  {text}
                  <span className="cursor-blink" style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '15px',
                    background: 'var(--fg-color)',
                    marginLeft: '2px',
                    verticalAlign: 'middle'
                  }} />
                </span>
              </div>
            )}

            {currentLine >= lines.length && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ color: 'var(--primary-accent)' }}>~</span>
                <span style={{ color: 'var(--secondary-accent)' }}>$</span>
                <span className="cursor-blink" style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '15px',
                  background: 'var(--fg-color)',
                  marginLeft: '2px',
                  verticalAlign: 'middle'
                }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
