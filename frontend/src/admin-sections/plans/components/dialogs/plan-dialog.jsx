// import { Link } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Alert,
  Button,
  Dialog,
  Divider,
  Snackbar,
  // Tooltip,
  TextField,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
  InputAdornment,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

export default function DownloadReportDialog({
  open,
  onClose,
  mode = 'add',
  planData,
  onSubmitSuccess,
}) {
  const theme = useTheme();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    credits: 0,
    amount: 0,
    pabbly_plan_id: '',
    plan_code: '',
  });

  // Error state for form validation
  const [errors, setErrors] = useState({
    name: '',
    credits: '',
    amount: '',
    pabbly_plan_id: '',
    plan_code: '',
  });

  // Snackbar state for notifications
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };


  // Initialize or reset form data when drawer opens
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && planData) {
        setFormData({
          name: planData.name || '',
          credits: planData.credits || 0,
          amount: planData.amount || 0,
          pabbly_plan_id: planData.pabbly_plan_id || '',
          plan_code: planData.plan_code || '',
        });
      } else {
        // Reset form for new plan
        setFormData({
          name: '',
          credits: 0,
          amount: 0,
          pabbly_plan_id: '',
          plan_code: '',
        });
      }
      // Reset errors
      setErrors({
        name: '',
        credits: '',
        amount: '',
        pabbly_plan_id: '',
        plan_code: '',
      });
    }
  }, [open, mode, planData]);

  // Handle text input changes
  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  // Handle numeric input changes
  const handleNumericChange = (field) => (event) => {
    const value = parseFloat(event.target.value) || 0;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  // Increment/Decrement handlers for numeric fields
  const handleIncrement = (field) => () => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] + 1,
    }));
  };

  const handleDecrement = (field) => () => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] - 1),
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

      // Call the success callback with appropriate message
      onClose();
     
      onSubmitSuccess(
        mode === 'edit' ?  setSnackbarState({
          open: true,
          message: `Plan updated successfully!`,
          severity: 'success',
        }) : setSnackbarState({
          open: true,
          message: `Plan created successfully!`,
          severity: 'success',
        })
      );

  
    }
  };

  // Handle backdrop click

  // Handle snackbar close

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <Box>
          <Box sx={{ position: 'relative', px: 2, py: 3 }}>
            <DialogTitle sx={{ p: 0, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">{mode === 'edit' ? 'Edit Plan' : 'Add Plan'}</Typography>
                {/* <IconButton
                  onClick={onClose}
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  <Iconify icon="eva:close-fill" />
                </IconButton> */}
            </DialogTitle>
          </Box>
          <Divider />
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              <Card>
                {/* Name Field */}
                <Box sx={{ px: 3, pb: 2, mt: 3 }} display="flex" alignItems="center">
                  {/* <Box width="30%">
                <Tooltip title="Enter the plan name" arrow placement="top">
                  <Typography fontWeight={600} variant="body1">
                    Name
                  </Typography>
                </Tooltip>
              </Box> */}
                  <Box width="100%">
                    <TextField
                      label="Name"
                      value={formData.name}
                      onChange={handleChange('name')}
                      error={!!errors.name}
                      // helperText={errors.name}
                      helperText={
                        <span>
                          Enter a unique plan name (e.g. 10M Emails).
                          {/* <Tooltip title="If you have any doubt in this click learn more as it contains the forum Support" arrow placement='top'>
                        <Link href="#" style={{ color: '#078DEE' }} underline="always">
                          Learn more
                        </Link>
                        </Tooltip> */}
                        </span>
                      }
                      placeholder="Enter plan name"
                      fullWidth
                      variant="outlined"
                    />
                  </Box>
                </Box>

                {/* Credits Field */}
                <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
                  {/* <Box width="30%">
                <Tooltip title="Enter number of credits" arrow placement="top">
                  <Typography fontWeight={600} variant="body1">
                    Credits
                  </Typography>
                </Tooltip>
              </Box> */}
                  <Box width="100%">
                    <TextField
                      label="Credits"
                      value={formData.credits}
                      onChange={handleNumericChange('credits')}
                      error={!!errors.credits}
                      // helperText={errors.credits}
                      helperText={
                        <span>
                          Enter total number of email credits that will be allotted in the plan.{' '}
                          {/* <Tooltip title="If you have any doubt in this click learn more as it contains the forum Support" arrow placement='top'>
                        <Link href="#" style={{ color: '#078DEE' }} underline="always">
                          Learn more
                        </Link>
                        </Tooltip> */}
                        </span>
                      }
                      fullWidth
                      type="number"
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Box display="flex" flexDirection="column" sx={{ cursor: 'pointer' }}>
                              <IconButton sx={{ width: 18, height: 18 }}>
                                <Iconify
                                  sx={{ width: 18, height: 18 }}
                                  onClick={handleIncrement('credits')}
                                  icon="icon-park-solid:up-one"
                                />
                              </IconButton>
                              <IconButton sx={{ width: 18, height: 18 }}>
                                <Iconify
                                  sx={{ width: 18, height: 18 }}
                                  onClick={handleDecrement('credits')}
                                  icon="icon-park-solid:down-one"
                                />
                              </IconButton>
                            </Box>
                          </InputAdornment>
                        ),
                        inputProps: { min: 0 },
                      }}
                    />
                  </Box>
                </Box>

                {/* Amount Field */}
                <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
                  {/* <Box width="30%">
                <Tooltip title="Enter amount in dollars" arrow placement="top">
                  <Typography fontWeight={600} variant="body1">
                    Amount ($)
                  </Typography>
                </Tooltip>
              </Box> */}
                  <Box width="100%">
                    <TextField
                      label="Price ($)"
                      value={formData.amount}
                      onChange={handleNumericChange('amount')}
                      error={!!errors.amount}
                      // helperText={errors.amount}
                      helperText={
                        <span>
                          Enter the price at which the plan will be available.{' '}
                          {/* <Tooltip
                          title="If you have any doubt in this click learn more as it contains the forum support."
                          arrow
                          placement="top"
                        >
                          <Link href="#" style={{ color: '#078DEE',paddingLeft:'3px' }} underline="always">
                            Learn more
                          </Link>
                        </Tooltip> */}
                        </span>
                      }
                      fullWidth
                      type="number"
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Box display="flex" flexDirection="column" sx={{ cursor: 'pointer' }}>
                              <IconButton sx={{ width: 18, height: 18 }}>
                                <Iconify
                                  sx={{ width: 18, height: 18 }}
                                  onClick={handleIncrement('credits')}
                                  icon="icon-park-solid:up-one"
                                />
                              </IconButton>
                              <IconButton sx={{ width: 18, height: 18 }}>
                                <Iconify
                                  sx={{ width: 18, height: 18 }}
                                  onClick={handleDecrement('credits')}
                                  icon="icon-park-solid:down-one"
                                />
                              </IconButton>
                            </Box>
                          </InputAdornment>
                        ),
                        inputProps: { min: 0 },
                      }}
                    />
                  </Box>
                </Box>

                {/* Pabbly Plan ID Field */}
                <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
                  <Box width="100%">
                    <TextField
                      label="Plan ID"
                      value={formData.pabbly_plan_id}
                      onChange={handleChange('pabbly_plan_id')}
                      error={!!errors.pabbly_plan_id}
                      // helperText={errors.pabbly_plan_id}
                      helperText={
                        <span>
                          Enter plan ID which you get from Pabbly checkout page (e.g.
                          5c271aac1ba44845cf0e6bd1).
                          {/* <Tooltip
                          title="If you have any doubt in this click learn more as it contains the forum support."
                          arrow
                          placement="top"
                        >
                          <Link href="#" style={{ color: '#078DEE',paddingLeft:'3px' }} underline="always">
                            Learn more
                          </Link>
                        </Tooltip> */}
                        </span>
                      }
                      placeholder="Enter Pabbly Plan ID"
                      fullWidth
                      variant="outlined"
                    />
                  </Box>
                </Box>

                {/* Plan Code Field */}
                <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
                  {/* <Box width="30%">
                <Tooltip title="Enter Plan Code" arrow placement="top">
                  <Typography fontWeight={600} variant="body1">
                    Plan Code
                  </Typography>
                </Tooltip>
              </Box> */}
                  <Box width="100%">
                    <TextField
                      label="Plan Code"
                      value={formData.plan_code}
                      onChange={handleChange('plan_code')}
                      error={!!errors.plan_code}
                      // helperText={errors.plan_code}
                      placeholder="Enter Plan Code"
                      fullWidth
                      variant="outlined"
                      helperText={
                        <span>
                          Enter a unique plan code that corresponds to the plan name (e.g.,
                          10m-emails).
                          {/* <Tooltip
                          title="If you have any doubt in this click learn more as it contains the forum support."
                          arrow
                          placement="top"
                        >
                          <Link href="#" style={{ color: '#078DEE',paddingLeft:'3px' }} underline="always">
                            Learn more
                          </Link>
                        </Tooltip> */}
                        </span>
                      }
                    />
                  </Box>
                </Box>

                {/* Action Buttons */}
                {/* <Box sx={{ px: 3, pb: 3 }} display="flex" justifyContent="flex-end"> */}
                <DialogActions>
                  <Button size="medium" variant="contained" color="primary" onClick={handleSubmit}>
                    {mode === 'edit' ? 'Update' : 'Create'}
                  </Button>
                  <Button variant="outlined" color="inherit" onClick={onClose}>
                  Cancel
                </Button> 
                </DialogActions>
                {/* </Box> */}
              </Card>
            </Box>
          </Box>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbarState.open}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          boxShadow: '0px 8px 16px 0px rgba(145, 158, 171, 0.16)',
          // mx: 9,
          my: 8,
          zIndex: theme.zIndex.modal + 9999,
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarState.severity}
          sx={{
            width: '100%',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary, // Keeping text color consistent
            '& .MuiAlert-icon': {
              color:
                snackbarState.severity === 'error'
                  ? theme.palette.error.main
                  : theme.palette.success.main,
            },
          }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </>
  );
}
