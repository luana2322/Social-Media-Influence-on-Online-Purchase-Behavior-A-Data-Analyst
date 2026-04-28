import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobStatus, getJobResults } from '../services/api';
import { Box, Typography, LinearProgress, Alert, Button, Card, CardContent, Grid } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

function ResultsPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, resultsRes] = await Promise.all([
          getJobStatus(jobId),
          getJobResults(jobId)
        ]);
        setJob(jobRes.data);
        setResults(resultsRes.data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    if (!job || job.status === 'pending' || job.status === 'processing') {
      const interval = setInterval(fetchData, 3000);
      return () => clearInterval(interval);
    }
  }, [jobId, job?.status]);

  if (loading) return <LinearProgress />;
  if (!job) return <Alert severity="error">Job not found</Alert>;

  const segmentData = [
    { name: 'High', value: results.filter(r => r.segment === 'High').length, color: '#4caf50' },
    { name: 'Medium', value: results.filter(r => r.segment === 'Medium').length, color: '#ff9800' },
    { name: 'Low', value: results.filter(r => r.segment === 'Low').length, color: '#f44336' }
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Job #{jobId} Results</Typography>
        <Button component={Link} to="/chatbot/${jobId}" variant="contained">
          Ask Chatbot
        </Button>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Status</Typography>
              <Typography variant="h5">{job.status}</Typography>
              {job.progressPercent && (
                <LinearProgress variant="determinate" value={job.progressPercent} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Total Records</Typography>
              <Typography variant="h5">{results.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Avg Probability</Typography>
              <Typography variant="h5">
                {(results.reduce((acc, r) => acc + r.probability, 0) / results.length * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Segment Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={segmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                    {segmentData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top 10 Probabilities</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={results.slice(0, 10)}>
                  <XAxis dataKey="recordId" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="probability" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ResultsPage;
