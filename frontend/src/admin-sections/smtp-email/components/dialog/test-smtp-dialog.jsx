import { useTheme } from '@emotion/react';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Alert,
  Button,
  Dialog,
  Divider,
  Snackbar,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
} from '@mui/material';

export default function TestSmtpDialog({
  open,
  onClose,
  mode = 'add',
  initialData = null,
  onSubmitSuccess,
}) {
  const [formData, setFormData] = useState({
    email: '',
  });

  const [errors, setErrors] = useState({
    email: '',
  });
  const theme = useTheme();

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
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTest = async () => {
    if (validateForm()) {
      onClose();
      const success = Math.random() < 0.5; // 50% chance of success for demonstration

      if (success) {
        setSnackbarState({
          open: true,
          message: 'Test email sent successfully! Your SMTP configuration is working as expected.',
          severity: 'success',
        });
      } else {
        setSnackbarState({
          open: true,
          message: 'Test email failed to send. Please check your SMTP settings and try again.',
          severity: 'error',
        });
      }
    }
  };

  useEffect(() => {
    if (open) {
      setFormData({
        email: '',
      });
      setErrors({
        email: '',
      });
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <Box>
          <Box sx={{ position: 'relative', px: 2, py: 3 }}>
            <DialogTitle sx={{ p: 0, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Test SMTP</Typography>
            </DialogTitle>
          </Box>
          <Divider />
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Card>
              <Box sx={{ px: 3, pb: 2, mt: 3 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    required
                    type="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    error={!!errors.email}
                    helperText={errors.email || "Enter your email address to receive a test email and confirm SMTP functionality. E.g. hardik@pabbly.com"}
                    placeholder="Enter email address"
                    fullWidth
                    variant="outlined"
                  />
                </Box>
              </Box>
              <DialogActions>
                <Button size="medium" variant="contained" color="primary" onClick={handleTest}>
                  Send Test Email
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