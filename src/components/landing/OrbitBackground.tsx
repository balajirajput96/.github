import { motion } from 'framer-motion';
import { useMemo } from 'react';

export function OrbitBackground() {
  // Generate random particles (memoized to prevent layout thrashing on re-renders)
  const particles = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  })), []);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: -1,
      pointerEvents: 'none',
      background: 'radial-gradient(circle at 50% 0%, var(--surface-color) 0%, var(--bg-color) 70%)'
    }}>
      {/* Moving gradients */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: '-20%',
          left: '10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, var(--glow-primary) 0%, transparent 70%)',
          filter: 'blur(60px)',
          opacity: 0.4
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          delay: 2
        }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, var(--glow-secondary) 0%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.3
        }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: 'var(--primary-accent)',
            borderRadius: '50%',
            boxShadow: '0 0 10px var(--primary-accent)',
            opacity: 0.5
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(to right, var(--border-color) 1px, transparent 1px),
                          linear-gradient(to bottom, var(--border-color) 1px, transparent 1px)`,
        backgroundSize: '4rem 4rem',
        maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
        opacity: 0.3
      }} />
    </div>
  );
}
