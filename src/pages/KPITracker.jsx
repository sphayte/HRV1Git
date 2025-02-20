import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import {
  Line,
  Bar,
  Doughnut
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { TrendingUp, AttachMoney, Assignment, Receipt, Add as AddIcon, Edit as EditIcon, FileDownload as ExportIcon } from '@mui/icons-material';
import { useUserData } from '../contexts/UserDataContext';
import { useAuth } from '../contexts/AuthContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

function KPITracker() {
  const { user } = useAuth();
  const { updateData, getData } = useUserData();
  const [timeframe, setTimeframe] = useState('month');
  const [currentYear] = useState(new Date().getFullYear());
  const [currentMonth] = useState(new Date().getMonth());
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [editData, setEditData] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [targetDialog, setTargetDialog] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [kpiData, setKpiData] = useState(null);

  // Load KPI data from Firebase
  useEffect(() => {
    const loadKPIData = async () => {
      if (user) {
        try {
          const savedData = await getData('kpis/dashboard');
          if (savedData) {
            setKpiData(savedData);
          } else {
            // Initialize with default data if none exists
            const defaultData = {
              leads: {
                current: 45,
                target: 50,
                history: [28, 32, 36, 40, 45, 42, 48, 45, 50, 48, 52, 45]
              },
              revenue: {
                current: 25000,
                target: 30000,
                history: [18000, 21000, 23000, 25000, 28000, 27000, 29000, 25000, 30000, 28000, 32000, 25000]
              },
              projects: {
                current: 12,
                target: 15,
                active: 8,
                completed: 4,
                history: [8, 10, 11, 12, 14, 13, 15, 12, 15, 14, 16, 12]
              },
              expenses: {
                current: 15000,
                budget: 18000,
                categories: {
                  'Marketing': 5000,
                  'Tools & Software': 3000,
                  'Contractors': 4000,
                  'Other': 3000
                },
                history: [12000, 13000, 14000, 15000, 16000, 15500, 16000, 15000, 17000, 16000, 18000, 15000]
              }
            };
            await updateData('kpis/dashboard', defaultData);
            setKpiData(defaultData);
          }
        } catch (error) {
          console.error('Error loading KPI data:', error);
          setAlertMessage('Error loading KPI data');
        }
      }
    };
    loadKPIData();
  }, [user, getData]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthLabel = months[currentMonth];

  // Add this function to filter data based on timeframe
  const getFilteredData = (data, timeframe) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    switch (timeframe) {
      case 'week':
        // Get last 7 days of data
        return data.slice(-7);
      case 'month':
        // Get current month's data
        return data.slice(currentMonth, currentMonth + 1);
      case 'quarter':
        // Get last 3 months of data
        return data.slice(-3);
      case 'year':
        // Get all 12 months
        return data;
      default:
        return data;
    }
  };

  // Update the chart data based on timeframe
  const getTimeframeLabels = (timeframe) => {
    switch (timeframe) {
      case 'week':
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date().getDay();
        return Array(7).fill().map((_, i) => weekDays[(today + i) % 7]);
      case 'month':
        return Array(30).fill().map((_, i) => `Day ${i + 1}`);
      case 'quarter':
        const quarterMonths = months.slice(currentMonth - 2, currentMonth + 1);
        return quarterMonths;
      case 'year':
        return months;
      default:
        return months;
    }
  };

  // Update expense dialog to be more user-friendly
  const handleExpenseAdd = () => {
    setDialogType('expense');
    setEditData({
      category: '',
      amount: '',
      description: ''
    });
    setOpenDialog(true);
  };

  // Update the expense dialog content
  {dialogType === 'expense' && (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select
          value={editData?.category || ''}
          label="Category"
          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
        >
          <MenuItem value="Marketing">Marketing</MenuItem>
          <MenuItem value="Tools & Software">Tools & Software</MenuItem>
          <MenuItem value="Contractors">Contractors</MenuItem>
          <MenuItem value="Office Supplies">Office Supplies</MenuItem>
          <MenuItem value="Travel">Travel</MenuItem>
          <MenuItem value="Training">Training</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
      
      <TextField
        label="Amount"
        type="number"
        value={editData?.amount || ''}
        onChange={(e) => setEditData({ ...editData, amount: Number(e.target.value) })}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />
      
      <TextField
        label="Description"
        multiline
        rows={2}
        value={editData?.description || ''}
        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
        placeholder="Enter expense description..."
      />
    </Box>
  )}

  // Update the handleSave function for expenses
  const handleSave = async () => {
    if (!editData) return;

    try {
      const updatedData = { ...kpiData };
      
      switch (dialogType) {
        case 'lead':
          updatedData.leads.current = editData.value;
          updatedData.leads.history[currentMonth] = editData.value;
          break;
        case 'revenue':
          updatedData.revenue.current = editData.value;
          updatedData.revenue.history[currentMonth] = editData.value;
          break;
        case 'project':
          updatedData.projects.active = editData.active;
          updatedData.projects.completed = editData.completed;
          updatedData.projects.current = editData.active + editData.completed;
          updatedData.projects.history[currentMonth] = editData.active + editData.completed;
          break;
        case 'expense':
          if (editData.category && editData.amount) {
            // Update or add the expense category
            updatedData.expenses.categories[editData.category] = 
              (updatedData.expenses.categories[editData.category] || 0) + editData.amount;
            
            // Update total expenses
            updatedData.expenses.current = Object.values(updatedData.expenses.categories)
              .reduce((sum, val) => sum + val, 0);
            
            // Update history
            updatedData.expenses.history[currentMonth] = updatedData.expenses.current;
            
            // Add to expense details if you want to track individual expenses
            if (!updatedData.expenses.details) {
              updatedData.expenses.details = [];
            }
            updatedData.expenses.details.push({
              category: editData.category,
              amount: editData.amount,
              description: editData.description,
              date: new Date().toISOString()
            });
          }
          break;
      }

      await updateData('kpis/dashboard', updatedData);
      setKpiData(updatedData);
      setOpenDialog(false);
      setEditData(null);
      setAlertMessage('Data updated successfully');
    } catch (error) {
      console.error('Error saving KPI data:', error);
      setAlertMessage('Error updating data');
    }
  };

  // Handle saving targets
  const handleSaveTarget = async () => {
    if (!editData) return;

    try {
      const updatedData = { ...kpiData };
      switch (selectedTarget) {
        case 'leads':
          updatedData.leads.target = editData.value;
          break;
        case 'revenue':
          updatedData.revenue.target = editData.value;
          break;
        case 'projects':
          updatedData.projects.target = editData.value;
          break;
        case 'expenses':
          updatedData.expenses.budget = editData.value;
          break;
      }

      await updateData('kpis/dashboard', updatedData);
      setKpiData(updatedData);
      setTargetDialog(false);
      setEditData(null);
      setAlertMessage('Target updated successfully');
    } catch (error) {
      console.error('Error saving target:', error);
      setAlertMessage('Error updating target');
    }
  };

  // Only render charts if data is loaded
  if (!kpiData) return null;

  // Chart configurations using kpiData
  const revenueChartData = {
    labels: getTimeframeLabels(timeframe),
    datasets: [
      {
        label: 'Revenue',
        data: getFilteredData(kpiData.revenue.history, timeframe),
        fill: true,
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: getFilteredData(kpiData.expenses.history, timeframe),
        fill: true,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }
    ]
  };

  const leadsChartData = {
    labels: months,
    datasets: [{
      label: 'Leads',
      data: kpiData.leads.history,
      backgroundColor: '#10B981',
      borderColor: '#10B981',
      borderWidth: 2
    }]
  };

  const projectsChartData = {
    labels: ['Active', 'Completed'],
    datasets: [{
      data: [kpiData.projects.active, kpiData.projects.completed],
      backgroundColor: ['#4CAF50', '#2196F3'],
      borderWidth: 0
    }]
  };

  const expensesChartData = {
    labels: Object.keys(kpiData.expenses.categories),
    datasets: [{
      data: Object.values(kpiData.expenses.categories),
      backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  };

  // Update the handleAdd function to be simpler
  const handleAdd = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(kpiData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kpi_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Update the handleEditTarget function
  const handleEditTarget = async (type) => {
    setSelectedTarget(type);
    setTargetDialog(true);
  };

  // Add an expense details section
  const ExpenseDetails = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Recent Expenses</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kpiData.expenses.details?.slice(-5).map((expense, index) => (
              <TableRow key={index}>
                <TableCell>{expense.category}</TableCell>
                <TableCell>${expense.amount.toLocaleString()}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: 3,
      ml: -4  // Add negative margin to move content left
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h4">KPI Tracker</Typography>
        <Box sx={{ 
          display: 'flex',
          gap: 2,
          alignItems: 'center'
        }}>
          <FormControl sx={{ width: 200 }}>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={timeframe}
              label="Timeframe"
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<ExportIcon />}
            onClick={exportData}
          >
            Export Data
          </Button>
        </Box>
      </Box>

      {alertMessage && (
        <Alert 
          severity="success" 
          sx={{ mb: 2 }}
          onClose={() => setAlertMessage('')}
        >
          {alertMessage}
        </Alert>
      )}

      {/* KPI Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="textSecondary">Leads</Typography>
                <Box>
                  <Tooltip title="Add Lead Data">
                    <IconButton size="small" onClick={() => handleAdd('lead')}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Target">
                    <IconButton size="small" onClick={() => handleEditTarget('leads')}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Typography variant="h4">{kpiData.leads.current}</Typography>
              <Typography variant="body2" color="textSecondary">
                Target: {kpiData.leads.target}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="textSecondary">Revenue</Typography>
                <Box>
                  <Tooltip title="Add Revenue Data">
                    <IconButton size="small" onClick={() => handleAdd('revenue')}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Target">
                    <IconButton size="small" onClick={() => handleEditTarget('revenue')}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Typography variant="h4">${kpiData.revenue.current.toLocaleString()}</Typography>
              <Typography variant="body2" color="textSecondary">
                Target: ${kpiData.revenue.target.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="textSecondary">Projects</Typography>
                <Box>
                  <Tooltip title="Add Project Data">
                    <IconButton size="small" onClick={() => handleAdd('project')}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Target">
                    <IconButton size="small" onClick={() => handleEditTarget('projects')}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Typography variant="h4">{kpiData.projects.current}</Typography>
              <Typography variant="body2" color="textSecondary">
                Target: {kpiData.projects.target}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="textSecondary">Expenses</Typography>
                <Box>
                  <Tooltip title="Add Expense Data">
                    <IconButton size="small" onClick={handleExpenseAdd}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Target">
                    <IconButton size="small" onClick={() => handleEditTarget('expenses')}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Typography variant="h4">${kpiData.expenses.current.toLocaleString()}</Typography>
              <Typography variant="body2" color="textSecondary">
                Target: ${kpiData.expenses.budget.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Revenue vs Expenses</Typography>
            <Box sx={{ height: 'calc(100% - 32px)' }}>
              <Line 
                data={revenueChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Project Status</Typography>
            <Box sx={{ height: 'calc(100% - 32px)' }}>
              <Doughnut 
                data={projectsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Lead Generation</Typography>
            <Box sx={{ height: 'calc(100% - 32px)' }}>
              <Bar 
                data={leadsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Expense Breakdown</Typography>
            <Box sx={{ height: 'calc(100% - 32px)' }}>
              <Doughnut 
                data={expensesChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Dialog for data entry */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editData ? 'Edit' : 'Add'} {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)} Data
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {dialogType === 'lead' && (
              <TextField
                label="Number of Leads"
                type="number"
                defaultValue={editData?.current || ''}
                onChange={(e) => setEditData({ value: Number(e.target.value) })}
              />
            )}
            {dialogType === 'revenue' && (
              <TextField
                label="Revenue Amount"
                type="number"
                defaultValue={editData?.current || ''}
                onChange={(e) => setEditData({ value: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            )}
            {dialogType === 'project' && (
              <>
                <TextField
                  label="Active Projects"
                  type="number"
                  defaultValue={editData?.active || ''}
                  onChange={(e) => setEditData({ ...editData, active: Number(e.target.value) })}
                />
                <TextField
                  label="Completed Projects"
                  type="number"
                  defaultValue={editData?.completed || ''}
                  onChange={(e) => setEditData({ ...editData, completed: Number(e.target.value) })}
                />
              </>
            )}
            {dialogType === 'expense' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={editData?.category || ''}
                    label="Category"
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  >
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Tools & Software">Tools & Software</MenuItem>
                    <MenuItem value="Contractors">Contractors</MenuItem>
                    <MenuItem value="Office Supplies">Office Supplies</MenuItem>
                    <MenuItem value="Travel">Travel</MenuItem>
                    <MenuItem value="Training">Training</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  label="Amount"
                  type="number"
                  value={editData?.amount || ''}
                  onChange={(e) => setEditData({ ...editData, amount: Number(e.target.value) })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
                
                <TextField
                  label="Description"
                  multiline
                  rows={2}
                  value={editData?.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Enter expense description..."
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Target Dialog */}
      <Dialog open={targetDialog} onClose={() => setTargetDialog(false)}>
        <DialogTitle>
          {selectedTarget ? 'Edit' : 'Add'} Target
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {!selectedTarget && (
              <FormControl fullWidth>
                <InputLabel>KPI Type</InputLabel>
                <Select
                  value={selectedTarget || ''}
                  label="KPI Type"
                  onChange={(e) => setSelectedTarget(e.target.value)}
                >
                  <MenuItem value="leads">Leads</MenuItem>
                  <MenuItem value="revenue">Revenue</MenuItem>
                  <MenuItem value="projects">Projects</MenuItem>
                  <MenuItem value="expenses">Expenses</MenuItem>
                </Select>
              </FormControl>
            )}
            <TextField
              label="Target Value"
              type="number"
              value={editData?.value || ''}
              onChange={(e) => setEditData({ ...editData, value: Number(e.target.value) })}
              InputProps={{
                startAdornment: selectedTarget === 'revenue' || selectedTarget === 'expenses' ? 
                  <InputAdornment position="start">$</InputAdornment> : null
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTargetDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveTarget} 
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Expense Details */}
      <ExpenseDetails />
    </Box>
  );
}

export default KPITracker; 