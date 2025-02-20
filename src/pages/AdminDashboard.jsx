import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { auth, db } from '../config/firebase';
import { ref, get, set, remove } from "firebase/database";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ text: '', severity: 'success', show: false });

  const tiers = [
    { value: 'Starter', price: 99 },
    { value: 'Business', price: 299 },
    { value: 'Professional', price: 599 },
    { value: 'Enterprise', price: 'Custom' }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      
      if (snapshot.exists()) {
        const usersData = [];
        snapshot.forEach((childSnapshot) => {
          const userId = childSnapshot.key;
          const userData = childSnapshot.val();
          usersData.push({
            id: userId,
            email: userData.profile?.email || 'N/A',
            createdAt: userData.profile?.createdAt || 'N/A',
            status: userData.profile?.status || 'Active',
            role: userData.profile?.role || 'User',
            lastLogin: userData.profile?.lastLogin || 'Never',
            tier: userData.profile?.tier || 'None',
            tierPrice: userData.profile?.tierPrice || 0
          });
        });
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setAlertMessage({
        text: 'Error loading users',
        severity: 'error',
        show: true
      });
    }
  };

  const handleEditUser = async () => {
    try {
      const userRef = ref(db, `users/${selectedUser.id}/profile`);
      await set(userRef, {
        ...selectedUser,
        updatedAt: new Date().toISOString(),
        tier: selectedUser.tier || 'None',
        tierPrice: selectedUser.tierPrice || 0
      });
      
      setUsers(users.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      ));
      
      setEditDialogOpen(false);
      setAlertMessage({
        text: 'User updated successfully',
        severity: 'success',
        show: true
      });
    } catch (error) {
      console.error('Error updating user:', error);
      setAlertMessage({
        text: 'Error updating user',
        severity: 'error',
        show: true
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const userRef = ref(db, `users/${userId}`);
        await remove(userRef);
        
        setUsers(users.filter(user => user.id !== userId));
        setAlertMessage({
          text: 'User deleted successfully',
          severity: 'success',
          show: true
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        setAlertMessage({
          text: 'Error deleting user',
          severity: 'error',
          show: true
        });
      }
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const userRef = ref(db, `users/${userId}/profile/status`);
      await set(userRef, newStatus);
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      setAlertMessage({
        text: `User ${newStatus.toLowerCase()} successfully`,
        severity: 'success',
        show: true
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      setAlertMessage({
        text: 'Error updating user status',
        severity: 'error',
        show: true
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {alertMessage.show && (
        <Alert 
          severity={alertMessage.severity}
          sx={{ mb: 2 }}
          onClose={() => setAlertMessage({ ...alertMessage, show: false })}
        >
          {alertMessage.text}
        </Alert>
      )}

      <Typography variant="h4" sx={{ mb: 4 }}>
        User Management
      </Typography>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Tier</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role}
                      color={user.role === 'Admin' ? 'secondary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status}
                      color={user.status === 'Active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.tier}
                      color={user.tier !== 'None' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.lastLogin === 'Never' ? 'Never' : 
                      new Date(user.lastLogin).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small"
                      onClick={() => {
                        setSelectedUser(user);
                        setEditDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color={user.status === 'Active' ? 'error' : 'success'}
                      onClick={() => handleStatusChange(
                        user.id, 
                        user.status === 'Active' ? 'Blocked' : 'Active'
                      )}
                    >
                      {user.status === 'Active' ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ 
                  ...selectedUser, 
                  email: e.target.value 
                })}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedUser.role}
                  label="Role"
                  onChange={(e) => setSelectedUser({ 
                    ...selectedUser, 
                    role: e.target.value 
                  })}
                >
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedUser.status}
                  label="Status"
                  onChange={(e) => setSelectedUser({ 
                    ...selectedUser, 
                    status: e.target.value 
                  })}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Blocked">Blocked</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Subscription Tier</InputLabel>
                <Select
                  value={selectedUser.tier || 'None'}
                  label="Subscription Tier"
                  onChange={(e) => {
                    const selectedTier = tiers.find(tier => tier.value === e.target.value);
                    setSelectedUser({ 
                      ...selectedUser, 
                      tier: e.target.value,
                      tierPrice: selectedTier ? selectedTier.price : 0
                    });
                  }}
                >
                  <MenuItem value="None">None</MenuItem>
                  {tiers.map((tier) => (
                    <MenuItem key={tier.value} value={tier.value}>
                      {tier.value} - ${tier.price === 'Custom' ? 'Custom' : tier.price}/month
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedUser.tier !== 'None' && selectedUser.tier !== 'Enterprise' && (
                <Typography variant="body2" color="text.secondary">
                  Current Price: ${selectedUser.tierPrice}/month
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditUser} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminDashboard; 