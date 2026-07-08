import { motion } from 'framer-motion';
import { OrbitBackground } from './OrbitBackground';
import { InstallCommand } from './InstallCommand';
import { Button } from './Button';

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }
    }
  };

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6rem 2rem 4rem',
      overflow: 'hidden'
    }}>
      <OrbitBackground />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
        >
          <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
            <span style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              fontSize: '0.875rem',
              color: 'var(--secondary-accent)',
              fontFamily: 'var(--font-code)',
              letterSpacing: '0.05em'
            }}>
              v2.0 is now available
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: 'clamp(3rem, 8vw, 5.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem'
            }}
          >
            Defy gravity in your <span className="text-gradient">terminal</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
              color: 'var(--muted-color)',
              marginBottom: '2.5rem',
              maxWidth: '600px',
              margin: '0 auto 2.5rem'
            }}
          >
            Install Google Antigravity CLI in seconds. Fast, extensible, cross-platform command line tools for modern developers.
          </motion.p>

          <motion.div variants={itemVariants}>
            <InstallCommand />
          </motion.div>

          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              marginTop: '2rem'
            }}
          >
            <Button size="lg" onClick={() => document.getElementById('quickstart')?.scrollIntoView({ behavior: 'smooth' })}>
              Get Started
            </Button>
            <Button variant="secondary" size="lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              View Features
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
