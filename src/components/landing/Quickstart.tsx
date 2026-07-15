import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from './SectionHeading';

function CodeSnippet({ code }: { code: string }) {
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
    <div style={{
      background: 'var(--bg-color)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '1rem',
      fontFamily: 'var(--font-code)',
      fontSize: '0.875rem',
      color: 'var(--secondary-accent)',
      position: 'relative',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '1rem',
    }}>
      <div style={{ overflowX: 'auto', whiteSpace: 'pre', paddingRight: '2rem' }}>
        {code}
      </div>

      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: 'var(--surface-hover)' }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        aria-label="Copy code snippet"
        title={copied ? "Copied!" : "Copy to clipboard"}
        style={{
          background: 'transparent',
          border: 'none',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--muted-color)',
          transition: 'color 0.2s',
          minWidth: '32px',
          height: '32px',
          borderRadius: '6px',
          flexShrink: 0
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
        {copied ? "Copied code to clipboard" : ""}
      </span>
    </div>
  );
}

export function Quickstart() {
  const steps = [
    {
      title: 'Install',
      description: 'Get the CLI tool installed on your machine using our one-line installer.',
      code: 'curl -fsSL https://antigravity.google/cli/install.sh | bash'
    },
    {
      title: 'Authenticate',
      description: 'Securely link your Google account to enable cloud features.',
      code: 'ag login'
    },
    {
      title: 'Launch',
      description: 'Initialize a new project and start defying gravity.',
      code: 'ag init my-project\ncd my-project\nag start'
    }
  ];

  return (
    <section id="quickstart" style={{ padding: '8rem 0', background: 'var(--surface-color)' }}>
      <div className="container">
        <SectionHeading
          title="From zero to orbit in minutes"
        />

        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',
          position: 'relative'
        }}>
          {/* Connecting line */}
          <div style={{
            position: 'absolute',
            left: '24px',
            top: '24px',
            bottom: '24px',
            width: '2px',
            background: 'var(--border-color)',
            zIndex: 0
          }} className="step-line" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                display: 'flex',
                gap: '2rem',
                position: 'relative',
                zIndex: 1
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--bg-color)',
                border: '2px solid var(--primary-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                color: 'var(--primary-accent)',
                flexShrink: 0
              }}>
                {index + 1}
              </div>

              <div style={{ flex: 1, paddingTop: '0.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--muted-color)', marginBottom: '1.5rem' }}>{step.description}</p>

                <CodeSnippet code={step.code} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>
        {`
          @media (max-width: 768px) {
            .step-line {
              display: none;
            }
          }
        `}
      </style>
    </section>
  );
}
