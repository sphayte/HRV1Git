import { Box, CircularProgress } from '@mui/material';

function LoadingSpinner() {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      bgcolor: 'background.default',
      zIndex: 9999
    }}>
      <CircularProgress size={60} />
    </Box>
  );
}

export default LoadingSpinner; 