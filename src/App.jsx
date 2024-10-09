import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import './App.css'; // Custom CSS for styling

const App = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [jsonInput, setJsonInput] = useState('{}');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState('html');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  const fetchJson = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Invalid API endpoint');
      const data = await response.json();
      setJsonInput(JSON.stringify(data, null, 2));
      setError('');
    } catch (err) {
      setError('Error fetching data: ' + err.message);
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  const renderJson = () => {
    setLoading(true);
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (format === 'html') {
        setOutput(<pre>{JSON.stringify(parsedJson, null, 2)}</pre>);
      } else if (format === 'markdown') {
        setOutput(<ReactMarkdown>{JSON.stringify(parsedJson, null, 2)}</ReactMarkdown>);
      }
      setError('');
    } catch (err) {
      setError('Invalid JSON format');
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <Box className="app-container" p={4}>
      <Typography variant="h4" gutterBottom align="center" className="app-title">
         JSON Fetcher & Renderer
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="API Endpoint"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            variant="outlined"
            helperText="Enter a valid API URL and click GET"
            className="input-field"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchJson}
            fullWidth
            className="fetch-button"
            disabled={loading}
            size="medium"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'GET JSON'}
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Box mt={2}>
          <Typography color="error" className="error-message">{error}</Typography>
        </Box>
      )}

      <Grid container spacing={4} mt={3}>
        {/* JSON Editor Section */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={6} className="editor-container">
            <Typography variant="h6" gutterBottom>
              JSON Editor
            </Typography>
            <TextField
              // label="Edit JSON Data"
              value={jsonInput}
              onChange={handleJsonChange}
              multiline
              rows={13}
              variant="outlined"
              fullWidth
              size="medium"
              className="json-editor"
            />
          </Paper>
        </Grid>

        {/* Rendered Output Section */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={6} className="output-container">
            <Typography variant="h6" gutterBottom>
              Rendered Output
            </Typography>
            <FormControl fullWidth className="select-format">
              <Select value={format} onChange={(e) => setFormat(e.target.value)} size="medium">
                <MenuItem value="html">HTML</MenuItem>
                <MenuItem value="markdown">Markdown</MenuItem>
              </Select>
            </FormControl>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={renderJson}
                fullWidth
                className="render-button"
                disabled={loading}
                size="medium"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Render Data'}
              </Button>
            </Box>
            <Box mt={2} className="output-section">
              <div className="output-content">{output}</div>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Toast Notification for Errors */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleToastClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
