import { motion, HTMLMotionProps } from 'framer-motion';

type BaseProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
};

type ButtonAsButtonProps = BaseProps & HTMLMotionProps<"button"> & {
  href?: never;
};

type ButtonAsLinkProps = BaseProps & HTMLMotionProps<"a"> & {
  href: string;
};

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

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

  if ('href' in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLinkProps;
    return (
      <motion.a
        href={href}
        whileHover={{ y: -2, scale: 1.02 }}
        whileFocus={{ y: -2, scale: 1.02 }}
        whileTap={{ y: 0, scale: 0.98 }}
        style={{ ...baseStyle, ...sizes[size], ...variants[variant], ...style, textDecoration: 'none' }}
        {...rest}
      >
        {children}
      </motion.a>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { href, ...rest } = props as ButtonAsButtonProps;
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileFocus={{ y: -2, scale: 1.02 }}
      whileTap={{ y: 0, scale: 0.98 }}
      style={{ ...baseStyle, ...sizes[size], ...variants[variant], ...style }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
