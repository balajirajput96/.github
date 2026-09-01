import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ include: /\.(js|jsx|ts|tsx)$/ })],
  oxc: {
    // The existing dashboard contains JSX in .js files. Explicitly opt those
    // source files into Oxc JSX transformation rather than relying on the
    // extension-only default.
    include: /web-app\/client\/src\/.*\.(js|jsx|ts|tsx)$/,
    jsx: {
      runtime: 'classic',
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
  },
});
