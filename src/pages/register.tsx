import { useState } from 'react'
import { Container, Typography, Box, Button } from '@mui/material'
import ContactForm from '../components/ContactForm'

export default function Register() {
  const [contactFormOpen, setContactFormOpen] = useState(false)

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault()
    setContactFormOpen(true)
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 4,
        }}
      >
        <Box>
          <Typography variant="h2" component="h1" gutterBottom>
            Get Started with HR Compliance Hub
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Fill out the form below to begin your compliance journey
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
            >
              Contact Us
            </Button>
          </Box>
        </Box>
      </Box>

      <ContactForm 
        open={contactFormOpen} 
        onClose={() => setContactFormOpen(false)} 
      />
    </Container>
  )
} 