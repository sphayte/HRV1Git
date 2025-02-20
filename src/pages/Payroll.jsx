import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Tabs,
  Tab
} from '@mui/material';
import {
  AttachMoney,
  CalendarToday,
  Download,
  FilterList,
  Search,
  Add,
  Warning,
  Delete,
  People,
  Schedule,
  Payments
} from '@mui/icons-material';
import { saveAs } from 'file-saver';
import Header from '../components/Header';

function Payroll() {
  const [payrollRecords, setPayrollRecords] = useState([
    {
      id: 1,
      employeeName: 'John Doe',
      period: '2024-02-01 to 2024-02-15',
      grossPay: 3000,
      netPay: 2400,
      status: 'Paid',
      paymentDate: '2024-02-15'
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      period: '2024-02-01 to 2024-02-15',
      grossPay: 3500,
      netPay: 2800,
      status: 'Processing',
      paymentDate: '2024-02-15'
    }
  ]);

  const [payrollFilter, setPayrollFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [batchStatusDialog, setBatchStatusDialog] = useState(false);
  const [payrollDialog, setPayrollDialog] = useState(false);
  const [payrollData, setPayrollData] = useState({
    startDate: '',
    endDate: '',
    paymentDate: '',
    description: '',
    periodType: 'weekly'
  });

  const [activeTab, setActiveTab] = useState(0);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [paymentData, setPaymentData] = useState({
    employeeId: null,
    employeeName: '',
    currentPay: 0,
    newPay: 0,
    reason: '',
    effectiveDate: '',
    type: 'raise' // or 'demotion'
  });

  const [paymentMethodDialog, setPaymentMethodDialog] = useState(false);
  const [paymentMethodData, setPaymentMethodData] = useState({
    employeeId: null,
    employeeName: '',
    method: 'direct_deposit', // 'direct_deposit', 'cash', 'paypal'
    accountInfo: {
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      paypalEmail: '',
      notes: ''
    }
  });

  const stats = {
    totalPayroll: payrollRecords.reduce((sum, record) => sum + record.grossPay, 0),
    pendingPayments: payrollRecords.filter(record => record.status === 'Processing').length,
    nextPayday: '2024-02-29',
    lastProcessed: '2024-02-15'
  };

  const calculateNextPayday = () => {
    const today = new Date();
    const nextPayday = new Date(today.getFullYear(), today.getMonth(), 15);
    
    if (today.getDate() > 15) {
      nextPayday.setMonth(nextPayday.getMonth() + 1);
    }
    
    return nextPayday.toISOString().split('T')[0];
  };

  const calculatePayPeriod = (startDate, periodType) => {
    const start = new Date(startDate);
    const end = new Date(startDate);
    
    switch (periodType) {
      case 'weekly':
        end.setDate(start.getDate() + 6);
        break;
      case 'biweekly':
        end.setDate(start.getDate() + 13);
        break;
      case 'monthly':
        end.setDate(1);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0); // Last day of the month
        break;
      default:
        break;
    }
    
    // Calculate payment date (typically last day of period)
    const paymentDate = new Date(end);
    
    return {
      endDate: end.toISOString().split('T')[0],
      paymentDate: paymentDate.toISOString().split('T')[0]
    };
  };

  const getFilteredRecords = () => {
    return payrollRecords
      .filter(record => 
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(record => {
        if (payrollFilter === 'pending') return record.status === 'Processing';
        if (payrollFilter === 'paid') return record.status === 'Paid';
        return true;
      });
  };

  const exportToCSV = () => {
    const headers = [
      'Employee Name',
      'Pay Period',
      'Gross Pay',
      'Net Pay',
      'Status',
      'Payment Date'
    ].join(',');

    const csvRows = getFilteredRecords().map(record => {
      return [
        record.employeeName,
        record.period,
        `$${record.grossPay}`,
        `$${record.netPay}`,
        record.status,
        record.paymentDate
      ].join(',');
    });

    const csvContent = [headers, ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const fileName = `payroll_report_${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, fileName);
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    setPayrollRecords(prevRecords => 
      prevRecords.filter(record => record.id !== employeeToDelete.id)
    );
    setDeleteConfirmOpen(false);
    setEmployeeToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setEmployeeToDelete(null);
  };

  const handleStatusClick = (record) => {
    setSelectedRecord(record);
    setStatusDialog(true);
  };

  const handleStatusChange = (newStatus) => {
    setPayrollRecords(prevRecords => 
      prevRecords.map(record => 
        record.id === selectedRecord.id 
          ? { ...record, status: newStatus }
          : record
      )
    );
    setStatusDialog(false);
    setSelectedRecord(null);
  };

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      }
      return [...prev, employeeId];
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedEmployees(getFilteredRecords().map(record => record.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleBatchStatusChange = (newStatus) => {
    setPayrollRecords(prevRecords => 
      prevRecords.map(record => 
        selectedEmployees.includes(record.id)
          ? { ...record, status: newStatus }
          : record
      )
    );
    setBatchStatusDialog(false);
    setSelectedEmployees([]);
  };

  const handleCreatePayroll = () => {
    setPayrollDialog(true);
  };

  const handlePayrollSubmit = () => {
    const newRecords = selectedEmployees.map(id => {
      const employee = payrollRecords.find(r => r.id === id);
      return {
        ...employee,
        period: `${payrollData.startDate} to ${payrollData.endDate}`,
        paymentDate: payrollData.paymentDate,
        status: 'Processing',
        periodType: payrollData.periodType
      };
    });

    setPayrollRecords(prevRecords => 
      prevRecords.map(record => 
        selectedEmployees.includes(record.id) ? 
          newRecords.find(r => r.id === record.id) : 
          record
      )
    );
    
    setPayrollDialog(false);
    setPayrollData({
      startDate: '',
      endDate: '',
      paymentDate: '',
      description: '',
      periodType: 'weekly'
    });
    setSelectedEmployees([]);
  };

  const handlePaymentChange = (employee) => {
    setPaymentData({
      employeeId: employee.id,
      employeeName: employee.employeeName,
      currentPay: employee.grossPay,
      newPay: employee.grossPay,
      reason: '',
      effectiveDate: '',
      type: 'raise'
    });
    setPaymentDialog(true);
  };

  const handlePaymentSubmit = () => {
    setPayrollRecords(prevRecords => 
      prevRecords.map(record => 
        record.id === paymentData.employeeId
          ? { ...record, grossPay: paymentData.newPay }
          : record
      )
    );
    setPaymentDialog(false);
    setPaymentData({
      employeeId: null,
      employeeName: '',
      currentPay: 0,
      newPay: 0,
      reason: '',
      effectiveDate: '',
      type: 'raise'
    });
  };

  const handlePaymentMethodChange = (employee) => {
    setPaymentMethodData({
      employeeId: employee.id,
      employeeName: employee.employeeName,
      method: employee.paymentMethod || 'direct_deposit',
      accountInfo: employee.accountInfo || {
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        paypalEmail: '',
        notes: ''
      }
    });
    setPaymentMethodDialog(true);
  };

  const handlePaymentMethodSubmit = () => {
    setPayrollRecords(prevRecords => 
      prevRecords.map(record => 
        record.id === paymentMethodData.employeeId
          ? { 
              ...record, 
              paymentMethod: paymentMethodData.method,
              accountInfo: paymentMethodData.accountInfo
            }
          : record
      )
    );
    setPaymentMethodDialog(false);
  };

  return (
    <Box>
      <Header />
      <Box sx={{ mt: 2 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Payroll Management</Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Payroll
                </Typography>
                <Typography variant="h4">
                  ${stats.totalPayroll.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Current pay period
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Next Payday
                </Typography>
                <Typography variant="h4">
                  {stats.nextPayday}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {stats.pendingPayments} payments pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Last Processed
                </Typography>
                <Typography variant="h4">
                  {stats.lastProcessed}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total: ${payrollRecords
                    .filter(r => r.paymentDate === stats.lastProcessed)
                    .reduce((sum, r) => sum + r.grossPay, 0)
                    .toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Processing Status
                </Typography>
                <Typography variant="h4">
                  {Math.round((payrollRecords.filter(r => r.status === 'Paid').length / 
                    payrollRecords.length) * 100)}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {payrollRecords.filter(r => r.status === 'Processing').length} pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab icon={<Schedule />} label="Pay Schedules" />
          <Tab icon={<Payments />} label="Payment Management" />
          <Tab icon={<People />} label="Employee Payroll" />
        </Tabs>

        {activeTab === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Pay Schedule Overview</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary">Weekly</Typography>
                    <Typography variant="h5">
                      {payrollRecords.filter(r => r.periodType === 'weekly').length} Employees
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary">Bi-Weekly</Typography>
                    <Typography variant="h5">
                      {payrollRecords.filter(r => r.periodType === 'biweekly').length} Employees
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary">Monthly</Typography>
                    <Typography variant="h5">
                      {payrollRecords.filter(r => r.periodType === 'monthly').length} Employees
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        )}

        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Payment Adjustments</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Current Pay</TableCell>
                    <TableCell>Pay Schedule</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payrollRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.employeeName}</TableCell>
                      <TableCell>${record.grossPay}</TableCell>
                      <TableCell>{record.periodType || 'Not Set'}</TableCell>
                      <TableCell>
                        <Chip
                          label={record.paymentMethod?.replace('_', ' ').toUpperCase() || 'Not Set'}
                          color={
                            record.paymentMethod === 'direct_deposit' ? 'success' :
                            record.paymentMethod === 'paypal' ? 'info' :
                            record.paymentMethod === 'cash' ? 'warning' : 'default'
                          }
                          size="small"
                          onClick={() => handlePaymentMethodChange(record)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handlePaymentChange(record)}
                          >
                            Adjust Pay
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handlePaymentMethodChange(record)}
                          >
                            Payment Method
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {activeTab === 2 && (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                placeholder="Search payroll records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 300 }}
              />
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={payrollFilter}
                  label="Filter"
                  onChange={(e) => setPayrollFilter(e.target.value)}
                >
                  <MenuItem value="all">All Records</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                </Select>
              </FormControl>
              {selectedEmployees.length > 0 && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setBatchStatusDialog(true)}
                  >
                    Update Status ({selectedEmployees.length})
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCreatePayroll}
                    startIcon={<AttachMoney />}
                  >
                    Create Payroll ({selectedEmployees.length})
                  </Button>
                </>
              )}
              <Button 
                startIcon={<Download />}
                onClick={exportToCSV}
                variant="contained"
              >
                Export CSV
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedEmployees.length > 0 && 
                          selectedEmployees.length < getFilteredRecords().length
                        }
                        checked={
                          getFilteredRecords().length > 0 && 
                          selectedEmployees.length === getFilteredRecords().length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Employee</TableCell>
                    <TableCell>Pay Period</TableCell>
                    <TableCell>Gross Pay</TableCell>
                    <TableCell>Net Pay</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredRecords().map((record) => (
                    <TableRow key={record.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedEmployees.includes(record.id)}
                          onChange={() => handleSelectEmployee(record.id)}
                        />
                      </TableCell>
                      <TableCell>{record.employeeName}</TableCell>
                      <TableCell>{record.period}</TableCell>
                      <TableCell>${record.grossPay}</TableCell>
                      <TableCell>${record.netPay}</TableCell>
                      <TableCell>
                        <Chip
                          label={record.status}
                          color={record.status === 'Paid' ? 'success' : 'warning'}
                          size="small"
                          onClick={() => handleStatusClick(record)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell>{record.paymentDate}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small">
                            <Download />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteClick(record)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>Confirm Removal</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to remove {employeeToDelete?.employeeName} from payroll?
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
            >
              Remove
            </Button>
          </DialogActions>
        </Dialog>

        {/* Status Change Dialog */}
        <Dialog
          open={statusDialog}
          onClose={() => setStatusDialog(false)}
        >
          <DialogTitle>Change Payment Status</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Update payment status for {selectedRecord?.employeeName}
            </DialogContentText>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant={selectedRecord?.status === 'Processing' ? 'outlined' : 'contained'}
                color="warning"
                onClick={() => handleStatusChange('Processing')}
                fullWidth
              >
                Processing
              </Button>
              <Button 
                variant={selectedRecord?.status === 'Paid' ? 'outlined' : 'contained'}
                color="success"
                onClick={() => handleStatusChange('Paid')}
                fullWidth
              >
                Paid
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Batch Status Dialog */}
        <Dialog
          open={batchStatusDialog}
          onClose={() => setBatchStatusDialog(false)}
        >
          <DialogTitle>Update Payment Status</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Update status for {selectedEmployees.length} selected employees
            </DialogContentText>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="contained"
                color="warning"
                onClick={() => handleBatchStatusChange('Processing')}
                fullWidth
              >
                Mark as Processing
              </Button>
              <Button 
                variant="contained"
                color="success"
                onClick={() => handleBatchStatusChange('Paid')}
                fullWidth
              >
                Mark as Paid
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBatchStatusDialog(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Payroll Creation Dialog */}
        <Dialog
          open={payrollDialog}
          onClose={() => setPayrollDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New Payroll</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Create payroll for {selectedEmployees.length} selected employees
            </DialogContentText>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Pay Period Type</InputLabel>
                <Select
                  value={payrollData.periodType}
                  label="Pay Period Type"
                  onChange={(e) => {
                    const newPeriodType = e.target.value;
                    setPayrollData(prev => {
                      const newData = { ...prev, periodType: newPeriodType };
                      if (prev.startDate) {
                        const { endDate, paymentDate } = calculatePayPeriod(prev.startDate, newPeriodType);
                        newData.endDate = endDate;
                        newData.paymentDate = paymentDate;
                      }
                      return newData;
                    });
                  }}
                >
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="biweekly">Bi-Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Start Date"
                type="date"
                value={payrollData.startDate}
                onChange={(e) => {
                  const startDate = e.target.value;
                  setPayrollData(prev => {
                    const { endDate, paymentDate } = calculatePayPeriod(startDate, prev.periodType);
                    return {
                      ...prev,
                      startDate,
                      endDate,
                      paymentDate
                    };
                  });
                }}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
              
              <TextField
                label="End Date"
                type="date"
                value={payrollData.endDate}
                InputLabelProps={{ shrink: true }}
                fullWidth
                disabled
              />
              
              <TextField
                label="Payment Date"
                type="date"
                value={payrollData.paymentDate}
                onChange={(e) => setPayrollData({ ...payrollData, paymentDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
              
              <TextField
                label="Description"
                value={payrollData.description}
                onChange={(e) => setPayrollData({ ...payrollData, description: e.target.value })}
                multiline
                rows={2}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPayrollDialog(false)}>Cancel</Button>
            <Button 
              onClick={handlePayrollSubmit}
              variant="contained"
              disabled={!payrollData.startDate || !payrollData.endDate || !payrollData.paymentDate}
            >
              Create Payroll
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payment Adjustment Dialog */}
        <Dialog
          open={paymentDialog}
          onClose={() => setPaymentDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Adjust Payment for {paymentData.employeeName}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Adjustment Type</InputLabel>
                <Select
                  value={paymentData.type}
                  label="Adjustment Type"
                  onChange={(e) => setPaymentData({ ...paymentData, type: e.target.value })}
                >
                  <MenuItem value="raise">Raise</MenuItem>
                  <MenuItem value="demotion">Demotion</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Current Pay"
                type="number"
                value={paymentData.currentPay}
                disabled
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />

              <TextField
                label="New Pay"
                type="number"
                value={paymentData.newPay}
                onChange={(e) => setPaymentData({ ...paymentData, newPay: Number(e.target.value) })}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />

              <TextField
                label="Effective Date"
                type="date"
                value={paymentData.effectiveDate}
                onChange={(e) => setPaymentData({ ...paymentData, effectiveDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />

              <TextField
                label="Reason"
                multiline
                rows={3}
                value={paymentData.reason}
                onChange={(e) => setPaymentData({ ...paymentData, reason: e.target.value })}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPaymentDialog(false)}>Cancel</Button>
            <Button 
              onClick={handlePaymentSubmit}
              variant="contained"
              color={paymentData.type === 'raise' ? 'success' : 'error'}
              disabled={!paymentData.newPay || !paymentData.effectiveDate || !paymentData.reason}
            >
              {paymentData.type === 'raise' ? 'Approve Raise' : 'Confirm Demotion'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payment Method Dialog */}
        <Dialog
          open={paymentMethodDialog}
          onClose={() => setPaymentMethodDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Payment Method for {paymentMethodData.employeeName}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethodData.method}
                  label="Payment Method"
                  onChange={(e) => setPaymentMethodData({ 
                    ...paymentMethodData, 
                    method: e.target.value,
                    accountInfo: { ...paymentMethodData.accountInfo }
                  })}
                >
                  <MenuItem value="direct_deposit">Direct Deposit</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                </Select>
              </FormControl>

              {paymentMethodData.method === 'direct_deposit' && (
                <>
                  <TextField
                    label="Bank Name"
                    value={paymentMethodData.accountInfo.bankName}
                    onChange={(e) => setPaymentMethodData({
                      ...paymentMethodData,
                      accountInfo: { ...paymentMethodData.accountInfo, bankName: e.target.value }
                    })}
                    required
                  />
                  <TextField
                    label="Account Number"
                    value={paymentMethodData.accountInfo.accountNumber}
                    onChange={(e) => setPaymentMethodData({
                      ...paymentMethodData,
                      accountInfo: { ...paymentMethodData.accountInfo, accountNumber: e.target.value }
                    })}
                    required
                    type="password"
                  />
                  <TextField
                    label="Routing Number"
                    value={paymentMethodData.accountInfo.routingNumber}
                    onChange={(e) => setPaymentMethodData({
                      ...paymentMethodData,
                      accountInfo: { ...paymentMethodData.accountInfo, routingNumber: e.target.value }
                    })}
                    required
                    type="password"
                  />
                </>
              )}

              {paymentMethodData.method === 'paypal' && (
                <TextField
                  label="PayPal Email"
                  value={paymentMethodData.accountInfo.paypalEmail}
                  onChange={(e) => setPaymentMethodData({
                    ...paymentMethodData,
                    accountInfo: { ...paymentMethodData.accountInfo, paypalEmail: e.target.value }
                  })}
                  required
                  type="email"
                />
              )}

              <TextField
                label="Additional Notes"
                value={paymentMethodData.accountInfo.notes}
                onChange={(e) => setPaymentMethodData({
                  ...paymentMethodData,
                  accountInfo: { ...paymentMethodData.accountInfo, notes: e.target.value }
                })}
                multiline
                rows={2}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPaymentMethodDialog(false)}>Cancel</Button>
            <Button 
              onClick={handlePaymentMethodSubmit}
              variant="contained"
              disabled={
                (paymentMethodData.method === 'direct_deposit' && 
                  (!paymentMethodData.accountInfo.bankName || 
                   !paymentMethodData.accountInfo.accountNumber || 
                   !paymentMethodData.accountInfo.routingNumber)) ||
                (paymentMethodData.method === 'paypal' && 
                  !paymentMethodData.accountInfo.paypalEmail)
              }
            >
              Save Payment Method
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Payroll; 