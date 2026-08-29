import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Atlassian from './pages/Atlassian';
import Slack from './pages/Slack';
import ClaudeAI from './pages/ClaudeAI';
import YouTube from './pages/YouTube';
import GoogleDrive from './pages/GoogleDrive';
import GitHub from './pages/GitHub';
import Integrations from './pages/Integrations';
import Workflows from './pages/Workflows';
import Analytics from './pages/Analytics';
import ContentHub from './pages/ContentHub';
import AIAssistant from './pages/AIAssistant';

/**
 * @description The main application component. It sets up the routing for the entire application,
 * wrapping all pages within the main `Layout` component.
 * @returns {JSX.Element} The rendered application component.
 */
function App() {
  return (
    <Layout>
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
      </Routes>
    </Layout>
  );
}

export default App;