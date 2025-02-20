import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Download,
  FilterList,
  Email,
  Phone,
  CalendarMonth,
  Work,
  AttachMoney,
  Description,
  Info
} from '@mui/icons-material';
import { useUserData } from '../contexts/UserDataContext';
import { useAuth } from '../contexts/AuthContext';

function Employees() {
  const { user } = useAuth();
  const { getData, updateData, add, remove } = useUserData();
  const [employees, setEmployees] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [profileTab, setProfileTab] = useState(0);
  const [leaveRequestDialog, setLeaveRequestDialog] = useState(false);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    type: 'Vacation',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [leaveApprovalDialog, setLeaveApprovalDialog] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [leaveComment, setLeaveComment] = useState('');
  const [addEmployeeDialog, setAddEmployeeDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    joinDate: '',
    status: 'Active',
    leaveBalance: 20, // Default leave balance
  });
  const [alertMessage, setAlertMessage] = useState('');

  // Load employees data from Firebase
  useEffect(() => {
    const loadEmployees = async () => {
      if (user) {
        try {
          const employeesData = await getData('employees');
          if (employeesData) {
            setEmployees(employeesData);
          } else {
            // Initialize with default employee if none exist
            const defaultEmployee = {
              id: 1,
              name: 'John Doe',
              department: 'IT',
              position: 'Developer',
              status: 'Active',
              joinDate: '2023-01-15',
              leaveBalance: 15,
              email: 'john.doe@company.com',
              phone: '(555) 123-4567',
              salary: 75000,
              leaveHistory: [
                {
                  type: 'Vacation',
                  startDate: '2024-03-15',
                  endDate: '2024-03-20',
                  status: 'Approved'
                }
              ],
              documents: [
                {
                  name: 'Contract',
                  uploadDate: '2023-01-15',
                  status: 'Valid'
                }
              ]
            };
            await updateData('employees', [defaultEmployee]);
            setEmployees([defaultEmployee]);
          }
        } catch (error) {
          console.error('Error loading employees:', error);
        }
      }
    };
    loadEmployees();
  }, [user, getData]);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleLeaveRequest = async () => {
    if (selectedEmployee && newLeaveRequest.startDate && newLeaveRequest.endDate) {
      try {
        const updatedEmployee = {
          ...selectedEmployee,
          leaveHistory: [
            ...selectedEmployee.leaveHistory,
            { ...newLeaveRequest, status: 'Pending' }
          ]
        };
        
        const updatedEmployees = employees.map(emp => 
          emp.id === selectedEmployee.id ? updatedEmployee : emp
        );
        
        await updateData('employees', updatedEmployees);
        setEmployees(updatedEmployees);
        setLeaveRequestDialog(false);
        setNewLeaveRequest({
          type: 'Vacation',
          startDate: '',
          endDate: '',
          reason: ''
        });
      } catch (error) {
        console.error('Error submitting leave request:', error);
      }
    }
  };

  const handleLeaveAction = async (action) => {
    if (selectedEmployee && selectedLeave) {
      try {
        const updatedLeaveHistory = selectedEmployee.leaveHistory.map(leave => {
          if (leave === selectedLeave) {
            return {
              ...leave,
              status: action,
              comment: leaveComment,
              actionDate: new Date().toISOString().split('T')[0]
            };
          }
          return leave;
        });

        const updatedEmployee = {
          ...selectedEmployee,
          leaveHistory: updatedLeaveHistory,
          leaveBalance: action === 'Approved' 
            ? calculateNewLeaveBalance(selectedEmployee, selectedLeave)
            : selectedEmployee.leaveBalance
        };

        const updatedEmployees = employees.map(emp => 
          emp.id === selectedEmployee.id ? updatedEmployee : emp
        );

        await updateData('employees', updatedEmployees);
        setEmployees(updatedEmployees);
        setLeaveApprovalDialog(false);
        setSelectedLeave(null);
        setLeaveComment('');
      } catch (error) {
        console.error('Error processing leave action:', error);
      }
    }
  };

  const calculateNewLeaveBalance = (employee, leave) => {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return employee.leaveBalance - days;
  };

  const handleAddEmployee = async () => {
    if (newEmployee.name && newEmployee.email) {
      try {
        const employee = {
          id: Date.now(), // Use timestamp as ID
          ...newEmployee,
          salary: Number(newEmployee.salary),
          leaveHistory: [],
          documents: []
        };
        
        const updatedEmployees = [...employees, employee];
        await updateData('employees', updatedEmployees);
        setEmployees(updatedEmployees);
        setAddEmployeeDialog(false);
        setNewEmployee({
          name: '',
          email: '',
          phone: '',
          department: '',
          position: '',
          salary: '',
          joinDate: '',
          status: 'Active',
          leaveBalance: 20,
        });
      } catch (error) {
        console.error('Error adding employee:', error);
      }
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
      await updateData('employees', updatedEmployees);
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleEmployeeUpdate = async (employeeId, updates) => {
    try {
      // Update the employee in the employees array
      const updatedEmployees = employees.map(emp => 
        emp.id === employeeId ? { ...emp, ...updates } : emp
      );
      
      // Update Firebase
      await updateData('employees', updatedEmployees);
      
      // Update local state
      setEmployees(updatedEmployees);
      
      // Update the selected employee view
      if (selectedEmployee && selectedEmployee.id === employeeId) {
        setSelectedEmployee(prev => ({
          ...prev,
          ...updates
        }));
      }
      
      setAlertMessage('Employee updated successfully');
    } catch (error) {
      console.error('Error updating employee:', error);
      setAlertMessage('Error updating employee');
    }
  };

  return (
    <Box>
      {alertMessage && (
        <Alert 
          severity="success" 
          sx={{ mb: 2 }}
          onClose={() => setAlertMessage('')}
        >
          {alertMessage}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Employee Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddEmployeeDialog(true)}
        >
          Add Employee
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Employees
              </Typography>
              <Typography variant="h4">
                {employees.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Employees
              </Typography>
              <Typography variant="h4">
                {employees.filter(emp => emp.status === 'Active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                On Leave Today
              </Typography>
              <Typography variant="h4">
                {employees.filter(emp => emp.status === 'On Leave').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                New This Month
              </Typography>
              <Typography variant="h4">
                {employees.filter(emp => {
                  const joinDate = new Date(emp.joinDate);
                  const today = new Date();
                  return joinDate.getMonth() === today.getMonth() &&
                         joinDate.getFullYear() === today.getFullYear();
                }).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search employees..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Button startIcon={<FilterList />}>
            Filters
          </Button>
          <Button startIcon={<Download />}>
            Export
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Leave Balance</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>
                    <Chip 
                      label={employee.status} 
                      color={employee.status === 'Active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{employee.joinDate}</TableCell>
                  <TableCell>{employee.leaveBalance} days</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEmployeeClick(employee)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteEmployee(employee.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog 
        open={Boolean(selectedEmployee)} 
        onClose={() => setSelectedEmployee(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 'lg'
          }
        }}
      >
        {selectedEmployee && (
          <>
            <DialogTitle sx={{ 
              borderBottom: '1px solid',
              borderColor: 'divider',
              pb: 2
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedEmployee.name}
                </Typography>
                <Chip 
                  label={selectedEmployee.status || 'Unknown'}
                  color={selectedEmployee.status === 'Active' ? 'success' : 'default'}
                  sx={{ 
                    fontWeight: 500,
                    px: 1
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Tabs 
                value={profileTab} 
                onChange={(e, newValue) => setProfileTab(newValue)}
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider', 
                  mb: 3,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    minWidth: 100
                  }
                }}
              >
                <Tab label="Details" />
                <Tab label="Payroll" />
              </Tabs>

              {profileTab === 0 && (
                <List sx={{ pt: 1 }}>
                  <ListItem sx={{ mb: 2 }}>
                    <ListItemIcon>
                      <Email sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography color="text.secondary" variant="body2">Email</Typography>}
                      secondary={<Typography variant="body1">{selectedEmployee.email || 'N/A'}</Typography>}
                    />
                  </ListItem>
                  <ListItem sx={{ mb: 2 }}>
                    <ListItemIcon>
                      <Phone sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography color="text.secondary" variant="body2">Phone</Typography>}
                      secondary={<Typography variant="body1">{selectedEmployee.phone || 'N/A'}</Typography>}
                    />
                  </ListItem>
                  <ListItem sx={{ mb: 2 }}>
                    <ListItemIcon>
                      <Work sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <Box sx={{ width: '100%' }}>
                      <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                        Position & Department
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2
                      }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Position</InputLabel>
                          <Select
                            value={selectedEmployee.position || ''}
                            label="Position"
                            onChange={(e) => handleEmployeeUpdate(selectedEmployee.id, { position: e.target.value })}
                            sx={{ bgcolor: 'background.paper' }}
                          >
                            <MenuItem value="Developer">Developer</MenuItem>
                            <MenuItem value="Manager">Manager</MenuItem>
                            <MenuItem value="HR Specialist">HR Specialist</MenuItem>
                            <MenuItem value="Analyst">Analyst</MenuItem>
                            <MenuItem value="Designer">Designer</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl fullWidth size="small">
                          <InputLabel>Department</InputLabel>
                          <Select
                            value={selectedEmployee.department || ''}
                            label="Department"
                            onChange={(e) => handleEmployeeUpdate(selectedEmployee.id, { department: e.target.value })}
                            sx={{ bgcolor: 'background.paper' }}
                          >
                            <MenuItem value="IT">IT</MenuItem>
                            <MenuItem value="HR">HR</MenuItem>
                            <MenuItem value="Finance">Finance</MenuItem>
                            <MenuItem value="Marketing">Marketing</MenuItem>
                            <MenuItem value="Operations">Operations</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </ListItem>
                  <ListItem sx={{ mb: 2 }}>
                    <ListItemIcon>
                      <CalendarMonth sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography color="text.secondary" variant="body2">Join Date</Typography>}
                      secondary={<Typography variant="body1">{selectedEmployee.joinDate || 'N/A'}</Typography>}
                    />
                  </ListItem>
                  <ListItem sx={{ mb: 2 }}>
                    <ListItemIcon>
                      <CalendarMonth sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <Box sx={{ width: '100%' }}>
                      <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                        Leave Balance
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2 
                      }}>
                        <TextField
                          type="number"
                          size="small"
                          value={selectedEmployee.leaveBalance || 0}
                          onChange={(e) => handleEmployeeUpdate(
                            selectedEmployee.id, 
                            { leaveBalance: parseInt(e.target.value) }
                          )}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">days</InputAdornment>,
                          }}
                          sx={{ width: '150px' }}
                        />
                      </Box>
                    </Box>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Info sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <Box sx={{ width: '100%' }}>
                      <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                        Status
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={selectedEmployee.status || ''}
                          onChange={(e) => handleEmployeeUpdate(selectedEmployee.id, { status: e.target.value })}
                          sx={{ bgcolor: 'background.paper' }}
                        >
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="On Leave">On Leave</MenuItem>
                          <MenuItem value="Terminated">Terminated</MenuItem>
                          <MenuItem value="Suspended">Suspended</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </ListItem>
                </List>
              )}

              {profileTab === 1 && (
                <List sx={{ pt: 1 }}>
                  <ListItem>
                    <ListItemIcon>
                      <AttachMoney sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography color="text.secondary" variant="body2">Current Salary</Typography>}
                      secondary={
                        <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary' }}>
                          {selectedEmployee.salary ? `$${selectedEmployee.salary.toLocaleString()}/year` : 'N/A'}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              )}
            </DialogContent>
            <DialogActions sx={{ 
              borderTop: '1px solid',
              borderColor: 'divider',
              px: 3,
              py: 2
            }}>
              <Button 
                onClick={() => setSelectedEmployee(null)}
                variant="outlined"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog 
        open={leaveRequestDialog} 
        onClose={() => setLeaveRequestDialog(false)}
      >
        <DialogTitle>Request Leave</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Leave Type</InputLabel>
              <Select
                value={newLeaveRequest.type}
                label="Leave Type"
                onChange={(e) => setNewLeaveRequest({
                  ...newLeaveRequest,
                  type: e.target.value
                })}
              >
                <MenuItem value="Vacation">Vacation</MenuItem>
                <MenuItem value="Sick">Sick Leave</MenuItem>
                <MenuItem value="Personal">Personal Leave</MenuItem>
                <MenuItem value="Maternity">Maternity Leave</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Start Date"
              type="date"
              value={newLeaveRequest.startDate}
              onChange={(e) => setNewLeaveRequest({
                ...newLeaveRequest,
                startDate: e.target.value
              })}
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              label="End Date"
              type="date"
              value={newLeaveRequest.endDate}
              onChange={(e) => setNewLeaveRequest({
                ...newLeaveRequest,
                endDate: e.target.value
              })}
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              label="Reason"
              multiline
              rows={3}
              value={newLeaveRequest.reason}
              onChange={(e) => setNewLeaveRequest({
                ...newLeaveRequest,
                reason: e.target.value
              })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeaveRequestDialog(false)}>Cancel</Button>
          <Button onClick={handleLeaveRequest} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={leaveApprovalDialog} 
        onClose={() => setLeaveApprovalDialog(false)}
      >
        <DialogTitle>Review Leave Request</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {selectedLeave && (
              <>
                <Typography variant="subtitle1">
                  {selectedLeave.type} Leave Request
                </Typography>
                <Typography variant="body2">
                  Duration: {selectedLeave.startDate} to {selectedLeave.endDate}
                </Typography>
                <Typography variant="body2">
                  Reason: {selectedLeave.reason}
                </Typography>
                <TextField
                  label="Comments"
                  multiline
                  rows={3}
                  value={leaveComment}
                  onChange={(e) => setLeaveComment(e.target.value)}
                />
                <Box sx={{ 
                  bgcolor: 'info.lighter', 
                  p: 2, 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Info color="info" />
                  <Typography variant="body2">
                    Employee's current leave balance: {selectedEmployee?.leaveBalance} days
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setLeaveApprovalDialog(false)}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleLeaveAction('Rejected')}
            color="error"
          >
            Reject
          </Button>
          <Button 
            onClick={() => handleLeaveAction('Approved')}
            color="success"
            variant="contained"
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={addEmployeeDialog}
        onClose={() => setAddEmployeeDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Department"
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Annual Salary"
                  type="number"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Join Date"
                  type="date"
                  value={newEmployee.joinDate}
                  onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newEmployee.status}
                    label="Status"
                    onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="On Leave">On Leave</MenuItem>
                    <MenuItem value="Terminated">Terminated</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddEmployeeDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddEmployee}
            variant="contained"
            disabled={!newEmployee.name || !newEmployee.email}
          >
            Add Employee
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Employees; 