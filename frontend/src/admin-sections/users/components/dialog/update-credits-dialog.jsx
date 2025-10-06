import {
  Box,
  Radio,
  TextField,
  RadioGroup,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { CustomDialog } from 'src/components/custom-dialog/custom-dialog';

export default function AddDialog({
  addDialogOpen,
  handleDialogClose,
  creditsValue,
  setCreditsValue,
  creditsFieldValue,
  setCreditsFieldValue,
  action,
}) {
  const handleCreditsChange = (event) => {
    setCreditsValue(event.target.value);
  };

  const handleIncrement = () => setCreditsFieldValue((prev) => prev + 1);
  const handleDecrement = () => setCreditsFieldValue((prev) => Math.max(1, prev - 1));

  return (
    <CustomDialog
      open={addDialogOpen}
      onClose={handleDialogClose}
      title="Update Credits"
      content={
        <Box display="flex" flexDirection="column" gap={2}>
          <Box sx={{ mb: 3 }} display="flex" alignItems="start">
            <Box width="100%">
              <RadioGroup row value={creditsValue} onChange={handleCreditsChange}>
                <FormControlLabel
                  value="addCredits"
                  control={<Radio size="small" />}
                  label="Add Credits"
                />
                <FormControlLabel
                  value="subtractCredits"
                  control={<Radio size="small" />}
                  label="Subtract Credits"
                />
              </RadioGroup>

              <TextField
                sx={{ mt: 3 }}
                value={creditsFieldValue}
                onChange={(e) => {
                  const {value} = e.target;
                  // If the field is empty, set it to 1
                  if (value === '') {
                    setCreditsFieldValue(1);
                  } else {
                    const numValue = Number(value);
                    // Ensure value is at least 1
                    setCreditsFieldValue(numValue < 1 ? 1 : numValue);
                  }
                }}
                fullWidth
                label="Enter credits"
                type="number"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        sx={{ cursor: 'pointer' }}
                      >
                        <IconButton sx={{ width: '16px', height: '16px' }}>
                          <Iconify
                            sx={{ width: '16px', height: '16px' }}
                            onClick={handleIncrement}
                            icon="icon-park-solid:up-one"
                          />
                        </IconButton>
                        <IconButton sx={{ width: '16px', height: '16px' }}>
                          <Iconify
                            sx={{ width: '16px', height: '16px' }}
                            onClick={handleDecrement}
                            icon="icon-park-solid:down-one"
                          />
                        </IconButton>
                      </Box>
                    </InputAdornment>
                  ),
                  inputProps: {
                    min: 1,
                    // This prevents entering a value less than 1
                    onKeyDown: (e) => {
                      if (e.key === '0' && e.target.value === '') {
                        e.preventDefault();
                      }
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      }
      action={action}
    />
  );
}
