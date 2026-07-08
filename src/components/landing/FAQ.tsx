import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from './SectionHeading';

const faqs = [
  {
    q: 'How do I install Antigravity CLI?',
    a: 'You can install it using our simple curl script: curl -fsSL https://antigravity.google/cli/install.sh | bash. This works on macOS, Linux, and WSL.'
  },
  {
    q: 'Do I need a Google Cloud account to use it?',
    a: 'Authentication is optional for local development features, but a free Google Cloud account is required for cloud syncing and remote execution capabilities.'
  },
  {
    q: 'Does it work offline?',
    a: 'Yes! Core features are fully functional offline. Any cloud-dependent actions will be queued and synchronized automatically when your connection is restored.'
  },
  {
    q: 'How do I create plugins?',
    a: 'Plugins can be written in Rust, Go, or TypeScript. Run `ag plugins create` to generate a scaffold for your preferred language.'
  },
  {
    q: 'How are updates handled?',
    a: 'Run `ag update` to fetch the latest version. You can also configure it to auto-update in the background by setting `AG_AUTO_UPDATE=true`.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section style={{ padding: '8rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <SectionHeading title="Frequently Asked Questions" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: 'var(--surface-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    fontWeight: 500,
                    fontSize: '1.125rem'
                  }}
                  aria-expanded={isOpen}
                >
                  {faq.q}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div style={{
                        padding: '0 1.5rem 1.5rem',
                        color: 'var(--muted-color)',
                        lineHeight: 1.6
                      }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
