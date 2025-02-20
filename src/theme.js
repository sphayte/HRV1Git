import { createTheme } from '@mui/material/styles';

export const getTheme = (darkMode) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: '#4F46E5', // Modern indigo
      light: '#818CF8',
      dark: '#3730A3',
    },
    secondary: {
      main: '#10B981', // Fresh green
      light: '#34D399',
      dark: '#059669',
    },
    background: {
      default: darkMode ? '#121212' : '#F5F7FA',
      paper: darkMode ? '#1E1E1E' : '#FFFFFF',
    },
    text: {
      primary: darkMode ? '#FFFFFF' : '#000000',
      secondary: darkMode ? '#B0B0B0' : '#666666',
    },
    error: {
      main: '#EF4444',
    },
    warning: {
      main: '#F59E0B',
    },
    success: {
      main: '#10B981',
    },
    divider: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: darkMode 
            ? '0 1px 3px rgba(0,0,0,0.5)'
            : '0 1px 3px rgba(0,0,0,0.12)',
          '&:hover': {
            boxShadow: darkMode
              ? '0 4px 6px -1px rgba(0,0,0,0.6)'
              : '0 4px 6px -1px rgba(0,0,0,0.1)',
          },
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.12)' : '#f0f0f0'}`,
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: darkMode ? '#1A1A1A' : '#F8FAFC',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
  },
}); 