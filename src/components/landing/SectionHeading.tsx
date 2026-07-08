import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          marginBottom: '1rem',
          color: 'var(--fg-color)'
        }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            color: 'var(--muted-color)',
            fontSize: '1.125rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
