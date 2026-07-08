import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  useEffect(() => {
    // Basic SEO meta tags
    document.title = 'Antigravity CLI — Defy gravity in your terminal';

    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('description', 'Install Google Antigravity CLI in seconds. Fast, extensible, cross-platform command line tools for modern developers.');

    // Open Graph
    setMetaTag('og:title', 'Antigravity CLI — Defy gravity in your terminal', true);
    setMetaTag('og:description', 'Install Google Antigravity CLI in seconds. Fast, extensible, cross-platform command line tools for modern developers.', true);
    setMetaTag('og:type', 'website', true);
    // Note: Do NOT include og:image per requirements

    // Twitter
    setMetaTag('twitter:card', 'summary_large_image');

    return () => {
      // Cleanup if needed (usually root route doesn't unmount, but good practice)
    };
  }, []);

  return <Outlet />;
}
