import React from 'react';
import { Box, Container, Typography, Divider, List, ListItem } from '@mui/material';

function TermsOfService() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Terms of Service
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          1. Acceptance of Terms
        </Typography>
        <Typography paragraph>
          By accessing and using HR Compliance Hub's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          2. Service Description
        </Typography>
        <Typography paragraph>
          HR Compliance Hub provides HR management, compliance tracking, and business analytics services through our web-based platform. Our services include:
        </Typography>
        <List>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            HR management and documentation tools
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            Compliance tracking and notifications
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            Performance metrics and analytics
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            Employee self-service portal
          </ListItem>
        </List>
        <Typography paragraph sx={{ mt: 2 }}>
          We reserve the right to modify, suspend, or discontinue any part of our services at any time with reasonable notice to our users.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          3. User Accounts and Security
        </Typography>
        <Typography paragraph>
          You are responsible for:
        </Typography>
        <List>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            Maintaining the confidentiality of your account credentials
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            All activities that occur under your account
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            Ensuring that all account users comply with these terms
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            Implementing appropriate security measures
          </ListItem>
        </List>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          4. Subscription and Payments
        </Typography>
        <Typography paragraph>
          4.1. Billing Terms:
        </Typography>
        <List>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            Subscription fees are billed in advance on a monthly or annual basis
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            The lifetime discount rate is guaranteed only for continuous, active subscriptions
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            Payments are non-refundable except as specified in our Refund Policy
          </ListItem>
        </List>
        <Typography paragraph sx={{ mt: 2 }}>
          4.2. Price Changes: We reserve the right to modify our pricing with 30 days notice. Lifetime discount rates will be honored as long as the subscription remains active.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          5. Data Privacy and Security
        </Typography>
        <Typography paragraph>
          5.1. Data Collection and Use:
        </Typography>
        <List>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            We collect and process data in accordance with our Privacy Policy
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            Users must obtain necessary consents for sharing employee data
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            We implement industry-standard security measures
          </ListItem>
        </List>
        <Typography paragraph sx={{ mt: 2 }}>
          5.2. Data Protection: We comply with applicable data protection laws and regulations, including GDPR where applicable.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          6. Intellectual Property
        </Typography>
        <Typography paragraph>
          All content and materials available through our service are protected by intellectual property rights. Users may not copy, modify, distribute, or create derivative works without our explicit permission.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          7. Limitation of Liability
        </Typography>
        <Typography paragraph>
          HR Compliance Hub shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          8. Termination
        </Typography>
        <Typography paragraph>
          We reserve the right to terminate or suspend access to our services immediately, without prior notice or liability, for any reason whatsoever, including breach of Terms.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          9. Governing Law
        </Typography>
        <Typography paragraph>
          These Terms shall be governed by and construed in accordance with the laws of the United States. Any disputes shall be subject to the exclusive jurisdiction of the courts in the state of Delaware.
        </Typography>
      </Box>

      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          Last updated: March 2024
        </Typography>
      </Box>
    </Container>
  );
}

export default TermsOfService; 