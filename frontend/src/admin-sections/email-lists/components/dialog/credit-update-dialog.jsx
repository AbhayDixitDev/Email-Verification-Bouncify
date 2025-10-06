import { useState } from 'react';
import { useTheme } from '@emotion/react';

import {
  Box,
  Card,
  Alert,
  Radio,
  Button,
  Dialog,
  Tooltip,
  Divider,
  Snackbar,
  TextField,
  Typography,
  RadioGroup,
  DialogTitle,
  DialogActions,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

export default function UpdateCreditsDialog({ open, onClose, rowData }) {
  const [selectedOption, setSelectedOption] = useState('all-results');

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
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

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };

  const handleOptionSelect = (id) => {
    setSelectedOption(id);
  };

  const handleDownload = () => {
    console.log('Downloading option:', selectedOption);

    setSnackbarState({
      open: true,
      message: `Email credits updated successfully`,
      severity: 'success',
    });
    onClose();
  };
  const theme = useTheme();
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <Box>
          <Box sx={{ position: 'relative', px: 2, py: 3 }}>
            <DialogTitle sx={{ p: 0, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Update Credits</Typography>

            </DialogTitle>
          </Box>
          <Divider />
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              <Card>
                <Box sx={{ px: 3, pb: 2, mt: 3 }} display="flex" alignItems="center">
                  
                  <Box width="100%">
                    <RadioGroup
                      row
                      defaultValue="addCredits"
                      value={creditsValue}
                      onChange={handleCreditsChange}
                    >
                      <Tooltip
                        title="Add email credits to the available email credits for the Pabbly customer."
                        arrow
                        placement="top"
                      >
                        <FormControlLabel
                          value="addCredits"
                          control={<Radio size="small" />}
                          label="Add Credits"
                        />
                      </Tooltip>
                      <Tooltip
                        title="Subtract credits from the available email credits for the Pabbly customer."
                        arrow
                        placement="top"
                      >
                        <FormControlLabel
                          value="subtractCredits"
                          control={<Radio size="small" />}
                          label="Subtract Credits"
                        />
                      </Tooltip>
                    </RadioGroup>

                    <TextField
                      sx={{ mt: 3 }}
                      value={creditsFieldValue}
                      onChange={(e) => setCreditsFieldValue(Number(e.target.value))}
                      fullWidth
                      label="Enter Credits"
                      type="number"
                      variant="outlined"
                      helperText={
                        <span>
                          Enter the number of email credits to add or subtract for the Pabbly
                          customer account.{' '}
                        </span>
                      }
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
                  </Box>
                </Box>

                <DialogActions>
                  <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    onClick={handleDownload}
                  >
                    Update
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
