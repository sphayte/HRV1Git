import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Snackbar,
  Alert,
  Dialog,
  IconButton,
  Slide,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Tooltip,
} from '@mui/material';
import {
  Check,
  Star,
  Rocket,
  Business,
  Security,
  Speed,
  CloudDone,
  Analytics,
  People,
  Close,
  AttachMoney
} from '@mui/icons-material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Landing() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showPromo, setShowPromo] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formStatus, setFormStatus] = useState({ show: false, message: '', severity: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');

  // Check URL parameters for login prompt
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('login') === 'true') {
      setLoginOpen(true);
    }
  }, [location]);

  const features = [
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Compliance Management',
      description: 'Stay compliant with automated tracking and notifications'
    },
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: 'Employee Management',
      description: 'Streamline HR operations and employee documentation'
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Performance Metrics',
      description: 'Track leads, revenue, projects, and expenses in real-time'
    }
  ];

  const plans = [
    {
      title: 'Starter',
      price: 99,
      employees: 10,
      features: [
        'Employee Management',
        'Basic Compliance Tools',
        'Document Storage',
        'Leave Management',
        'Basic Reports',
        'Email Support'
      ],
      color: theme.palette.primary.main
    },
    {
      title: 'Business',
      price: 299,
      employees: 25,
      features: [
        'Everything in Starter',
        'Advanced Compliance Tools',
        'Custom Reports',
        'Performance Tracking',
        'Priority Support',
        'API Access'
      ],
      color: theme.palette.secondary.main,
      popular: true
    },
    {
      title: 'Professional',
      price: 599,
      employees: 50,
      features: [
        'Everything in Business',
        'Advanced Analytics',
        'Custom Workflows',
        'Dedicated Support',
        'SLA Guarantee',
        'Advanced Security'
      ],
      color: '#6366F1'
    },
    {
      title: 'Enterprise',
      price: 'Custom',
      employees: 'Unlimited',
      features: [
        'Everything in Professional',
        'Unlimited Users',
        'Custom Implementation',
        'Dedicated Success Manager',
        'Custom Integrations',
        'On-Premise Option',
        '24/7 Support'
      ],
      color: '#818CF8',
      enterprise: true
    }
  ];

  const handleScrollToPricing = () => {
    setShowPromo(false);
    document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = (planTitle) => {
    setSelectedPlan(planTitle);
    setOpenForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    formData.append('targets', selectedTargets.join(', '));
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');

    setIsSubmitting(true);
    setFormStatus({
      show: true,
      message: 'Submitting your request...',
      severity: 'info'
    });

    fetch('https://formsubmit.co/ajax/dashhrsuite@gmail.com', {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      setFormStatus({
        show: true,
        message: 'Thank you for your submission! We\'ll be in touch soon.',
        severity: 'success'
      });
      setOpenForm(false);
      setSelectedTargets([]);
    })
    .catch(error => {
      setFormStatus({
        show: true,
        message: 'There was an error submitting the form. Please try again.',
        severity: 'error'
      });
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleDashboardClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setLoginOpen(true);
    }
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    setAuthError('');
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        setLoginOpen(false);
        navigate('/dashboard');
      } else {
        const confirmPassword = formData.get('confirmPassword');
        if (password !== confirmPassword) {
          setAuthError("Passwords don't match!");
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        setLoginOpen(false);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError(error.message);
    }
  };

  const renderForm = () => {
    const defaultTargets = [
      'Revenue Goals',
      'Lead Generation',
      'Employee Performance',
      'Project Milestones',
      'Cost Reduction',
      'Customer Satisfaction',
      'Sales Targets',
      'Compliance Goals'
    ];

    return (
      <Dialog
        open={openForm}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Get Started with {selectedPlan}
          <IconButton
            aria-label="close"
            onClick={() => setOpenForm(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  label="First Name"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lastName"
                  label="Last Name"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Business Email"
                  type="email"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="company"
                  label="Company Name"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="phone"
                  label="Phone Number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="message"
                  label="Additional Information"
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ minWidth: 120 }}
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Box>
      <Dialog
        fullScreen
        open={showPromo}
        TransitionComponent={Transition}
        sx={{
          '& .MuiDialog-paper': {
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }
        }}
      >
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          p: 3,
          textAlign: 'center'
        }}>
          <IconButton
            onClick={() => setShowPromo(false)}
            sx={{ 
              position: 'absolute',
              right: 16,
              top: 16,
              color: 'white'
            }}
          >
            <Close />
          </IconButton>
          
          <Typography variant="h2" sx={{ mb: 3, fontWeight: 700 }}>
            🚀 Lifetime Discount Offer
          </Typography>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Lock In 60% Off Forever
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, maxWidth: 600 }}>
            Subscribe now and keep this special rate for life. 
            No price increases, ever. This is not a limited-time trial.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            mt: 4 
          }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleDashboardClick}
              sx={{ 
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              {user ? 'Go to Dashboard' : 'Sign In'}
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={handleScrollToPricing}
              sx={{ 
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              View Pricing
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/contact')}
              sx={{ 
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Contact Sales
            </Button>
          </Box>
          <Typography variant="body1" sx={{ mt: 4, opacity: 0.9 }}>
            One-time opportunity. Subscribe now and never pay full price.
          </Typography>
        </Box>
      </Dialog>

      <Box 
        sx={{ 
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          py: 15,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
            HR Compliance Hub
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            All-in-one platform for HR management, compliance tracking, and business analytics
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            mt: 4 
          }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleDashboardClick}
              sx={{ 
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              {user ? 'Go to Dashboard' : 'Sign In'}
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={handleScrollToPricing}
              sx={{ 
                borderColor: 'white',
                color: 'white',
                px: 4,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              View Pricing
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/contact')}
              sx={{ 
                borderColor: 'white',
                color: 'white',
                px: 4,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Contact Sales
            </Button>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 10 }}>
        <Typography variant="h3" align="center" sx={{ mb: 6 }}>
          Everything You Need
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  },
                  transition: 'all 0.3s'
                }}
              >
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box 
        sx={{ 
          bgcolor: 'error.main',
          color: 'white',
          py: 2,
          textAlign: 'center',
          mb: 4
        }}
      >
        <Container>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            🚀 2025 Forever Discount: Lock In 60% Off For Life
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Subscribe now and keep this special rate forever. No future price increases.
          </Typography>
        </Container>
      </Box>

      <Box 
        id="pricing-section"
        sx={{ 
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50', 
          py: 10,
          scrollMarginTop: '64px'
        }}
      >
        <Container>
          <Typography variant="h3" align="center" sx={{ mb: 6 }}>
            Simple, Transparent Pricing
          </Typography>
          <Grid container spacing={4} alignItems="stretch">
            {plans.map((plan, index) => (
              <Grid item xs={12} md={3} key={index} sx={{ display: 'flex' }}>
                <Card 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    position: 'relative',
                    overflow: 'visible',
                    bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'background.paper',
                    ...(plan.popular && {
                      transform: 'scale(1.05)',
                      border: `2px solid ${plan.color}`,
                    })
                  }}
                >
                  {plan.popular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -12,
                        right: 20,
                        bgcolor: plan.color,
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      Most Popular
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                    <Typography variant="h5" gutterBottom>
                      {plan.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                      {!plan.enterprise ? (
                        <Box>
                          <Typography 
                            variant="body1" 
                            component="span" 
                            sx={{ 
                              textDecoration: 'line-through',
                              color: 'text.secondary',
                              mr: 1
                            }}
                          >
                            ${plan.price * 2.5}
                          </Typography>
                          <Typography variant="h3" component="span" sx={{ color: 'error.main' }}>
                            ${plan.price}
                          </Typography>
                          <Typography 
                            variant="subtitle1" 
                            component="span" 
                            sx={{ 
                              ml: 1,
                              color: theme.palette.mode === 'dark' ? 'grey.400' : 'grey.600'
                            }}
                          >
                            /month
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="h4" sx={{ color: plan.color }}>
                          Contact Sales
                        </Typography>
                      )}
                    </Box>
                    {!plan.enterprise && (
                      <Typography 
                        sx={{ 
                          color: 'error.main',
                          fontWeight: 600,
                          mb: 1
                        }}
                      >
                        Save 60% Forever - Lifetime Guaranteed Rate!
                      </Typography>
                    )}
                    <Typography 
                      color="text.secondary" 
                      gutterBottom
                      sx={{ 
                        color: theme.palette.mode === 'dark' ? 'grey.400' : 'text.secondary'
                      }}
                    >
                      {plan.enterprise ? 'Scalable Pricing' : `Up to ${plan.employees} employees`}
                    </Typography>
                    <Divider sx={{ 
                      my: 2,
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'
                    }} />
                    <List>
                      {plan.features.map((feature, idx) => (
                        <ListItem key={idx} sx={{ py: 1 }}>
                          <ListItemIcon>
                            <Check sx={{ color: plan.color }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature} 
                            sx={{ 
                              '& .MuiListItemText-primary': {
                                color: theme.palette.mode === 'dark' ? 'grey.300' : 'text.primary'
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <CardActions sx={{ p: 3 }}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      onClick={() => handleGetStarted(plan.title)}
                      sx={{ 
                        bgcolor: plan.color,
                        '&:hover': {
                          bgcolor: plan.color,
                          opacity: 0.9
                        }
                      }}
                    >
                      Get Started
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {renderForm()}
      
      <Snackbar 
        open={formStatus.show} 
        autoHideDuration={6000} 
        onClose={() => setFormStatus({ ...formStatus, show: false })}
      >
        <Alert 
          onClose={() => setFormStatus({ ...formStatus, show: false })} 
          severity={formStatus.severity}
        >
          {formStatus.message}
        </Alert>
      </Snackbar>

      <Box 
        component="footer" 
        sx={{ 
          py: 4, 
          mt: 8,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: 4,
            color: 'text.secondary'
          }}>
            <Link 
              to="/terms-of-service"
              style={{ 
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <Typography 
                sx={{ 
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Terms of Service
              </Typography>
            </Link>
            <Link 
              to="/refund-policy"
              style={{ 
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <Typography 
                sx={{ 
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Refund Policy
              </Typography>
            </Link>
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center" 
            sx={{ mt: 2 }}
          >
            © {new Date().getFullYear()} HR Compliance Hub. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Login Dialog */}
      <Dialog 
        open={loginOpen} 
        onClose={() => {
          setLoginOpen(false);
          setAuthError('');
          const params = new URLSearchParams(location.search);
          params.delete('login');
          navigate({ search: params.toString() });
        }}
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {authMode === 'login' ? 'Sign In' : 'Create Account'}
          <IconButton
            aria-label="close"
            onClick={() => setLoginOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box 
            component="form" 
            onSubmit={handleAuth}
            sx={{ 
              mt: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <TextField
              name="email"
              label="Email Address"
              type="email"
              required
              fullWidth
              autoFocus
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              required
              fullWidth
            />
            {authMode === 'signup' && (
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                required
                fullWidth
              />
            )}
            {authError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {authError}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
            >
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </Box>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              sx={{ textTransform: 'none' }}
            >
              {authMode === 'login' 
                ? "Don't have an account? Sign Up" 
                : 'Already have an account? Sign In'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Landing; 