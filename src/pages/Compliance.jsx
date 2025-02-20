import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Fade,
  Stack
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Warning,
  Schedule,
  Flag,
  Add,
  Delete,
  Edit
} from '@mui/icons-material';
import { useNotifications } from '../contexts/NotificationContext';
import { useUserData } from '../contexts/UserDataContext';
import { useAuth } from '../contexts/AuthContext';

function Compliance() {
  const [localTasks, setLocalTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { add, remove, getData, updateData, loading } = useUserData();
  const { checkDueDates } = useNotifications();

  // Load tasks from Firebase when component mounts
  useEffect(() => {
    const loadTasks = async () => {
      if (user) {
        try {
          const tasks = await getData('compliance/tasks');
          setLocalTasks(tasks || []);
        } catch (error) {
          console.error('Error loading tasks:', error);
        }
      }
    };
    loadTasks();
  }, [user, getData]);

  useEffect(() => {
    // Update notifications when tasks change
    checkDueDates(localTasks);
  }, [localTasks, checkDueDates]);

  useEffect(() => {
    // Listen for search events
    const handleSearch = (e) => {
      setSearchTerm(e.detail.toLowerCase());
    };

    window.addEventListener('search', handleSearch);
    return () => window.removeEventListener('search', handleSearch);
  }, []);

  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'Pending',
    priority: 'Medium',
    completion: 0
  });

  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    if (localTasks.length === 0) {
      setLocalTasks([
        {
          id: 1,
          title: 'Annual Safety Training',
          dueDate: '2024-03-15',
          status: 'Pending',
          priority: 'High',
          completion: 65,
          description: 'Complete annual safety training for all employees'
        },
        {
          id: 2,
          title: 'Employee Handbook Updates',
          dueDate: '2024-04-01',
          status: 'In Progress',
          priority: 'Medium',
          completion: 30,
          description: 'Update employee handbook with new policies'
        },
        {
          id: 3,
          title: 'Data Protection Audit',
          dueDate: '2024-02-28',
          status: 'Completed',
          priority: 'High',
          completion: 100,
          description: 'Conduct quarterly data protection audit'
        }
      ]);
    }
  }, [localTasks.length, setLocalTasks]);

  const handleAddTask = async (newTask) => {
    try {
      // Add task to Firebase
      const updatedTasks = await add('compliance/tasks', {
        ...newTask,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      });
      
      // Update local state
      setLocalTasks(updatedTasks);
      
      // Close the dialog and reset the form
      setOpenDialog(false);
      setNewTask({  // Reset form to initial state
        title: '',
        description: '',
        dueDate: '',
        status: 'Pending',
        priority: 'Medium',
        completion: 0
      });
    } catch (error) {
      console.error('Error adding task:', error);
      // Show error notification
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Remove task from Firebase
      const updatedTasks = await remove('compliance/tasks', taskId);
      
      // Update local state
      setLocalTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      // Show error notification
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Update task in Firebase
      const updatedTasks = await updateData('compliance/tasks', 
        localTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus }
            : task
        )
      );
      
      // Update local state
      setLocalTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
      // Show error notification
    }
  };

  const handleCompletionChange = (taskId, newCompletion) => {
    setLocalTasks(localTasks.map(task => {
      if (task.id === taskId) {
        const status = newCompletion === 100 ? 'Completed' : task.status;
        
        // Send notification if completion reaches 100%
        if (newCompletion === 100 && task.completion !== 100) {
          const notification = {
            id: `task-complete-${task.id}-${Date.now()}`, // Add timestamp to make ID unique
            type: 'success',
            title: 'Task Completed',
            message: `"${task.title}" has reached 100% completion`,
            severity: 'success',
            date: new Date().toISOString()
          };
          checkDueDates(localTasks, [notification]);
        }

        return { ...task, completion: newCompletion, status };
      }
      return task;
    }));
  };

  const handlePriorityChange = (taskId, newPriority) => {
    setLocalTasks(localTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, priority: newPriority };
      }
      return task;
    }));
  };

  const handleDueDateChange = (taskId, newDate) => {
    setLocalTasks(localTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, dueDate: newDate };
      }
      return task;
    }));
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed':
        return <CheckCircle color="success" />;
      case 'Pending':
        return <Schedule color="warning" />;
      case 'In Progress':
        return <Assignment color="primary" />;
      default:
        return <Flag />;
    }
  };

  const getPriorityChip = (priority) => {
    switch(priority) {
      case 'High':
        return <Chip label={priority} color="error" size="small" />;
      case 'Medium':
        return <Chip label={priority} color="warning" size="small" />;
      case 'Low':
        return <Chip label={priority} color="success" size="small" />;
      default:
        return <Chip label={priority} size="small" />;
    }
  };

  const getFilteredTasks = () => {
    // First filter by search term
    const searchFiltered = localTasks.filter(task => 
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.priority?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.dueDate?.includes(searchTerm) || 
      ''  // Fallback if any property is undefined
    );

    // Then filter by active/completed status
    return searchFiltered.filter(task => 
      activeTab === 'active' 
        ? task.status !== 'Completed' 
        : task.status === 'Completed'
    );
  };

  // Add these calculation functions
  const calculateStats = () => {
    if (localTasks.length === 0) {
      return {
        overallCompliance: 0,
        tasksThisMonth: 0,
        highPriorityTasks: 0
      };
    }

    const today = new Date();
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Calculate overall compliance
    const completedTasks = localTasks.filter(task => task.status === 'Completed').length;
    const overallCompliance = Math.round((completedTasks / localTasks.length) * 100) || 0;

    // Calculate tasks due this month
    const tasksThisMonth = localTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate <= monthEnd && task.status !== 'Completed';
    }).length;

    // Calculate high priority tasks
    const highPriorityTasks = localTasks.filter(task => 
      task.priority === 'High' && task.status !== 'Completed'
    ).length;

    return {
      overallCompliance,
      tasksThisMonth,
      highPriorityTasks
    };
  };

  const stats = calculateStats();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>Compliance Tasks</Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Overall Compliance
              </Typography>
              <Typography variant="h4">{stats.overallCompliance}%</Typography>
              <LinearProgress 
                variant="determinate" 
                value={stats.overallCompliance} 
                sx={{ 
                  mt: 2,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: stats.overallCompliance >= 70 ? '#10b981' : 
                                   stats.overallCompliance >= 40 ? '#f59e0b' : '#ef4444'
                  }
                }}
              />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {localTasks.filter(t => t.status === 'Completed').length} of {localTasks.length} tasks completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tasks Due This Month
              </Typography>
              <Typography variant="h4">{stats.tasksThisMonth}</Typography>
              <Typography 
                variant="body2" 
                color="textSecondary"
                sx={{ mt: 1 }}
              >
                {stats.tasksThisMonth > 0 
                  ? `Requires attention before month end`
                  : 'No immediate deadlines'
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                High Priority Tasks
              </Typography>
              <Typography variant="h4">{stats.highPriorityTasks}</Typography>
              <Typography 
                variant="body2" 
                color="textSecondary"
                sx={{ mt: 1 }}
              >
                {stats.highPriorityTasks > 0 
                  ? `${stats.highPriorityTasks} tasks need immediate attention`
                  : 'No high priority tasks pending'
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 3,
          alignItems: 'center' 
        }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Tasks</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={activeTab === 'active' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('active')}
                size="small"
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3
                }}
              >
                Active Tasks ({localTasks.filter(t => t.status !== 'Completed').length})
              </Button>
              <Button
                variant={activeTab === 'completed' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('completed')}
                size="small"
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3
                }}
              >
                Completed Tasks ({localTasks.filter(t => t.status === 'Completed').length})
              </Button>
            </Box>
          </Box>
          {activeTab === 'active' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s'
              }}
            >
              Add New Task
            </Button>
          )}
        </Box>
        
        <List>
          {getFilteredTasks().map((task) => (
            <Fade in key={task.id}>
              <ListItem
                sx={{
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: task.status === 'Completed' ? 'action.hover' : 'background.paper',
                  boxShadow: 1,
                  '&:hover': {
                    boxShadow: 2,
                    transform: 'translateY(-2px)',
                    bgcolor: task.status === 'Completed' ? 'action.selected' : 'action.hover'
                  },
                  transition: 'all 0.2s',
                  opacity: task.status === 'Completed' ? 0.8 : 1
                }}
              >
                <ListItemIcon>
                  {getStatusIcon(task.status)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {task.title}
                    </Typography>
                  }
                  secondary={
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          minWidth: '150px'
                        }}>
                          <Typography variant="body2" color="text.secondary">
                            Due:
                          </Typography>
                          <TextField
                            type="date"
                            size="small"
                            value={task.dueDate}
                            onChange={(e) => handleDueDateChange(task.id, e.target.value)}
                            sx={{ 
                              '& .MuiInputBase-input': { 
                                py: 0.5,
                                px: 1,
                                fontSize: '0.875rem'
                              },
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1
                              }
                            }}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                          <Select
                            value={task.priority}
                            onChange={(e) => handlePriorityChange(task.id, e.target.value)}
                            size="small"
                            sx={{ 
                              height: 32,
                              '& .MuiSelect-select': {
                                py: 0.5,
                                px: 1,
                              },
                              backgroundColor: 
                                task.priority === 'High' ? 'error.lighter' :
                                task.priority === 'Medium' ? 'warning.lighter' : 
                                'success.lighter'
                            }}
                          >
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                          </Select>
                        </FormControl>
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task.id, e.target.value)}
                              sx={{ height: 32 }}
                            >
                              <MenuItem value="Pending">Pending</MenuItem>
                              <MenuItem value="In Progress">In Progress</MenuItem>
                              <MenuItem value="Completed">Completed</MenuItem>
                            </Select>
                          </FormControl>
                          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={Number(task.completion)}
                              sx={{ 
                                flexGrow: 1, 
                                height: 8, 
                                borderRadius: 4,
                                backgroundColor: 'action.hover',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: 
                                    task.completion === 100 ? 'success.main' :
                                    task.completion >= 50 ? 'warning.main' : 
                                    'error.main'
                                }
                              }}
                            />
                            <Select
                              value={task.completion}
                              onChange={(e) => handleCompletionChange(task.id, Number(e.target.value))}
                              size="small"
                              sx={{ 
                                height: 32, 
                                minWidth: 80,
                                '& .MuiSelect-select': { py: 0.5 },
                                bgcolor: 'background.paper'
                              }}
                            >
                              {[0, 25, 50, 75, 100].map((value) => (
                                <MenuItem key={value} value={value}>{value}%</MenuItem>
                              ))}
                            </Select>
                          </Box>
                        </Box>
                      </Box>
                    </Stack>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    color="error"
                    onClick={() => handleDeleteTask(task.id)}
                    sx={{ 
                      '&:hover': { 
                        bgcolor: 'error.light',
                        color: 'white'
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Fade>
          ))}
          {getFilteredTasks().length === 0 && (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 4,
                color: 'text.secondary'
              }}
            >
              <Typography variant="body1">
                {activeTab === 'active' 
                  ? 'No active tasks found' 
                  : 'No completed tasks found'}
              </Typography>
            </Box>
          )}
        </List>
      </Paper>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>Add New Compliance Task</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Task Title"
              fullWidth
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />

            <TextField
              label="Due Date"
              type="date"
              fullWidth
              value={newTask.dueDate || ''}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTask.priority}
                label="Priority"
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newTask.status}
                label="Status"
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleAddTask(newTask)}
            sx={{ 
              textTransform: 'none',
              px: 3,
              borderRadius: 2
            }}
          >
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Compliance; 