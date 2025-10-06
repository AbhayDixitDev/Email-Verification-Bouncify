// import { Link } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Alert,
  Radio,
  Drawer,
  Button,
  Divider,
  Snackbar,
  TextField,
  CardHeader,
  Typography,
  IconButton,
  RadioGroup,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';

import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import StatsCards from 'src/components/stats-card/stats-card';

// Custom backdrop component
// const CustomBackdrop = (props) => (
//   <MuiBackdrop
//     {...props}
//     sx={{ backgroundColor: 'red' }} // Make the backdrop transparent
//   />
// );

const CustomerDetailsDrawer = ({
  open,
  onClose,
  userName,
  userEmail,
  userStatus,
  onStatusChange,
}) => {
  const theme = useTheme();
  const [currentStatus, setCurrentStatus] = useState(userStatus);

  const handleBackdropClick = (event) => {
    // Prevent clicks inside the drawer from closing it
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const [creditsValue, setCreditsValue] = useState('addCredits');
  const handleCreditsChange = (event) => {
    const newcreditsValue = event.target.value;
    setCreditsValue(newcreditsValue);
    // Log the selected value
  };
  const [creditsFieldValue, setCreditsFieldValue] = useState(0);
  const handleCreditsFieldChange = (event) => {
    const newcreditsFieldValue = event.target.value;
    setCreditsFieldValue(newcreditsFieldValue);
    // Log the selected value
  };

  const handleIncrement = () => setCreditsFieldValue((prev) => prev + 1);
  const handleDecrement = () => setCreditsFieldValue((prev) => Math.max(0, prev - 1));
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };

  const handleUpdateCredits = (event) => {
    event.preventDefault(); // Prevent form submission
    if (creditsValue === 'addCredits') {
      setSnackbarState({
        open: true,
        message: `${creditsFieldValue} credits added to the account successfully!`,
        severity: 'success',
      });
      // Log the value
    } else {
      setSnackbarState({
        open: true,
        message: `${creditsFieldValue} credits subtracted from the account successfully!`,
        severity: 'success',
      });
    }
  };

  useEffect(() => {
    if (userStatus) {
      setCurrentStatus(userStatus);
    }
  }, [userStatus, open]);

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setCurrentStatus(newStatus);
    // Notify parent component of status change
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };
  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

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
              lg: '40%',
            }, // Adjust width as needed
          },
        }}
        // ModalProps={{
        //   BackdropComponent: CustomBackdrop, // Use the custom backdrop
        // }}
      >
        <Box
          onClick={handleBackdropClick} // Handle clicks outside the drawer
          display="flex"
          justifyContent="Space-between"
        >
          <Typography variant="h6">Customer Details</Typography>
          <IconButton
            onClick={onClose}
            // sx={{ top: 12, left: 12, zIndex: 9, position: 'unset' }}
          >
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>
        <Box
          sx={{
            mt: 3,

            gap: 3,
            display: 'grid',
            flexWrap: 'wrap',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        >
          <StatsCards
            cardtitle="Email Credits Remaining"
            cardstats="10,000"
            icon_name="email-consumed.svg"
            icon_color="#FFA92E"
            bg_gradient="#FFA92E"
            tooltip="Total number of email credits remaining for this customer."
          />
          <StatsCards
            cardtitle="Email Credits Consumed"
            cardstats="0"
            icon_name="email-remaning.svg"
            icon_color="#28A645"
            bg_gradient="#28A645"
            tooltip="Total number of email credits consumed by this customer."
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardHeader title="Customer" sx={{ mb: 3 }} />

            <Divider />
            <Form onSubmit={handleUpdateCredits}>
              {/* <Box sx={{ px: 3, pb: 2, mt: 3 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    disabled
                    label="Customer's Name"
                    value="John Doe"
                    fullWidth
                    type="text"
                    variant="outlined"
               
                  />
                </Box>
              </Box> */}
              <Box sx={{ px: 3, pb: 2, mt: 3 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    disabled
                    label="Pabbly Customer's Email"
                    value={userEmail}
                    fullWidth
                    type="text"
                    variant="outlined"
               
                  />
                </Box>
              </Box>
              <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    disabled
                    label="Pabbly Account #"
                    value="676ddfb8ce0a45054ec43"
                    fullWidth
                    type="text"
                    variant="outlined"
              
                  />
                </Box>
              </Box>
              <Box sx={{ px: 3, pb: 2 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    disabled
                    label="Pabbly Customer #"
                    value="676de04b83abc741fcc9"
                    fullWidth
                    type="text"
                    variant="outlined"
               
                  />
                </Box>
              </Box>
              {/* <Box sx={{ px: 3, pb: 2, mb: 2 }} display="flex" alignItems="center">
                <Box width="100%">
                  <TextField
                    disabled
                    label="Status"
                    select
                    fullWidth
                    value={currentStatus}
                    onChange={handleStatusChange}
                    variant="outlined"
               
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                </Box>
              </Box> */}
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ px: 3, mb: 4 }}>
                <Typography variant="h6" sx={{ pb: 2 }}>Update Email Credits</Typography>
                <RadioGroup
                  row
                  defaultValue="addCredits"
                  value={creditsValue}
                  onChange={handleCreditsChange}
                >
                  <FormControlLabel
                    value="addCredits"
                    control={<Radio size="small" />}
                    label="Add Credits"
                  />
                  <FormControlLabel
                    value="subtractCredits"
                    control={<Radio size="small" />}
                    label="Deduct Credits"
                  />
                </RadioGroup>
                <Form onSubmit={handleUpdateCredits}>
                  <TextField
                    sx={{ mt: 3 }}
                    value={creditsFieldValue}
                    onChange={(e) => setCreditsFieldValue(Number(e.target.value))}
                    fullWidth
                    label="Enter Email credits"
                    type="number"
                    variant="outlined"
                    helperText='Enter the number of email credits to add or deduct for the Pabbly customer account.'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            sx={{ cursor: 'pointer' }}
                          >
                            <Iconify onClick={handleIncrement} icon="icon-park-solid:up-one" />
                            <Iconify onClick={handleDecrement} icon="icon-park-solid:down-one" />
                          </Box>
                        </InputAdornment>
                      ),
                      inputProps: { min: 0 },
                    }}
                  />
                  <Button
                    sx={{ mt: 3 }}
                    variant="contained"
                    color="primary"
                    type="submit" // Ensures the form's onSubmit is triggered
                  >
                    Update
                  </Button>
                </Form>
              </Box>
       
            </Form>
          </Card>
        </Box>


      </Drawer>
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={{
          boxShadow: '0px 8px 16px 0px rgba(145, 158, 171, 0.16)',
          mx: 9,
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
};

export { CustomerDetailsDrawer };
