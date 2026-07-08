import { motion } from 'framer-motion';
import { SectionHeading } from './SectionHeading';

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

                <div style={{
                  background: 'var(--bg-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '1rem',
                  fontFamily: 'var(--font-code)',
                  fontSize: '0.875rem',
                  color: 'var(--secondary-accent)',
                  overflowX: 'auto',
                  whiteSpace: 'pre'
                }}>
                  {step.code}
                </div>
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
