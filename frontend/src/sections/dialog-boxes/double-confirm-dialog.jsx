import { useTheme } from '@emotion/react';
import React, { useState, useEffect } from 'react';

import {
  Button,
  Dialog,
  Divider,
  Tooltip,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  useMediaQuery,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';

export function DoubleConfirmDialog({
  title = 'Delete Email List',
  content = 'Are you sure you want to proceed?',
  action = 'Delete',
  open,
  onClose,
  listName,
  ...other
}) {
  const theme = useTheme();
  const dialog = useBoolean();
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'));

  const [loadingState, setLoadingState] = useState(false);
  const [deleteScope, setDeleteScope] = useState('Current List');
  const [helperText, setHelperText] = useState('Delete contact from the current contact list.');
  const [strongConfirmationValue, setStrongConfirmationValue] = useState('');
  const [buttonError, setButtonError] = useState(false);

  useEffect(() => {
    if (!listName) {
      setDeleteScope('List');
      setHelperText('Delete contact from all contact lists.');
    }
  }, [listName]);

  const handleScopeChange = (event) => {
    const { value } = event.target;
    setDeleteScope(value);
    setHelperText(
      value === 'Current List'
        ? 'Delete contact from the current contact list.'
        : 'Delete contact from all contact lists.'
    );
  };

  const handleAction = async () => {
    if (deleteScope === 'List' && strongConfirmationValue.trim() !== 'DELETE') {
      setButtonError(true);
      return;
    }

    setButtonError(false);
    setLoadingState(true);

    try {
      onClose();
    } catch (err) {
      console.error(`Error during ${action.toLowerCase()}:`, err);
    } finally {
      setLoadingState(false);
    }
  };

  const getTooltipMessage = () =>
    deleteScope === 'Current List'
      ? 'This option will delete contacts only from the currently selected list.'
      : 'This option will delete contacts from all lists.';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      {...other}
      PaperProps={isWeb ? { style: { minWidth: '600px' } } : { style: { minWidth: '330px' } }}
    >
      <DialogTitle sx={{ fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}>
        {title}
        <Iconify
          onClick={onClose}
          icon="uil:times"
          style={{ width: 20, height: 20, cursor: 'pointer', color: '#637381' }}
        />
      </DialogTitle>
      <Divider sx={{ mb: '16px', borderStyle: 'dashed' }} />

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {deleteScope === 'List' && (
          <TextField
            sx={{ mt: 2 }}
            placeholder="Enter 'DELETE' for confirmation"
            label="Confirmation"
            fullWidth
            value={strongConfirmationValue}
            onChange={(e) => {
              setStrongConfirmationValue(e.target.value);
              if (e.target.value.trim() === 'DELETE') {
                setButtonError(false);
              }
            }}
            error={buttonError}
            helperText={
              <span>
                Are you sure you want to delete this email list from data base? If you delete this
                email list, its respective reports will also get deleted. To confirm, type{' '}
                <strong>DELETE</strong> in the above box.
              </span>
            }
          />
        )}
      </DialogContent>

      <DialogActions>
        <Tooltip title={action === 'Delete' ? 'Click to delete.' : 'Click to proceed.'} arrow>
          <Button onClick={handleAction} variant="contained" color="error">
            Delete
          </Button>
        </Tooltip>
        <Tooltip title="Click to cancel this operation." arrow>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
