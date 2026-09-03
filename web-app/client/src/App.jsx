import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

const Home = React.lazy(() => import('./pages/Home'));
const Atlassian = React.lazy(() => import('./pages/Atlassian'));
const Slack = React.lazy(() => import('./pages/Slack'));
const ClaudeAI = React.lazy(() => import('./pages/ClaudeAI'));
const YouTube = React.lazy(() => import('./pages/YouTube'));
const GoogleDrive = React.lazy(() => import('./pages/GoogleDrive'));
const GitHub = React.lazy(() => import('./pages/GitHub'));
const Integrations = React.lazy(() => import('./pages/Integrations'));
const Workflows = React.lazy(() => import('./pages/Workflows'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const ContentHub = React.lazy(() => import('./pages/ContentHub'));
const AIAssistant = React.lazy(() => import('./pages/AIAssistant'));
const JobDatabase = React.lazy(() => import('./pages/JobDatabase'));

/**
 * @description The main application component. It sets up routing and lazy-loads
 * page modules so the initial bundle does not contain every route's code.
 * @returns {JSX.Element} The rendered application component.
 */
function App() {
  return (
    <Layout>
      <ErrorBoundary>
        <Suspense fallback={<div role="status" aria-live="polite">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/atlassian" element={<Atlassian />} />
            <Route path="/slack" element={<Slack />} />
            <Route path="/claude-ai" element={<ClaudeAI />} />
            <Route path="/youtube" element={<YouTube />} />
            <Route path="/google-drive" element={<GoogleDrive />} />
            <Route path="/github" element={<GitHub />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/content" element={<ContentHub />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/jobs-db" element={<JobDatabase />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

export default App;
