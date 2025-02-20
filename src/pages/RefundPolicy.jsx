import React from 'react';
import { Box, Container, Typography, Divider, List, ListItem } from '@mui/material';

function RefundPolicy() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Refund Policy
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          No-Refund Policy
        </Typography>
        <Typography paragraph>
          Due to the nature of our digital services and the immediate access to our platform's features, HR Compliance Hub operates on a strict no-refund policy. All purchases and subscription payments are final and non-refundable.
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Subscription Cancellation
        </Typography>
        <Typography paragraph>
          While we do not offer refunds, you may cancel your subscription at any time. Upon cancellation:
        </Typography>
        <List>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            Your access will continue until the end of your current billing period
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            No further charges will be made to your payment method
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            You will lose access to the platform when your current billing period ends
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            Any lifetime discount rates will be forfeited upon cancellation
          </ListItem>
        </List>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Enterprise Agreements
        </Typography>
        <Typography paragraph>
          For Enterprise customers, refund and cancellation terms are governed by your specific service agreement. Please refer to your contract or contact your account manager for details.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Billing Errors
        </Typography>
        <Typography paragraph>
          In the rare case of duplicate charges or billing errors, please contact our support team within 5 business days of the error. We will investigate and resolve any confirmed billing errors promptly.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Contact Information
        </Typography>
        <Typography paragraph>
          For any questions about our refund policy or to discuss billing concerns, please contact our support team at:
        </Typography>
        <List>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            Email: support@hrcompliance.hub
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc', ml: 4 }}>
            Response Time: Within 2 business days
          </ListItem>
        </List>
      </Box>

      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          Last updated: March 2024
        </Typography>
      </Box>
    </Container>
  );
}

export default RefundPolicy; 