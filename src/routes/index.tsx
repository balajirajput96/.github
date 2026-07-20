import { createRoute } from '@tanstack/react-router';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Quickstart } from '../components/landing/Quickstart';
import { TerminalPreview } from '../components/landing/TerminalPreview';
import { FAQ } from '../components/landing/FAQ';
import { DocsCTA } from '../components/landing/DocsCTA';
import { Footer } from '../components/landing/Footer';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

function LandingPage() {
  return (
    <main style={{ width: '100%', minHeight: '100vh' }}>
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.25rem',
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: 'var(--primary-accent)',
            borderRadius: '4px'
          }} />
          Antigravity
        </div>

        <nav style={{ display: 'flex', gap: '2rem' }}>
          <a href="#features" style={{ fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.2s', color: 'var(--muted-color)' }}
             onMouseEnter={(e) => e.currentTarget.style.color = 'var(--fg-color)'}
             onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-color)'}
             onFocus={(e) => e.currentTarget.style.color = 'var(--fg-color)'}
             onBlur={(e) => e.currentTarget.style.color = 'var(--muted-color)'}>
            Features
          </a>
          <a href="#quickstart" style={{ fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.2s', color: 'var(--muted-color)' }}
             onMouseEnter={(e) => e.currentTarget.style.color = 'var(--fg-color)'}
             onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-color)'}
             onFocus={(e) => e.currentTarget.style.color = 'var(--fg-color)'}
             onBlur={(e) => e.currentTarget.style.color = 'var(--muted-color)'}>
            Quickstart
          </a>
          <a href="https://github.com" style={{ fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.2s', color: 'var(--muted-color)' }}
             onMouseEnter={(e) => e.currentTarget.style.color = 'var(--fg-color)'}
             onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-color)'}
             onFocus={(e) => e.currentTarget.style.color = 'var(--fg-color)'}
             onBlur={(e) => e.currentTarget.style.color = 'var(--muted-color)'}>
            GitHub
          </a>
        </nav>
      </header>

      <Hero />
      <Features />
      <Quickstart />
      <TerminalPreview />
      <FAQ />
      <DocsCTA />
      <Footer />
    </main>
  );
}
