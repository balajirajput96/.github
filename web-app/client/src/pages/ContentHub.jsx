import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Button, TextField, Chip, Alert, Grid } from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function ContentHub() {
  const [value, setValue] = useState(0);
  const [ytTopic, setYtTopic] = useState('');
  const [ytDraft, setYtDraft] = useState('');
  const [socialPost, setSocialPost] = useState('');
  const [copied, setCopied] = useState(false);

  const handleYtGenerate = () => {
    if (!ytTopic) return;
    setYtDraft(`🎬 Title: Master ${ytTopic} | Step-by-Step QA Guide\n\n📌 Description: In this video, we break down key concepts of ${ytTopic} for Pharma & Quality Assurance professionals. Learn practical workflows, compliance standards (WHO-GMP, 21 CFR Part 11), and interview best practices.\n\n🏷️ Tags: #Pharmaceutical #QualityAssurance #${ytTopic.replace(/\s+/g, '')} #GMP`);
  };

  const handleSocialGenerate = () => {
    setSocialPost(`🚀 Passionate QA Officer specializing in IPQA, OSD Tablet Manufacturing, and BMR/BPR Compliance across Gujarat pharmaceutical hubs.\n\nActively connecting with Talent Acquisition & HR leaders in Vadodara, Halol, Savli, and Ahmedabad.\n\nLet's connect: balajirajput966@gmail.com | +91 8780861044`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Content Management Hub
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Generate, draft, and synchronize multi-channel content across platforms
      </Typography>

      {copied && (
        <Alert severity="success" sx={{ my: 2 }}>
          Copied to clipboard!
        </Alert>
      )}

      <Paper sx={{ mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={(e, val) => setValue(val)} aria-label="content hub tabs">
            <Tab label="YouTube Publishing" />
            <Tab label="Social Media & LinkedIn" />
            <Tab label="Document Hub" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <Typography variant="h6" gutterBottom>YouTube Video Metadata Generator</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Video Topic"
                value={ytTopic}
                onChange={(e) => setYtTopic(e.target.value)}
                placeholder="e.g. IPQA Tablet Compression In-Process Checks"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="contained" sx={{ height: '56px', width: '100%' }} onClick={handleYtGenerate}>
                Generate Metadata
              </Button>
            </Grid>
          </Grid>
          {ytDraft && (
            <Paper sx={{ p: 2, mt: 3, bgcolor: '#f9f9f9', whiteSpace: 'pre-line' }}>
              <Typography variant="body2">{ytDraft}</Typography>
              <Button size="small" variant="outlined" sx={{ mt: 2 }} onClick={() => copyToClipboard(ytDraft)}>
                Copy Metadata
              </Button>
            </Paper>
          )}
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Typography variant="h6" gutterBottom>LinkedIn & WhatsApp Post Drafter</Typography>
          <Button variant="contained" sx={{ mt: 1 }} onClick={handleSocialGenerate}>
            Generate Outreach Post
          </Button>
          {socialPost && (
            <Paper sx={{ p: 2, mt: 3, bgcolor: '#f9f9f9', whiteSpace: 'pre-line' }}>
              <Typography variant="body2">{socialPost}</Typography>
              <Button size="small" variant="outlined" sx={{ mt: 2 }} onClick={() => copyToClipboard(socialPost)}>
                Copy Post
              </Button>
            </Paper>
          )}
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Typography variant="h6" gutterBottom>Document Repository</Typography>
          <Typography paragraph color="text.secondary">
            Pre-compiled resumes, BMR/BPR checklists, and SOP templates ready for dispatch.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Chip label="Balaji_Rajput_QA_Officer_Resume.pdf" color="primary" />
            <Chip label="Vadodara_OSD_Companies.csv" color="success" />
            <Chip label="IPQA_Checklist_SOP.docx" color="info" />
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default ContentHub;