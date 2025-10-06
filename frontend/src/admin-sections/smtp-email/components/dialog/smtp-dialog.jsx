import { useTheme } from '@emotion/react';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Alert,
  Button,
  Dialog,
  Divider,
  MenuItem,
  Snackbar,
  TextField,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';

export default function AddSmtpDialog({
  open,
  onClose,
  mode = 'add',
  initialData = null,
  onSubmitSuccess,
}) {
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];
  const encryptionOptions = [
    { value: 'none', label: 'NONE' },
    { value: 'tls', label: 'TLS' },
    { value: 'ssl', label: 'SSL' },
  ];

  const [formData, setFormData] = useState({
    smtp: 'gmail',
    name: '',
    encryption_method: 'none',
    status: 'active',
    host: '',
    port: '',
    username: '',
    password: '',
  });

  const password = useBoolean();
  const [errors, setErrors] = useState({
    host: '',
    port: '',
    username: '',
    password: '',
  });
  const theme = useTheme();

  useEffect(() => {
    console.log('initialData:', initialData);
    if (open) {
      if (mode === 'edit' && initialData) {
        const newFormData = {
          smtp: initialData.smtp || 'gmail',
          name: initialData.name || '',
          encryption_method: 'none',
          status: 'active',
          host: initialData.host || '',
          port: initialData.port || '',
          username: initialData.username || '',
          password: 'shdgjahsglklakg',
        };
        console.log('Setting formData in edit mode:', newFormData);
        setFormData(newFormData);
      } else {
        setFormData({
          smtp: 'gmail',
          name: '',
          encryption_method: 'none',
          status: 'active',
          host: '',
          port: '',
          username: '',
          password: '',
        });
      }
      setErrors({
        host: '',
        port: '',
        username: '',
        password: '',
      });
    }
  }, [open, mode, initialData]);

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (field in errors) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.host.trim()) newErrors.host = 'SMTP Hostname is required';
    if (!formData.port.trim()) newErrors.port = 'SMTP Port is required';
    if (!formData.username.trim()) newErrors.username = 'SMTP Username is required';
    if (!formData.password.trim()) newErrors.password = 'SMTP Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Submitting form:', formData);
      onClose();
      onSubmitSuccess(
        mode === 'edit'
          ? setSnackbarState({
              open: true,
              message: `SMTP updated successfully!`,
              severity: 'success',
            })
          : setSnackbarState({
              open: true,
              message: `SMTP created successfully!`,
              severity: 'success',
            })
      );
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <Box>
          <Box sx={{ position: 'relative', px: 2, py: 3 }}>
            <DialogTitle sx={{ p: 0, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">{mode === 'edit' ? 'Update SMTP' : 'Add SMTP'}</Typography>
            </DialogTitle>
          </Box>
          <Divider />
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Card>
              <Box sx={{ px: 3, pb: 2, mt: 3 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    label="SMTP Hostname"
                    value={formData.host}
                    onChange={handleChange('host')}
                    error={!!errors.host}
                    helperText={
                      errors.host ||
                      'Enter SMTP hostname details. E.g. smtp.gmail.com, smtp.mail.yahoo.com'
                    }
                    placeholder="Enter SMTP hostname."
                    fullWidth
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    label="SMTP Port"
                    value={formData.port}
                    onChange={handleChange('port')}
                    error={!!errors.port}
                    helperText={errors.port || 'Enter SMTP port number.'}
                    placeholder="Enter the SMTP port number. E.g. 25, 465, 587 and 2525"
                    fullWidth
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    label="Encryption Method"
                    placeholder="Encryption Method"
                    select
                    fullWidth
                    helperText={
                      <span>
                        Select the encryption method used by the SMTP server. E.g. Use TLS with port
                        587, SSL with port 465.
                      </span>
                    }
                    value={formData.encryption_method}
                    onChange={handleChange('encryption_method')}
                    variant="outlined"
                  >
                    {encryptionOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Box>
              <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    label="SMTP Username"
                    value={formData.username}
                    onChange={handleChange('username')}
                    error={!!errors.username}
                    helperText={errors.username || 'Enter SMTP username.'}
                    placeholder="Enter the SMTP username. E.g. your-email@gmail.com, your-email@domain.com"
                    fullWidth
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    label="Password"
                    value={formData.password}
                    onChange={handleChange('password')}
                    error={!!errors.password}
                    helperText={errors.password || 'Enter the SMTP password.'}
                    type={password.value ? 'text' : 'password'}
                    placeholder="Enter your SMTP password"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={password.onToggle} edge="end">
                            <Iconify
                              icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    label="SMTP Status"
                    placeholder="Select the SMTP status."
                    select
                    fullWidth
                    helperText={
                      <span>
                        Active means the SMTP will be used for sending email notifications, while
                        Inactive means the SMTP will not be used for sending email notifications.
                      </span>
                    }
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
              <DialogActions>
                <Button size="medium" variant="contained" color="primary" onClick={handleSubmit}>
                  {mode === 'edit' ? 'Update' : 'Save'}
                </Button>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                  Close
                </Button>
              </DialogActions>
            </Card>
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
            color: theme.palette.text.primary,
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
