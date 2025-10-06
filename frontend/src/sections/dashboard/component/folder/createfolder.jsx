import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { useState, useEffect } from 'react';

import {
  Box,
  Dialog,
  Button,
  Divider,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

export function CreateFolderDialog({ title, content, action, open, onClose, ...other }) {
  const [listName, setListName] = useState('');
  const [error, setError] = useState(false);
  const theme = useTheme();
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'));
  const dialog = useBoolean();

  // Change initial state to 'Home'

  const handleAdd = () => {
    let hasError = false;

    if (!listName.trim()) {
      setError(true);
      hasError = true;
    }

    if (!hasError) {
      toast.success(`Folder created successfully.`, {
        style: {
          marginTop: '15px',
        },
      });
      setError(false);

      onClose();
    }
  };

  const handleListNameChange = (event) => {
    setListName(event.target.value);
    if (event.target.value) {
      setError(false);
    }
  };

  // Reset list name when dialog is closed, but keep 'Home' as default category
  useEffect(() => {
    if (!open) {
      setListName('');
      // Reset to Home when dialog is closed
    }
  }, [open]);

  // Sample data for folder options

  return (
    <Dialog
      open={open}
      onClose={onClose}
      {...other}
      PaperProps={isWeb ? { style: { minWidth: '600px' } } : { style: { minWidth: '330px' } }}
    >
      <DialogTitle
        sx={{ fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}
        onClick={dialog.onFalse}
      >
        Create Folder
      </DialogTitle>
      <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={0} mb={0}>
          <TextField
            autoFocus
            fullWidth
            type="text"
            margin="dense"
            variant="outlined"
            label="Folder Name"
            placeholder="Enter folder name here."
            value={listName}
            onChange={handleListNameChange}
            error={error}
            helperText={
              error ? (
                'Enter folder name here.'
              ) : (
                <span>
                  Enter the name of the folder here.{' '}
                  <Link
                    href="https://forum.pabbly.com/threads/folders.20987/"
                    style={{ color: '#078DEE' }}
                    underline="always"
                    target="_blank"
                  >
                    Learn more
                  </Link>
                </span>
              )
            }
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleAdd} color="primary" variant="contained">
          Create Folder
        </Button>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
