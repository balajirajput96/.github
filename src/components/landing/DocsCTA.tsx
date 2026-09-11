import { motion } from 'framer-motion';
import { Button } from './Button';

export function DocsCTA() {
  return (
    <section style={{ padding: '8rem 0', background: 'var(--surface-color)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'var(--bg-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            padding: '4rem 2rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(ellipse at center, var(--glow-primary) 0%, transparent 60%)',
            opacity: 0.2,
            pointerEvents: 'none'
          }} />

          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            marginBottom: '1rem',
            position: 'relative',
            zIndex: 1
          }}>
            Ready to explore?
          </h2>
          <p style={{
            color: 'var(--muted-color)',
            fontSize: '1.125rem',
            maxWidth: '600px',
            margin: '0 auto 3rem',
            position: 'relative',
            zIndex: 1
          }}>
            Dive into our comprehensive documentation to discover advanced features, plugin APIs, and deployment strategies.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
            flexWrap: 'wrap'
          }}>
            <Button size="lg" onClick={() => window.location.href = '#'}>
              Documentation
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.location.href = '#'}>
              GitHub
            </Button>
            <Button variant="ghost" size="lg" onClick={() => window.location.href = '#'}>
              Changelog
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
