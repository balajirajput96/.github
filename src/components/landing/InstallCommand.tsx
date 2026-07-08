import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function InstallCommand() {
  const [copied, setCopied] = useState(false);
  const command = "curl -fsSL https://antigravity.google/cli/install.sh | bash";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '0.75rem 1rem',
        maxWidth: '600px',
        margin: '2rem auto',
        boxShadow: '0 10px 30px var(--shadow-color)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        fontFamily: 'var(--font-code)',
        color: 'var(--fg-color)',
        fontSize: '0.875rem',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        paddingRight: '1rem',
        scrollbarWidth: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <span style={{ color: 'var(--muted-color)', userSelect: 'none' }}>$</span>
        <span>
          <span style={{ color: 'var(--secondary-accent)' }}>curl</span> -fsSL https://antigravity.google/cli/install.sh | <span style={{ color: 'var(--primary-accent)' }}>bash</span>
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: 'var(--surface-hover)' }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        aria-label="Copy install command"
        style={{
          background: 'var(--bg-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--muted-color)',
          transition: 'color 0.2s',
          minWidth: '40px',
          height: '40px'
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
