import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeBlockProps {
  code: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        background: 'var(--bg-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '1rem',
        paddingRight: '3rem',
        fontFamily: 'var(--font-code)',
        fontSize: '0.875rem',
        color: 'var(--secondary-accent)',
        overflowX: 'auto',
        whiteSpace: 'pre'
      }}>
        {code}
      </div>

      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: 'var(--surface-hover)' }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        aria-label="Copy code block"
        title={copied ? "Copied!" : "Copy to clipboard"}
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          background: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          padding: '0.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--muted-color)',
          transition: 'color 0.2s',
          minWidth: '32px',
          height: '32px'
        }}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              style={{ color: 'var(--primary-accent)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Screen reader only announcement */}
      <span aria-live="polite" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
