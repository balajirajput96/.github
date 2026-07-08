import '@fontsource/space-grotesk/index.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/jetbrains-mono/index.css';
import './styles.css';

import { StrictMode, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import { Route as rootRoute } from './routes/__root';
import { Route as indexRoute } from './routes/index';

const routeTree = rootRoute.addChildren([indexRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    createElement(StrictMode, null,
      createElement(RouterProvider, { router })
    )
  );
}
