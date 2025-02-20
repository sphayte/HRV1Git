import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, LinearProgress, Button } from '@mui/material';
import { Assignment, Warning, CheckCircle, Timeline, TrendingUp, TrendingDown } from '@mui/icons-material';
import { useNotifications } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useUserData } from '../contexts/UserDataContext';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const { getData } = useUserData();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    tasks: [],
    kpis: null
  });

  // Load user data from Firebase
  useEffect(() => {
    const loadDashboardData = async () => {
      if (user) {
        try {
          // Load tasks
          const tasks = await getData('compliance/tasks');
          // Load KPI data
          const kpiData = await getData('kpis/dashboard');
          
          setDashboardData({
            tasks: tasks || [],
            kpis: kpiData
          });
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        }
      }
    };
    loadDashboardData();
  }, [user, getData]);

  // Calculate statistics from actual data
  const calculateStats = () => {
    const tasks = dashboardData.tasks;
    
    if (!tasks || tasks.length === 0) {
      return {
        completed: 0,
        completionRate: 0,
        overdue: 0,
        upcoming: 0,
        active: 0,
        complianceScore: 0
      };
    }

    const today = new Date();
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);

    // Tasks completed
    const completedTasks = tasks.filter(task => task.status === 'Completed');
    const completionRate = Math.round((completedTasks.length / tasks.length) * 100) || 0;

    // Overdue tasks - only count non-completed tasks
    const overdueTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < today && task.status !== 'Completed';
    });

    // Upcoming tasks - only count non-completed tasks due within a week
    const upcomingTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate <= weekEnd && 
             dueDate >= today && 
             task.status !== 'Completed';
    });

    // Active tasks (not completed)
    const activeTasks = tasks.filter(task => task.status !== 'Completed');

    // Update the compliance score calculation
    let complianceScore = completionRate;
    if (dashboardData.kpis) {
      // If all tasks are completed, keep it at 100%
      if (completionRate === 100) {
        complianceScore = 100;
      } else {
        // Otherwise calculate the weighted average
        const kpiLeadScore = (dashboardData.kpis.leads.current / dashboardData.kpis.leads.target) * 100;
        const kpiProjectScore = (dashboardData.kpis.projects.current / dashboardData.kpis.projects.target) * 100;
        
        // Weight task completion more heavily (60%) than KPIs (40%)
        complianceScore = Math.round(
          (completionRate * 0.6) + 
          ((kpiLeadScore + kpiProjectScore) / 2 * 0.4)
        );
      }
    }

    return {
      completed: completedTasks.length,
      completionRate,
      overdue: overdueTasks.length,
      upcoming: upcomingTasks.length,
      active: activeTasks.length,
      complianceScore: Math.min(complianceScore, 100) // Ensure it never exceeds 100
    };
  };

  const stats = calculateStats();

  const statsConfig = [
    { 
      title: 'Tasks Completed', 
      value: stats.completed,
      subtext: `${stats.completionRate}% completion rate`,
      icon: <CheckCircle />, 
      color: '#10b981',
      trend: stats.completionRate > 50 ? 
        <TrendingUp sx={{ color: '#10b981' }} /> : 
        <TrendingDown sx={{ color: '#ef4444' }} />
    },
    { 
      title: 'Overdue Tasks',
      value: stats.overdue, 
      subtext: stats.overdue > 0 ? 'Tasks need immediate attention' : 'No overdue tasks',
      icon: <Warning />, 
      color: '#ef4444',
      trend: stats.overdue > 0 ? 
        <TrendingUp sx={{ color: '#ef4444' }} /> : 
        <TrendingDown sx={{ color: '#10b981' }} />
    },
    { 
      title: 'Upcoming Tasks',
      value: stats.upcoming, 
      subtext: 'Tasks due this week',
      icon: <Timeline />, 
      color: '#f59e0b' 
    },
    { 
      title: 'Active Tasks', 
      value: stats.active, 
      subtext: 'Total ongoing tasks',
      icon: <Assignment />, 
      color: '#2563eb' 
    }
  ];

  return (
    <Box>
      <Header />
      {/* Reduce margin top to 2 */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Dashboard Overview
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/landing')}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            View Pricing & Features
          </Button>
        </Box>
        
        {/* Main Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsConfig.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ 
                      backgroundColor: `${stat.color}15`,
                      p: 1,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {React.cloneElement(stat.icon, { sx: { color: stat.color } })}
                    </Box>
                    {stat.trend && stat.trend}
                  </Box>
                  <Typography color="textSecondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {stat.subtext}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Compliance Score */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Task Completion Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h3" sx={{ mr: 2 }}>
                    {stats.complianceScore}%
                  </Typography>
                  {stats.complianceScore >= 70 ? (
                    <TrendingUp sx={{ color: '#10b981' }} />
                  ) : (
                    <TrendingDown sx={{ color: '#ef4444' }} />
                  )}
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.complianceScore} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 
                        stats.complianceScore >= 70 ? '#10b981' :
                        stats.complianceScore >= 40 ? '#f59e0b' : '#ef4444'
                    }
                  }}
                />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Based on completed vs total tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Notifications
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {notifications.length > 0 ? notifications.slice(0, 3).map((notification) => (
                    <Box 
                      key={notification.id} 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: notification.severity === 'error' ? 'error.lighter' : 'warning.lighter'
                      }}
                    >
                      <Typography variant="subtitle2">
                        {notification.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {notification.message}
                      </Typography>
                    </Box>
                  )) : (
                    <Typography variant="body2" color="textSecondary">
                      No new notifications
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard; 