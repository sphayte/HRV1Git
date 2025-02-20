import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import { 
  CloudUpload, 
  Download, 
  Delete, 
  Warning,
  CheckCircle,
  Close,
  Add
} from '@mui/icons-material';
import Header from '../components/Header';

function Documents() {
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: '',
    expiryDate: '',
    file: null
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const fileInputRef = useRef();
  const [activeTab, setActiveTab] = useState('active');
  const [openDialog, setOpenDialog] = useState(false);
  const [documentType, setDocumentType] = useState(''); // 'handbook' or other types
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  const categories = [
    'All',
    'General',
    'Leave Policies',
    'Benefits',
    'Payroll',
    'Health & Safety'
  ];

  const documentTypes = [
    { value: 'handbook', label: 'Handbook' },
    { value: 'policy', label: 'Policy Document' },
    { value: 'form', label: 'Form' },
    { value: 'contract', label: 'Contract' }
  ];

  useEffect(() => {
    if (localStorage.getItem('documents') === null) {
      localStorage.setItem('documents', JSON.stringify([
        { 
          id: 1, 
          name: 'Employee Contract Template.pdf', 
          type: 'Contract',
          uploadDate: '2024-02-05',
          expiryDate: '2024-12-31',
          status: 'Active',
          size: '250 KB',
          file: null
        },
        { 
          id: 2, 
          name: 'Health & Safety Policy.pdf', 
          type: 'Policy',
          uploadDate: '2024-01-15',
          expiryDate: '2024-12-31',
          status: 'Active',
          size: '1.2 MB',
          file: null
        }
      ]));
    }
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewDocument({
        ...newDocument,
        name: file.name,
        file: file,
        size: formatFileSize(file.size)
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = () => {
    if (newDocument.file && newDocument.type && newDocument.expiryDate) {
      const newDoc = {
        id: localStorage.getItem('documents') ? JSON.parse(localStorage.getItem('documents')).length + 1 : 1,
        name: newDocument.name,
        type: newDocument.type,
        uploadDate: new Date().toISOString().split('T')[0],
        expiryDate: newDocument.expiryDate,
        status: 'Active',
        size: newDocument.size,
        file: newDocument.file // In a real app, you'd upload this to a server
      };

      localStorage.setItem('documents', JSON.stringify([...JSON.parse(localStorage.getItem('documents') || '[]'), newDoc]));
      setOpenUploadDialog(false);
      setNewDocument({ name: '', type: '', expiryDate: '', file: null });
      setSnackbar({
        open: true,
        message: 'Document uploaded successfully!',
        severity: 'success'
      });
    }
  };

  const handleDownload = (document) => {
    // In a real app, you'd download from your server
    // For now, we'll just show a success message
    setSnackbar({
      open: true,
      message: `Downloading ${document.name}...`,
      severity: 'info'
    });
  };

  const handleDelete = (id) => {
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    localStorage.setItem('documents', JSON.stringify(documents.filter(doc => doc.id !== id)));
    setSnackbar({
      open: true,
      message: 'Document deleted successfully',
      severity: 'success'
    });
  };

  const handleStatusChange = (docId, newStatus) => {
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    localStorage.setItem('documents', JSON.stringify(documents.map(doc => {
      if (doc.id === docId) {
        return { ...doc, status: newStatus };
      }
      return doc;
    })));
  };

  const getStatusChip = (status) => {
    switch(status) {
      case 'Active':
        return <Chip label={status} color="success" size="small" icon={<CheckCircle />} />;
      case 'Expiring Soon':
        return <Chip label={status} color="warning" size="small" icon={<Warning />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getFilteredDocuments = () => {
    return JSON.parse(localStorage.getItem('documents') || '[]').filter(doc => 
      activeTab === 'active' 
        ? doc.status !== 'Archived' 
        : doc.status === 'Archived'
    );
  };

  const handleAddDocument = (type) => {
    setDocumentType(type);
    setNewDocument({ ...newDocument, type });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewDocument({
      title: '',
      description: '',
      version: '',
      file: null,
      category: 'General',
      type: ''
    });
  };

  const handleSubmit = () => {
    if (!newDocument.title || !newDocument.description || !newDocument.version || !newDocument.category) {
      setAlert({
        show: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    if (documentType === 'handbook' && !newDocument.file) {
      setAlert({
        show: true,
        message: 'Please upload a PDF file for the handbook',
        severity: 'error'
      });
      return;
    }

    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    
    // Convert file to base64 if it exists
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const newDocEntry = {
        id: documents.length + 1,
        title: newDocument.title,
        description: newDocument.description,
        version: newDocument.version,
        category: newDocument.category,
        type: newDocument.type,
        lastUpdated: new Date().toISOString().split('T')[0],
        file: e.target.result, // Store file as base64
        fileName: newDocument.file.name
      };

      localStorage.setItem('documents', JSON.stringify([...documents, newDocEntry]));

      setAlert({
        show: true,
        message: `${newDocument.type === 'handbook' ? 'Handbook' : 'Document'} added successfully`,
        severity: 'success'
      });
      handleCloseDialog();
    };

    if (newDocument.file) {
      fileReader.readAsDataURL(newDocument.file);
    } else {
      const newDocEntry = {
        id: documents.length + 1,
        title: newDocument.title,
        description: newDocument.description,
        version: newDocument.version,
        category: newDocument.category,
        type: newDocument.type,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      localStorage.setItem('documents', JSON.stringify([...documents, newDocEntry]));
      handleCloseDialog();
    }
  };

  return (
    <Box>
      <Header />
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Document Management</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleAddDocument('handbook')}
            >
              Add Handbook
            </Button>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => handleAddDocument('document')}
            >
              Add Document
            </Button>
          </Box>
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

        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Add New {documentType === 'handbook' ? 'Handbook' : 'Document'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {documentType !== 'handbook' && (
                <TextField
                  select
                  label="Document Type"
                  value={newDocument.type}
                  onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
                  fullWidth
                  required
                >
                  {documentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              
              <TextField
                label="Title"
                value={newDocument.title}
                onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Description"
                value={newDocument.description}
                onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                multiline
                rows={3}
                fullWidth
                required
              />
              {documentType === 'handbook' && (
                <TextField
                  select
                  label="Category"
                  value={newDocument.category}
                  onChange={(e) => setNewDocument({ ...newDocument, category: e.target.value })}
                  fullWidth
                  required
                >
                  {categories.slice(1).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              <TextField
                label="Version"
                value={newDocument.version}
                onChange={(e) => setNewDocument({ ...newDocument, version: e.target.value })}
                fullWidth
                required
              />
              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                Upload {documentType === 'handbook' ? 'Handbook' : 'Document'} PDF
                <input
                  type="file"
                  hidden
                  accept=".pdf"
                  onChange={(e) => setNewDocument({ ...newDocument, file: e.target.files[0] })}
                />
              </Button>
              {newDocument.file && (
                <Typography variant="body2" color="textSecondary">
                  Selected file: {newDocument.file.name}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              Add {documentType === 'handbook' ? 'Handbook' : 'Document'}
            </Button>
          </DialogActions>
        </Dialog>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Documents
                </Typography>
                <Typography variant="h4">
                  {localStorage.getItem('documents') ? JSON.parse(localStorage.getItem('documents')).length : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Expiring Soon
                </Typography>
                <Typography variant="h4">
                  {localStorage.getItem('documents') ? JSON.parse(localStorage.getItem('documents')).filter(doc => doc.status === 'Expiring Soon').length : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Storage Used
                </Typography>
                <Typography variant="h4">
                  2.1 GB
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          mb: 3 
        }}>
          <Button
            variant={activeTab === 'active' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('active')}
            size="small"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3
            }}
          >
            Active Documents ({localStorage.getItem('documents') ? JSON.parse(localStorage.getItem('documents')).filter(d => d.status !== 'Archived').length : 0})
          </Button>
          <Button
            variant={activeTab === 'archived' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('archived')}
            size="small"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3
            }}
          >
            Archived Documents ({localStorage.getItem('documents') ? JSON.parse(localStorage.getItem('documents')).filter(d => d.status === 'Archived').length : 0})
          </Button>
        </Box>

        <TableContainer 
          component={Paper}
          sx={{
            opacity: activeTab === 'archived' ? 0.9 : 1
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Document Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredDocuments().map((doc) => (
                <TableRow 
                  key={doc.id}
                  sx={{
                    bgcolor: doc.status === 'Archived' ? 'grey.50' : 'inherit'
                  }}
                >
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>{doc.uploadDate}</TableCell>
                  <TableCell>{doc.expiryDate}</TableCell>
                  <TableCell>
                    <Select
                      value={doc.status}
                      onChange={(e) => handleStatusChange(doc.id, e.target.value)}
                      size="small"
                      sx={{ height: 32 }}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Expiring Soon">Expiring Soon</MenuItem>
                      <MenuItem value="Expired">Expired</MenuItem>
                      <MenuItem value="Archived">Archived</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {getFilteredDocuments().length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                      {activeTab === 'active' 
                        ? 'No active documents found' 
                        : 'No archived documents found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog 
          open={openUploadDialog} 
          onClose={() => setOpenUploadDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Upload New Document</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                sx={{ textTransform: 'none' }}
              >
                Choose File
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
              </Button>
              {newDocument.file && (
                <Typography variant="body2" color="textSecondary">
                  Selected: {newDocument.name} ({newDocument.size})
                </Typography>
              )}
              <TextField
                label="Document Type"
                fullWidth
                value={newDocument.type}
                onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
              />
              <TextField
                label="Expiry Date"
                type="date"
                fullWidth
                value={newDocument.expiryDate}
                onChange={(e) => setNewDocument({ ...newDocument, expiryDate: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => setOpenUploadDialog(false)}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!newDocument.file || !newDocument.type || !newDocument.expiryDate}
              sx={{ textTransform: 'none' }}
            >
              Upload
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default Documents; 