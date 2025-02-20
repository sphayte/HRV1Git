import React from 'react';
import { 
  Box, 
  Drawer,
  AppBar, 
  Toolbar, 
  Typography, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  InputBase,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  Button,
  DialogActions,
  Divider,
  Link,
  Tab,
  Tabs,
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Description,
  Rule,
  Search as SearchIcon,
  Menu as MenuIcon,
  Book as HandbookIcon,
  People as EmployeesIcon,
  AttachMoney as PayrollIcon,
  Help as FAQIcon,
  Brightness4,
  Brightness7,
  Analytics as KPIIcon,
  PersonOutline,
  NotificationsOutlined,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { ref, set, get, push } from "firebase/database";

const drawerWidth = 250;

function Layout() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleAuthModeChange = (event, newValue) => {
    setAuthMode(newValue);
  };

  const initializeUserData = async (userId) => {
    const userRef = ref(db, `users/${userId}`);
    
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      await set(userRef, {
        profile: {
          email: user.email,
          createdAt: new Date().toISOString(),
        },
        data: {
          employees: [
            {
              name: "Example Employee",
              position: "Software Developer",
              department: "Engineering",
              status: "Active"
            }
          ],
          documents: [
            {
              title: "Employee Handbook",
              type: "Policy",
              lastUpdated: new Date().toISOString()
            }
          ],
          compliance: {
            tasks: [
              {
                title: "Annual Safety Training",
                dueDate: "2024-12-31",
                status: "Pending"
              }
            ],
            completedTasks: [],
          },
          payroll: {
            records: [
              {
                period: "March 2024",
                status: "Processed",
                amount: "3000.00"
              }
            ],
            history: [
              {
                date: "2024-03-01",
                type: "Regular Salary",
                amount: "3000.00"
              }
            ]
          },
          kpis: {
            metrics: [
              {
                name: "Employee Satisfaction",
                current: 85,
                target: 90,
                unit: "%"
              },
              {
                name: "Training Completion",
                current: 75,
                target: 100,
                unit: "%"
              }
            ],
            targets: [
              {
                metric: "Revenue Growth",
                target: 15,
                timeframe: "Quarterly"
              }
            ]
          },
          handbooks: [
            {
              title: "Company Policy Manual",
              lastUpdated: "2024-03-01",
              sections: [
                {
                  title: "Code of Conduct",
                  content: "Our company values integrity, respect, and excellence..."
                },
                {
                  title: "Work Hours",
                  content: "Standard work hours are 9 AM to 5 PM..."
                }
              ]
            }
          ],
          notifications: [
            {
              title: "Welcome!",
              message: "Welcome to HR Compliance Hub. Get started by completing your profile.",
              timestamp: new Date().toISOString(),
              read: false
            }
          ],
          dashboardStats: {
            totalEmployees: 1,
            pendingTasks: 3,
            upcomingDeadlines: 2,
            recentActivities: [
              {
                action: "Document Updated",
                date: new Date().toISOString(),
                details: "Employee Handbook was updated"
              }
            ]
          },
          settings: {
            notificationPreferences: {
              email: true,
              inApp: true,
              deadlineReminders: true
            },
            displayPreferences: {
              darkMode: false,
              language: "English"
            }
          },
          content: {
            faq: [
              {
                question: "How do I update employee information?",
                answer: "Navigate to the Employee Hub and click on the employee's profile to make changes."
              },
              {
                question: "Where can I find compliance deadlines?",
                answer: "Check the Compliance section for all upcoming and past deadlines."
              }
            ],
            helpGuides: [
              {
                title: "Getting Started",
                content: "Welcome to HR Compliance Hub! This guide will help you navigate the platform..."
              },
              {
                title: "Managing Documents",
                content: "Learn how to upload, organize, and share important HR documents..."
              }
            ]
          }
        }
      });
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      
      await initializeUserData(userCredential.user.uid);
      
      const notificationsRef = ref(db, `users/${userCredential.user.uid}/data/notifications`);
      const notificationsSnapshot = await get(notificationsRef);
      if (notificationsSnapshot.exists()) {
        setNotifications(Object.values(notificationsSnapshot.val()));
      }

      setLoginOpen(false);
      handleProfileClose();
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      
      await initializeUserData(userCredential.user.uid);

      setLoginOpen(false);
      handleProfileClose();
      alert('Account created successfully!');
    } catch (error) {
      console.error('Sign up error:', error);
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      handleProfileClose();
    } catch (error) {
      console.error('Logout error:', error);
      alert(error.message);
    }
  };

  const saveNotification = async (notification) => {
    if (user) {
      const notificationsRef = ref(db, `users/${user.uid}/data/notifications`);
      const newNotificationRef = push(notificationsRef);
      await set(newNotificationRef, {
        ...notification,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleClearNotifications = async () => {
    if (user) {
      try {
        // Clear notifications in database
        const notificationsRef = ref(db, `users/${user.uid}/data/notifications`);
        await set(notificationsRef, []);
        // Clear notifications in state
        setNotifications([]);
        handleNotificationClose();
      } catch (error) {
        console.error('Error clearing notifications:', error);
        alert('Failed to clear notifications');
      }
    }
  };

  const checkAdminStatus = async (userId) => {
    try {
      const userRef = ref(db, `users/${userId}/profile`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setIsAdmin(userData.role === 'Admin');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        await checkAdminStatus(user.uid);
        const notificationsRef = ref(db, `users/${user.uid}/data/notifications`);
        const notificationsSnapshot = await get(notificationsRef);
        if (notificationsSnapshot.exists()) {
          setNotifications(Object.values(notificationsSnapshot.val()));
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setNotifications([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Compliance', icon: <Rule />, path: '/compliance' },
    { text: 'Employee Hub', icon: <EmployeesIcon />, path: '/employees' },
    { text: 'Payroll', icon: <PayrollIcon />, path: '/payroll' },
    { text: 'KPI Tracker', icon: <KPIIcon />, path: '/kpi' },
    { text: 'FAQ', icon: <FAQIcon />, path: '/faq' },
    { text: 'Admin', icon: <AdminPanelSettings />, path: '/admin', adminOnly: true },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly) {
      return isAdmin;
    }
    return true;
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          minHeight: '64px',
          px: 2
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            ml: 0
          }}>
            <IconButton 
              edge="start" 
              sx={{ 
                display: { sm: 'none' }, 
                mr: 2 
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              noWrap 
              component="div"
              sx={{ 
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '1.2rem',
                ml: 0
              }}
            >
              HR Compliance Hub
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'background.default',
              borderRadius: 2,
              px: 2,
              width: 300,
              height: '40px'
            }}>
              <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              <InputBase
                placeholder="Search tasks and documents..."
                sx={{ 
                  flex: 1,
                  color: 'text.primary',
                }}
                onChange={(e) => {
                  window.dispatchEvent(new CustomEvent('search', {
                    detail: e.target.value
                  }));
                }}
              />
            </Box>
            <IconButton 
              onClick={toggleDarkMode} 
              sx={{
                color: 'text.primary',
                bgcolor: 'background.default',
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            <IconButton
              onClick={handleNotificationClick}
              sx={{
                color: 'text.primary',
                bgcolor: 'background.default',
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsOutlined />
              </Badge>
            </IconButton>

            <IconButton
              onClick={handleProfileClick}
              sx={{
                color: 'text.primary',
                bgcolor: 'background.default',
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <PersonOutline />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {user ? (
                <>
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem 
                    onClick={() => {
                      handleProfileClose();
                      setAuthMode('login');
                      setLoginOpen(true);
                    }}
                  >
                    Login
                  </MenuItem>
                  <MenuItem 
                    onClick={() => {
                      handleProfileClose();
                      setAuthMode('signup');
                      setLoginOpen(true);
                    }}
                  >
                    Sign Up
                  </MenuItem>
                </>
              )}
            </Menu>

            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                px: 2,
                py: 1
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Notifications
                </Typography>
                {notifications.length > 0 && (
                  <Button 
                    size="small" 
                    onClick={handleClearNotifications}
                    sx={{ 
                      textTransform: 'none',
                      fontSize: '0.875rem'
                    }}
                  >
                    Clear All
                  </Button>
                )}
              </Box>
              <Divider />
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <MenuItem 
                    key={index}
                    onClick={handleNotificationClose}
                    sx={{ 
                      minWidth: '300px',
                      whiteSpace: 'normal'
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2">
                        {notification.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <MenuItem onClick={handleNotificationClose}>
                  <Typography variant="body2" color="text.secondary">
                    No new notifications
                  </Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            bgcolor: 'background.paper',
            px: 2,
            mt: '64px',
          },
        }}
      >
        <Box sx={{ overflow: 'auto', py: 2 }}>
          <List>
            {filteredMenuItems.map((item) => (
              <ListItem 
                button 
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  height: '40px',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                      color: 'white',
                    },
                  },
                  ...(window.location.pathname === item.path && {
                    bgcolor: 'primary.main',
                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                      color: 'white',
                    },
                  })
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: window.location.pathname === item.path ? 'white' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>

      <Dialog 
        open={loginOpen} 
        onClose={() => setLoginOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Tabs 
            value={authMode} 
            onChange={handleAuthModeChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
              }
            }}
          >
            <Tab label="Login" value="login" />
            <Tab label="Sign Up" value="signup" />
          </Tabs>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box 
            component="form" 
            onSubmit={authMode === 'login' ? handleLogin : handleSignUp}
            id="auth-form"
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2 
            }}
          >
            <TextField
              autoFocus
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              required
              variant="outlined"
              size="medium"
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              required
              variant="outlined"
              size="medium"
            />
            {authMode === 'signup' && (
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                required
                variant="outlined"
                size="medium"
              />
            )}
          </Box>
          {authMode === 'login' && (
            <Link
              component="button"
              variant="body2"
              onClick={(e) => {
                e.preventDefault();
                alert('Forgot password functionality coming soon!');
              }}
              sx={{ 
                mt: 1,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Forgot password?
            </Link>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button 
            onClick={() => setLoginOpen(false)}
            sx={{ 
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            form="auth-form"
            variant="contained" 
            sx={{
              px: 4,
              py: 1,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {authMode === 'login' ? 'Login' : 'Create Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Layout; 