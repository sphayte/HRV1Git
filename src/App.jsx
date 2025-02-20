import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';
import { getTheme } from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Compliance from './pages/Compliance';
import Employees from './pages/Employees';
import Handbooks from './pages/Handbooks';
import Payroll from './pages/Payroll';
import FAQ from './pages/FAQ';
import { NotificationProvider } from './contexts/NotificationContext';
import { Box, CircularProgress } from '@mui/material';
import Landing from './pages/Landing';
import Contact from './pages/Contact';
import { AuthProvider } from './contexts/AuthContext';
import { UserDataProvider } from './contexts/UserDataContext';
import RefundPolicy from './pages/RefundPolicy';
import TermsOfService from './pages/TermsOfService';
import AdminDashboard from './pages/AdminDashboard';
import { auth, db } from './config/firebase';
import { ref, get } from 'firebase/database';
import LoadingSpinner from './components/LoadingSpinner';
import AuthGuard from './components/AuthGuard';
import Register from './pages/Register';

// Replace the direct import with lazy loading
const KPITracker = lazy(() => import('./pages/KPITracker'));

function AdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAdmin = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate('/');
        return;
      }
      
      try {
        const userRef = ref(db, `users/${currentUser.uid}/profile`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (userData.role !== 'Admin') {
            navigate('/');
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return children;
}

function AppContent() {
  const { darkMode } = useTheme();
  const theme = getTheme(darkMode);

  // Initialize state from localStorage if available
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [documents, setDocuments] = useState(() => {
    const savedDocs = localStorage.getItem('documents');
    return savedDocs ? JSON.parse(savedDocs) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  // Wrapper functions to ensure state updates are handled consistently
  const handleTasksUpdate = (newTasks) => {
    setTasks(newTasks);
  };

  const handleDocumentsUpdate = (newDocs) => {
    setDocuments(newDocs);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <UserDataProvider>
            <Router>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected routes with Layout */}
                  <Route element={<AuthGuard><Layout /></AuthGuard>}>
                    <Route 
                      path="/dashboard" 
                      element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <Dashboard tasks={tasks} documents={documents} />
                        </Suspense>
                      }
                    />
                    <Route path="/documents" element={<Documents documents={documents} setDocuments={handleDocumentsUpdate} />} />
                    <Route path="/compliance" element={<Compliance tasks={tasks} setTasks={handleTasksUpdate} documents={documents} />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/payroll" element={<Payroll />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route 
                      path="/kpi" 
                      element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <KPITracker />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/admin" 
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      } 
                    />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
          </UserDataProvider>
        </AuthProvider>
      </NotificationProvider>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <React.StrictMode>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App; 