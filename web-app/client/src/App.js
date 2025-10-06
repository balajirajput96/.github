import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Atlassian from './pages/Atlassian';
import Slack from './pages/Slack';
import ClaudeAI from './pages/ClaudeAI';
import YouTube from './pages/YouTube';
import GoogleDrive from './pages/GoogleDrive';

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
      </Routes>
    </Layout>
  );
}

export default App;