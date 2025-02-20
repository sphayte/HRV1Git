import React, { useState } from 'react';
import {
  // AppBar,
  // Toolbar,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import { NotificationsOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';

function Header() {
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  return (
    // Removed AppBar to eliminate the top bar
    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
      {/* Logo/Brand - Left side */}
      <Box onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
        HR Compliance Hub
      </Box>

      {/* Actions - Right side */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Notifications */}
        <IconButton
          color="inherit"
          onClick={handleNotificationClick}
        >
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsOutlined />
          </Badge>
        </IconButton>

        {/* Notifications Menu */}
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
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <MenuItem 
                key={notification.id}
                onClick={handleNotificationClose}
                sx={{
                  maxWidth: 320,
                  whiteSpace: 'normal'
                }}
              >
                <Box>
                  <Box sx={{ fontWeight: 'bold' }}>{notification.title}</Box>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    {notification.message}
                  </Box>
                </Box>
              </MenuItem>
            ))
          ) : (
            <MenuItem onClick={handleNotificationClose}>
              No new notifications
            </MenuItem>
          )}
        </Menu>
      </Box>
    </Box>
  );
}

export default Header;