import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct email body
    const emailBody = `
Name: ${formData.name}
Company: ${formData.company}
Email: ${formData.email}

Message:
${formData.message}
    `;

    // Create mailto link with pre-filled content
    const mailtoLink = `mailto:your.email@gmail.com?subject=HR Compliance Hub Inquiry&body=${encodeURIComponent(emailBody)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    // Show success message
    setShowAlert(true);
  };

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Typography variant="h3" align="center" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Get in touch with our sales team for a personalized demo
        </Typography>

        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 0 } }}>
              <Email sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Email
              </Typography>
              <Typography color="text.secondary">
                sales@hrcompliancehub.com
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 0 } }}>
              <Phone sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Phone
              </Typography>
              <Typography color="text.secondary">
                +1 (555) 123-4567
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <LocationOn sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Office
              </Typography>
              <Typography color="text.secondary">
                123 Business Ave,<br />
                San Francisco, CA 94107
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Paper 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ 
            mt: 6, 
            p: 4,
            bgcolor: 'background.paper'
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                Send Message
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Snackbar
          open={showAlert}
          autoHideDuration={6000}
          onClose={() => setShowAlert(false)}
        >
          <Alert 
            onClose={() => setShowAlert(false)} 
            severity="success"
            sx={{ width: '100%' }}
          >
            Opening your email client...
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default Contact; 