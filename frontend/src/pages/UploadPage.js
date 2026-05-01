import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadDataset } from '../services/api';
import { Box, Button, LinearProgress, Alert, Typography, Paper } from '@mui/material';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadDataset(file);
       const id = Number(res.data.jobId);
       if (!isNaN(id)) setJobId(id);
    } catch (err) {
      setError('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper style={{ padding: 30, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>Upload Dataset</Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Upload CSV file (10K - 1M rows supported)
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: 10 }}
        />

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload & Start Prediction'}
        </Button>

        {uploading && <LinearProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {jobId && (
          <Alert severity="success">
            Job #{jobId} created!{' '}
            <Button size="small" onClick={() => navigate(`/results/${jobId}`)}>
              View Results
            </Button>
          </Alert>
        )}
      </Box>
    </Paper>
  );
}

export default UploadPage;
