import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ActivityLogDetailsModal({ open, onClose, activityLog }) {
  if (!activityLog) return null;

  const getActionColor = (action) => {
    switch (action) {
      case 'POST':
        return 'success';
      case 'PUT':
        return 'warning';
      case 'DELETE':
        return 'error';
      default:
        return 'default';
    }
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'user':
        return 'primary';
      case 'api':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatData = (dataString) => {
    try {
      const data = JSON.parse(dataString);
      return JSON.stringify(data, null, 2);
    } catch {
      return dataString;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Activity Log Details</Typography>
          <IconButton onClick={onClose} size="small">
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* Basic Information */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Basic Information
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 'medium' }}>
                  Action:
                </Typography>
                <Chip
                  label={activityLog.action}
                  color={getActionColor(activityLog.action)}
                  size="small"
                />
              </Stack>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 'medium' }}>
                  Source:
                </Typography>
                <Chip
                  label={activityLog.event_source}
                  color={getSourceColor(activityLog.event_source)}
                  size="small"
                />
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 'medium' }}>
                  Module:
                </Typography>
                <Typography variant="body2">
                  {activityLog.module_name || 'N/A'}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 'medium' }}>
                  URL:
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {activityLog.url}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 'medium' }}>
                  Date:
                </Typography>
                <Typography variant="body2">
                  {new Date(activityLog.createdAt).toLocaleString()}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Divider />

          {/* Request Data */}
          {activityLog.data && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Request Data
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  maxHeight: 300,
                  overflow: 'auto',
                }}
              >
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {formatData(activityLog.data)}
                </Typography>
              </Box>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
