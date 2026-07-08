import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

export function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: '0 10px 40px var(--shadow-color)' }}
      style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at top right, var(--glow-primary), transparent 40%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none'
      }}
      className="card-glow"
      />
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'var(--bg-color)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--primary-accent)'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.25rem', color: 'var(--fg-color)', marginTop: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--muted-color)', lineHeight: 1.6, margin: 0 }}>{description}</p>

      <style>
        {`
          div:hover > .card-glow {
            opacity: 0.1;
          }
        `}
      </style>
    </motion.div>
  );
}
