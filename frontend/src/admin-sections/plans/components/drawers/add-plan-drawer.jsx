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
  TextField,
  CardHeader,
  Typography,
  IconButton,
  InputAdornment,
  Backdrop as MuiBackdrop,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// Custom backdrop component for transparent background
const CustomBackdrop = (props) => (
  <MuiBackdrop
    {...props}
    sx={{ backgroundColor: 'transparent' }}
  />
);

const AddPlanDrawer = ({ open, onClose, planData, mode = 'add' }) => {
  const theme = useTheme();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    credits: 0,
    amount: 0,
    pabbly_plan_id: '',
    plan_code: ''
  });

  // Error state for form validation
  const [errors, setErrors] = useState({
    name: '',
    credits: '',
    amount: '',
    pabbly_plan_id: '',
    plan_code: ''
  });

  // Snackbar state for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Initialize or reset form data when drawer opens
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && planData) {
        setFormData({
          name: planData.name || '',
          credits: planData.credits || 0,
          amount: planData.amount || 0,
          pabbly_plan_id: planData.pabbly_plan_id || '',
          plan_code: planData.plan_code || ''
        });
      } else {
        // Reset form for new plan
        setFormData({
          name: '',
          credits: 0,
          amount: 0,
          pabbly_plan_id: '',
          plan_code: ''
        });
      }
      // Reset errors
      setErrors({
        name: '',
        credits: '',
        amount: '',
        pabbly_plan_id: '',
        plan_code: ''
      });
    }
  }, [open, mode, planData]);

  // Handle text input changes
  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  // Handle numeric input changes
  const handleNumericChange = (field) => (event) => {
    const value = parseFloat(event.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  // Increment/Decrement handlers for numeric fields
  const handleIncrement = (field) => () => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] + 1
    }));
  };

  const handleDecrement = (field) => () => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, prev[field] - 1)
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.credits <= 0) {
      newErrors.credits = 'Credits must be greater than 0';
    }
    
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.pabbly_plan_id.trim()) {
      newErrors.pabbly_plan_id = 'Pabbly Plan ID is required';
    }
    
    if (!formData.plan_code.trim()) {
      newErrors.plan_code = 'Plan Code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Here you would typically make an API call to save/update the plan
      console.log('Submitting form:', formData);
      
      setSnackbar({
        open: true,
        message: mode === 'edit' ? 'Plan updated successfully!' : 'Plan created successfully!',
        severity: 'success'
      });

      // Close drawer after successful submission
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Handle snackbar close
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
            {mode === 'edit' ? 'Edit Plan' : 'Add New Plan'}
          </Typography>
          <IconButton onClick={onClose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>

        <Box sx={{ mt: 3, flex: 1, overflowY: 'auto' }}>
          <Card>
            <CardHeader 
              title={mode === 'edit' ? `Edit Plan: ${planData?.name}` : 'Add New Plan'}
              sx={{ mb: 3 }}
            />
            <Divider />

            {/* Name Field */}
            <Box sx={{ px: 3, pb: 2, mt: 3 }} display="flex" alignItems="center">
              <Box width="20%">
                <Tooltip title="Enter the plan name" arrow placement="top">
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
                  placeholder="Enter plan name"
                  fullWidth
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Credits Field */}
            <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
              <Box width="20%">
                <Tooltip title="Enter number of credits" arrow placement="top">
                  <Typography fontWeight={600} variant="body1">
                    Credits*
                  </Typography>
                </Tooltip>
              </Box>
              <Box width="80%">
                <TextField
                  value={formData.credits}
                  onChange={handleNumericChange('credits')}
                  error={!!errors.credits}
                  helperText={errors.credits}
                  fullWidth
                  type="number"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box display="flex" flexDirection="column" sx={{ cursor: 'pointer' }}>
                          <Iconify 
                            onClick={handleIncrement('credits')} 
                            icon="icon-park-solid:up-one"
                          />
                          <Iconify 
                            onClick={handleDecrement('credits')} 
                            icon="icon-park-solid:down-one"
                          />
                        </Box>
                      </InputAdornment>
                    ),
                    inputProps: { min: 0 }
                  }}
                />
              </Box>
            </Box>

            {/* Amount Field */}
            <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
              <Box width="20%">
                <Tooltip title="Enter amount in dollars" arrow placement="top">
                  <Typography fontWeight={600} variant="body1">
                    Price ($)*
                  </Typography>
                </Tooltip>
              </Box>
              <Box width="80%">
                <TextField
                  value={formData.amount}
                  onChange={handleNumericChange('amount')}
                  error={!!errors.amount}
                  helperText={errors.amount}
                  fullWidth
                  type="number"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box display="flex" flexDirection="column" sx={{ cursor: 'pointer' }}>
                          <Iconify 
                            onClick={handleIncrement('amount')} 
                            icon="icon-park-solid:up-one"
                          />
                          <Iconify 
                            onClick={handleDecrement('amount')} 
                            icon="icon-park-solid:down-one"
                          />
                        </Box>
                      </InputAdornment>
                    ),
                    inputProps: { min: 0 }
                  }}
                />
              </Box>
            </Box>

            {/* Pabbly Plan ID Field */}
            <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
              <Box width="20%">
                <Tooltip title="Enter Pabbly Plan ID" arrow placement="top">
                  <Typography fontWeight={600} variant="body1">
                    Pabbly Plan ID*
                  </Typography>
                </Tooltip>
              </Box>
              <Box width="80%">
                <TextField
                  value={formData.pabbly_plan_id}
                  onChange={handleChange('pabbly_plan_id')}
                  error={!!errors.pabbly_plan_id}
                  helperText={errors.pabbly_plan_id}
                  placeholder="Enter Pabbly Plan ID"
                  fullWidth
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Plan Code Field */}
            <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
              <Box width="20%">
                <Tooltip title="Enter Plan Code" arrow placement="top">
                  <Typography fontWeight={600} variant="body1">
                    Plan Code*
                  </Typography>
                </Tooltip>
              </Box>
              <Box width="80%">
                <TextField
                  value={formData.plan_code}
                  onChange={handleChange('plan_code')}
                  error={!!errors.plan_code}
                  helperText={errors.plan_code}
                  placeholder="Enter Plan Code"
                  fullWidth
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ px: 3, pb: 3, mt: 3 }} display="flex" justifyContent="flex-start">
             
              <Button
              size='medium'
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {mode === 'edit' ? 'Update Plan' : 'Create Plan'}
              </Button>
            </Box>
          </Card>
        </Box>
      </Drawer>

      {/* Snackbar for notifications */}
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

export { AddPlanDrawer };