import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { useState, useEffect, useCallback } from 'react';
import axios from 'src/utils/axios';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import {
  Divider,
  Tooltip,
  TextField,
  Autocomplete,
  useMediaQuery,
  DialogContent,
} from '@mui/material';

export function MoveToFolderPopover({ title, content, action, open, onClose, jobId, ...other }) {
  const theme = useTheme();
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'));

  const [categoryList, setCategoryList] = useState('');
  const [categoryError, setCategoryError] = useState(false);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const fetchFolders = () => {
      axios.get('/folders')
        .then((res) => {
          const options = (res?.data?.data || []).map((f) => ({ label: f.name, value: f._id }));
          setFolders(options);
        })
        .catch(() => setFolders([]));
    };
    if (open) fetchFolders();
  }, [open]);

  const handleChangeCategoryList = useCallback((event, value) => {
    setCategoryList(value);
    if (value) {
      setCategoryError(false);
    }
  }, []);

  const folder = folders;

  const handleAdd = async () => {
    if (!categoryList) {
      setCategoryError(true); // Show error if no folder is selected
      return;
    }

    try {
      await axios.post('/lists/move-to-folder', { jobId, folderId: categoryList?.value || categoryList });
      onClose();
      toast.success(`The email list moved successfully.`, { style: { marginTop: '15px' } });
    } catch (e) {
      toast.error('Failed to move list');
    }
  };

  const handleDialogClose = () => {
    // Reset the Snackbar state when the dialog is closed
    setCategoryList(''); // Reset category list on close
    setCategoryError(false); // Reset error state on close
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      {...other}
      PaperProps={isWeb ? { style: { minWidth: '600px' } } : { style: { minWidth: '330px' } }}
    >
      <DialogTitle
        sx={{ fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}
        onClick={() => {}}
      >
        Move To Folder{' '}
      </DialogTitle>
      <Divider sx={{ mb: '16px', borderStyle: 'dashed' }} />

      <DialogContent>
        <Autocomplete
          sx={{
            '& .MuiInputBase-input': {
              fontSize: '14px',
            },
            '& .MuiInputLabel-root': {
              fontSize: '14px',
            },
            mt: 1.2,
          }}
          options={folder}
          value={categoryList}
          onChange={handleChangeCategoryList}
          renderInput={(params) => (
            <TextField
              {...params}
              label={
                <Tooltip
                  title="Select folder to which the list needs to be moved."
                  arrow
                  placement="top"
                >
                  <span>Select Folder</span>
                </Tooltip>
              }
              helperText={
                <span>
                  {categoryError ? (
                    'Please select a required folder.'
                  ) : (
                    <>
                      Select the folder where you want to move the list.{' '}
                      <Link
                        href="https://forum.pabbly.com/threads/folders.20987/"
                        style={{ color: '#078DEE' }}
                        underline="always"
                      >
                        Learn more
                      </Link>
                    </>
                  )}
                </span>
              }
              error={categoryError}
            />
          )}
        />
      </DialogContent>

      <DialogActions>
        {action}
        <Button onClick={handleAdd} variant="contained" color="primary">
          Move
        </Button>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
