import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Lazy load route components for code splitting
const Home = React.lazy(() => import('./pages/Home'));
const Atlassian = React.lazy(() => import('./pages/Atlassian'));
const Slack = React.lazy(() => import('./pages/Slack'));
const ClaudeAI = React.lazy(() => import('./pages/ClaudeAI'));
const YouTube = React.lazy(() => import('./pages/YouTube'));
const GoogleDrive = React.lazy(() => import('./pages/GoogleDrive'));

/**
 * @description The main application component. It sets up the routing for the entire application,
 * wrapping all pages within the main `Layout` component.
 * @returns {JSX.Element} The rendered application component.
 */
function App() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/atlassian" element={<Atlassian />} />
          <Route path="/slack" element={<Slack />} />
          <Route path="/claude-ai" element={<ClaudeAI />} />
          <Route path="/youtube" element={<YouTube />} />
          <Route path="/google-drive" element={<GoogleDrive />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
