
import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Alert, CircularProgress } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

const JobDatabase = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/jobs/db', {
          headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch jobs');
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <WorkIcon sx={{ mr: 1, fontSize: 32 }} /> Job Database (SQLite)
      </Typography>
      <Typography paragraph>
        All Pharma QA/IPQA jobs collected and saved into the SQLite database.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><b>Job Title</b></TableCell>
                <TableCell><b>Company</b></TableCell>
                <TableCell><b>Location</b></TableCell>
                <TableCell><b>Description</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <a href={job.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
                      {job.title}
                    </a>
                  </TableCell>
                  <TableCell><Chip label={job.company} size="small" color="primary" /></TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.description}</TableCell>
                </TableRow>
              ))}
              {jobs.length === 0 && !error && (
                <TableRow>
                  <TableCell colSpan={4} align="center">No jobs found in database. Run the Job Scan first!</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
export default JobDatabase;
