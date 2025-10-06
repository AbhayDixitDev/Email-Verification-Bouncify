import { toast } from 'sonner';
import { useTheme } from '@emotion/react';
import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Table,
  Paper,
  Drawer,
  Switch,
  Divider,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
  FormControlLabel,
  Backdrop as MuiBackdrop,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// Custom backdrop component
const CustomBackdrop = (props) => (
  <MuiBackdrop {...props} sx={{ backgroundColor: 'transparent' }} />
);

const ActivityLogDrawer = ({ open, onClose, rowData }) => {
  const [isSimpleData, setIsSimpleData] = useState(false);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSimpleDataToggle = () => {
    setIsSimpleData(!isSimpleData);
  };

  // Updated sample data with only the requested fields
  const eventData = {
    _csrf: '',
    merchant_id: '64157431afb2392d9ff09405',
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(JSON.stringify(eventData, null, 2))
      .then(() => {
        toast.success('Activity data copied successfully.');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };
  const theme = useTheme();
    const [editorTheme, setEditorTheme] = useState('light');
  
    useEffect(() => {
      if (theme.palette.mode === 'dark') {
        setEditorTheme('dark');
      } else {
        setEditorTheme('light');
      }
    }, [theme.palette.mode]);

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
              md: '50%',
              lg: '50%',
            },
          },
        }}
        ModalProps={{
          BackdropComponent: CustomBackdrop,
        }}
      >
        <Box
          onClick={handleBackdropClick}
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography variant="h6" mb={2}>
              Activity Log
            </Typography>

            {rowData && (
              <Box sx={{ display: 'auto' }}>
                <Box sx={{ gap: 1, alignItems: 'center', display: 'flex' }}>
                  <Tooltip
                    title="Unique identifier for this activity log entry. Click to copy the ID for reference."
                    arrow
                    placement="left"
                    disableInteractive
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#637381',
                        overflow: { xs: 'hidden', sm: 'visible' },
                        textOverflow: { xs: 'ellipsis', sm: 'unset' },
                        whiteSpace: { xs: 'nowrap', sm: 'normal' },
                        maxWidth: { xs: '200px', sm: 'unset' },
                      }}
                    >
                      Activity Log ID -{' '}
                      <strong>{rowData.event_id || 'IjU3NjYwNTZmMDYzNzA0MzA1MjZlNTUzNyI'}</strong>
                    </Typography>
                  </Tooltip>
                  <Tooltip title="Copy" arrow placement="top" disableInteractive>
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText(
                          rowData.event_id || 'IjU3NjYwNTZmMDYzNzA0MzA1MjZlNTUzNyI'
                        );
                        toast.success('Activity Log ID copied successfully.');
                      }}
                    >
                      <Iconify width={18} icon="solar:copy-bold" sx={{ color: 'text.secondary' }} />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ gap: 1, alignItems: 'center', display: 'flex' }}>
                  <Tooltip
                    title="View the action performed (E.g., Created, Updated, Deleted) along with the request method (E.g., POST, GET)."
                    arrow
                    placement="left"
                    disableInteractive
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#637381',
                        width: 'auto',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      Action -{' '}
                      <strong>
                        {rowData.status
                          ? `${rowData.status.toUpperCase()}${
                              rowData.status === 'created'
                                ? ' (POST)'
                                : rowData.status === 'updated'
                                  ? ' (PUT)'
                                  : rowData.status === 'deleted'
                                    ? ' (DELETE)'
                                    : ''
                            }`
                          : 'CREATED (POST)'}
                      </strong>
                    </Typography>
                  </Tooltip>
                </Box>

                <Box sx={{ gap: 1, alignItems: 'center', display: 'flex', mt: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#637381',
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <Tooltip
                      title={`Executed: ${rowData.date} (UTC+05:30) Asia/Kolkata`}
                      arrow
                      placement="left"
                      disableInteractive
                    >
                      <span>
                        Executed -{' '}
                        <strong>
                          {rowData.date || 'Aug 22, 2024 08:23:31, (UTC+05:30) Asia/Kolkata'}
                        </strong>
                      </span>
                    </Tooltip>
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
          <IconButton onClick={onClose} sx={{ top: 12, left: 12, zIndex: 9 }}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Card>
            <Box p={3} display="flex" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={2}>
                <Tooltip
                  title="View detailed data related to this activity log entry. Toggle between raw and simple data views."
                  arrow
                  placement="top"
                  disableInteractive
                >
                  <Typography fontSize={18} fontWeight={700}>
                    Activity Data
                  </Typography>
                </Tooltip>
                <Tooltip title="Copy" arrow placement="top" disableInteractive>
                  <IconButton onClick={handleCopyClick}>
                    <Iconify sx={{ color: 'grey.600' }} icon="solar:copy-bold" />
                  </IconButton>
                </Tooltip>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    id="toggle-simple-data"
                    checked={isSimpleData}
                    onChange={handleSimpleDataToggle}
                  />
                }
                label="Simple Data"
                labelPlacement="start"
              />
            </Box>
            <Divider />
            <Box sx={{ p: 3 }} display="flex" flexDirection="column">
              {!isSimpleData ? ( // Raw JSON view
                <CodeMirror
                  value={JSON.stringify(eventData, null, 2)}
                  height="200px"
                  extensions={[json()]}
                  theme={editorTheme === 'dark' ? 'dark' : 'light'}
                  editable={false}
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    highlightActiveLine: true,
                  }}
                  style={{
                    '[data-mui-color-scheme="light"] &': {
                      color: '#637381', // light mode color
                    },
                    '[data-mui-color-scheme="dark"] &': {
                      color: 'var(--palette-text-secondary)', // dark mode color
                    },
                  }}
                />
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: '600',
                            backgroundColor: theme.palette.mode === 'dark' ? '#28323d' : '#f4f6f8',
                            color: theme.palette.mode === 'dark' ? '#919eab' : '#637381',
                          }}
                        >
                          Key
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: '600',
                            color: theme.palette.mode === 'dark' ? '#919eab' : '#637381',

                            backgroundColor: theme.palette.mode === 'dark' ? '#28323d' : '#f4f6f8',
                          }}
                        >
                          Value
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(eventData).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell
                            sx={{
                              fontWeight: '500',
                              fontSize: '14px',
                            }}
                          >
                            {key.replace(/_/g, ' ')}
                          </TableCell>
                          <TableCell>{value || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Card>
        </Box>
      </Drawer>
      {open && <CustomBackdrop open={open} onClick={handleBackdropClick} />}
    </>
  );
};

export { ActivityLogDrawer };
