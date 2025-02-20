import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Paper,
  Alert,
  MenuItem
} from '@mui/material';
import {
  Book,
  Add,
  Upload,
  Download,
  Delete,
  Edit
} from '@mui/icons-material';
import Header from '../components/Header';

function Handbooks() {
  const [activeTab, setActiveTab] = useState(0);
  const [handbooks, setHandbooks] = useState(() => {
    const allDocs = JSON.parse(localStorage.getItem('documents') || '[]');
    return allDocs.filter(doc => doc.type === 'handbook');
  });
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  const categories = [
    'All',
    'General',
    'Leave Policies',
    'Benefits',
    'Payroll',
    'Health & Safety'
  ];

  useEffect(() => {
    const handleStorageChange = () => {
      const allDocs = JSON.parse(localStorage.getItem('documents') || '[]');
      setHandbooks(allDocs.filter(doc => doc.type === 'handbook'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getFilteredHandbooks = () => {
    if (activeTab === 0) return handbooks;
    return handbooks.filter(handbook => handbook.category === categories[activeTab]);
  };

  const handleDownload = (handbook) => {
    // Get the full document data from localStorage
    const allDocs = JSON.parse(localStorage.getItem('documents') || '[]');
    const docToDownload = allDocs.find(doc => doc.id === handbook.id);

    if (docToDownload && docToDownload.file) {
      // Convert base64 to blob
      const byteString = atob(docToDownload.file.split(',')[1]);
      const mimeString = docToDownload.file.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = docToDownload.fileName || `${handbook.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setAlert({
        show: true,
        message: 'Download started successfully',
        severity: 'success'
      });
    } else {
      setAlert({
        show: true,
        message: 'No file available for download',
        severity: 'error'
      });
    }
  };

  const handleDelete = (handbook) => {
    // Get all documents from localStorage
    const allDocs = JSON.parse(localStorage.getItem('documents') || '[]');
    
    // Filter out the handbook to delete
    const updatedDocs = allDocs.filter(doc => doc.id !== handbook.id);
    
    // Update localStorage
    localStorage.setItem('documents', JSON.stringify(updatedDocs));
    
    // Update local state
    setHandbooks(updatedDocs.filter(doc => doc.type === 'handbook'));
    
    setAlert({
      show: true,
      message: 'Handbook deleted successfully',
      severity: 'success'
    });
  };

  return (
    <Box>
      <Header />
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Company Handbooks</Typography>
        </Box>

        {alert.show && (
          <Alert 
            severity={alert.severity} 
            sx={{ mb: 2 }}
            onClose={() => setAlert({ ...alert, show: false })}
          >
            {alert.message}
          </Alert>
        )}

        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {categories.map((category) => (
              <Tab key={category} label={category} />
            ))}
          </Tabs>
        </Paper>

        <Grid container spacing={3}>
          {getFilteredHandbooks().map((handbook) => (
            <Grid item xs={12} md={6} key={handbook.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="h6">{handbook.title}</Typography>
                      <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                        {handbook.category}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleDownload(handbook)}
                      >
                        <Download />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDelete(handbook)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography color="textSecondary" gutterBottom>
                    {handbook.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Version: {handbook.version}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Last Updated: {handbook.lastUpdated}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Handbooks; 