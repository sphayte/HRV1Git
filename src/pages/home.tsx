import { useNavigate } from 'react-router-dom'
import { Container, Typography, Box, Button } from '@mui/material'

export default function Home() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        mt: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Welcome to HR Compliance
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph align="center">
          Your complete HR compliance solution
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/contact')}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  )
} 