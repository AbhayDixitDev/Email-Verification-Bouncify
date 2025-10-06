import { useTheme } from '@emotion/react';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Alert,
  Drawer,
  Button,
  Divider,
  Tooltip,
  Snackbar,
  MenuItem,
  TextField,
  CardHeader,
  Typography,
  IconButton,
  Backdrop as MuiBackdrop,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

const CustomBackdrop = (props) => (
  <MuiBackdrop
    {...props}
    sx={{ backgroundColor: 'transparent' }}
  />
);

const AddApiDrawer = ({ open, onClose, planData, mode = 'add' }) => {
  const theme = useTheme();
  
  // Form state with updated fields for API account
  const [formData, setFormData] = useState({
    name: '',
    secret_key: '',
    status: 'active'
  });

  // Error state
  const [errors, setErrors] = useState({
    name: '',
    secret_key: '',
    status: ''
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Initialize form data
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && planData) {
        setFormData({
          name: planData.name || '',
          secret_key: planData.secret_key || '',
          status: planData.status || 'active'
        });
      } else {
        setFormData({
          name: '',
          secret_key: '',
          status: 'active'
        });
      }
      setErrors({
        name: '',
        secret_key: '',
        status: ''
      });
    }
  }, [open, mode, planData]);

  // Handle text input changes
  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.secret_key.trim()) {
      newErrors.secret_key = 'Secret Key is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Submitting API account:', formData);
      
      setSnackbar({
        open: true,
        message: mode === 'edit' ? 'API account updated successfully!' : 'API account created successfully!',
        severity: 'success'
      });

      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            width: {
              xs: '100%',
              md: 'auto',
              lg: '1110px',
            },
          },
        }}
        ModalProps={{
          BackdropComponent: CustomBackdrop,
        }}
      >
        <Box
          onClick={handleBackdropClick}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            {mode === 'edit' ? 'Edit API Account' : 'Add New API Account'}
          </Typography>
          <IconButton onClick={onClose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>

        <Box sx={{ mt: 3, flex: 1, overflowY: 'auto' }}>
          <Card>
            <CardHeader 
              title={mode === 'edit' ? `Edit API Account: ${planData?.name}` : 'Add New API Account'}
              sx={{ mb: 3 }}
            />
            <Divider />

            {/* Name Field */}
            <Box sx={{ px: 3, pb: 2, mt: 3 }} display="flex" alignItems="center">
              <Box width="20%">
                <Tooltip title="Enter the API account name" arrow placement="top">
                  <Typography fontWeight={600} variant="body1">
                    Name*
                  </Typography>
                </Tooltip>
              </Box>
              <Box width="80%">
                <TextField
                  value={formData.name}
                  onChange={handleChange('name')}
                  error={!!errors.name}
                  helperText={errors.name}
                  placeholder="Enter API account name"
                  fullWidth
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Secret Key Field */}
            <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
              <Box width="20%">
                <Tooltip title="Enter the secret key" arrow placement="top">
                  <Typography fontWeight={600} variant="body1">
                    Secret Key*
                  </Typography>
                </Tooltip>
              </Box>
              <Box width="80%">
                <TextField
                  value={formData.secret_key}
                  onChange={handleChange('secret_key')}
                  error={!!errors.secret_key}
                  helperText={errors.secret_key}
                  placeholder="Enter secret key"
                  fullWidth
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Status Field */}
            <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
              <Box width="20%">
                <Tooltip title="Select account status" arrow placement="top">
                  <Typography fontWeight={600} variant="body1">
                    Status*
                  </Typography>
                </Tooltip>
              </Box>
              <Box width="80%">
                <TextField
                  select
                  fullWidth
                  value={formData.status}
                  onChange={handleChange('status')}
                  variant="outlined"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* Submit Button */}
            <Box sx={{ px: 3, pb: 3, mt: 3 }} display="flex" justifyContent="flex-start">
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {mode === 'edit' ? 'Update API Account' : 'Create API Account'}
              </Button>
            </Box>
          </Card>
        </Box>
      </Drawer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            '& .MuiAlert-icon': {
              color: snackbar.severity === 'error' 
                ? theme.palette.error.main 
                : theme.palette.success.main,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {open && <CustomBackdrop open={open} onClick={handleBackdropClick} />}
    </>
  );
};

export { AddApiDrawer };