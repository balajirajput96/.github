import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonBaseProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
};

type ButtonAsButtonProps = ButtonBaseProps & Omit<HTMLMotionProps<"button">, keyof ButtonBaseProps> & { href?: never };
type ButtonAsAnchorProps = ButtonBaseProps & Omit<HTMLMotionProps<"a">, keyof ButtonBaseProps> & { href: string; target?: string; rel?: string };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

export function Button({ variant = 'primary', size = 'md', children, style, ...props }: ButtonProps) {

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: '8px',
    fontWeight: 600,
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.5px',
    transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const sizes: Record<string, React.CSSProperties> = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--primary-accent)',
      color: 'var(--bg-color)',
      boxShadow: '0 0 20px var(--glow-primary)',
    },
    secondary: {
      backgroundColor: 'var(--surface-color)',
      color: 'var(--fg-color)',
      border: '1px solid var(--border-color)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--primary-accent)',
      border: '1px solid var(--primary-accent)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--fg-color)',
    }
  };

  const mergedStyle = { ...baseStyle, ...sizes[size], ...variants[variant], ...style };

  if ('href' in props && props.href) {
    return (
      <motion.a
        whileHover={{ y: -2, scale: 1.02 }}
        whileFocus={{ y: -2, scale: 1.02 }}
        whileTap={{ y: 0, scale: 0.98 }}
        style={{ ...mergedStyle, textDecoration: 'none' }}
        {...(props as HTMLMotionProps<"a">)}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileFocus={{ y: -2, scale: 1.02 }}
      whileTap={{ y: 0, scale: 0.98 }}
      style={mergedStyle}
      {...(props as HTMLMotionProps<"button">)}
    >
      {children}
    </motion.button>
  );
}
