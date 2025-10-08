import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Stack,
  Paper,
  Button,
  Drawer,
  Tooltip,
  TableRow,
  Checkbox,
  Collapse,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { downloadList } from 'src/redux/slice/listSlice';

import { Label } from 'src/components/label'; 
import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';

import { DashboardChart } from '../chart/dashboard-chart';

export function EmailListTableRow({
  row,
  selected,
  onSelectRow,
  onOpenPopover,
  onEmailClick,
  onDownloadClick,
  onViewProcessingClick,
}) {
  const dispatch = useDispatch();
  const selectedTimeZone = useSelector((state) => state.timeZone?.selectedTimeZone);
  const tzKey = selectedTimeZone?.key || 'UTC';
  const tzDisplay = selectedTimeZone?.value ? `, ${selectedTimeZone.value} ${selectedTimeZone.key}` : '';
  const popover = usePopover();
  const collapse = useBoolean();
  const timezone = tzDisplay;
  const [dialog, setDialog] = useState({
    open: false,
    mode: '',
  });

  // Drawer functions
  const showAlert = (type, title, message) => {
    console.log(`Alert Type: ${type}, Title: ${title}, Message: ${message}`);
  };

  useEffect(()=>{
console.log(row)
  },[])

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const backendToAdminStatus = (status) => {
    if (!status) return 'unverified';
    if (status === 'COMPLETED') return 'verified';
    if (status === 'PROCESSING') return 'processing';
    if (status === 'UNPROCESSED') return 'unverified';
    if (status === 'FAILED') return 'unverified';
    return (status || '').toString().toLowerCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'processing':
        return 'info';
      case 'unverified':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => status.charAt(0).toUpperCase() + status.slice(1);

  const derived = useMemo(() => {
    const status = backendToAdminStatus(row?.status || row?.Status);
    const createdAt = row?.createdAt || row?.uploadedAt || row?.Date;
    const dateStr = createdAt
      ? new Date(createdAt).toLocaleString('en-US', { timeZone: tzKey, year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      : row?.Date;
    const name = row?.listName || row?.emailListName || row?.filename || 'Untitled List';
    const _id = row?._id || row?.id;
    const jobId = row?.jobId;
    const totalEmails = row?.totalEmails || 0;
    const accountEmail = row?.accountEmail || '-';
    const accountName = row?.accountName || '-';
    const results = row?.report?.results || row?.ListResult || {};
    return { status, dateStr, name, _id, jobId, totalEmails, accountEmail, accountName, results };
  }, [row, tzKey]);

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  const renderActionButtons = () => {
    switch (row.status) {
      case 'verified':
        return (
          <Tooltip title="Click here to download the report." arrow placement="top">
            <Button
              variant="outlined"
              color="primary"
              size="medium"
              onClick={(e) => {
                e.stopPropagation();
                handleDrawerOpen();
                // onDownloadClick();
              }}
            >
              Download Report
            </Button>
          </Tooltip>
        );
      case 'processing':
        return (
          <Tooltip title="Click here to view details." arrow placement="top">
            <Button
              variant="outlined"
              // disabled
              color="primary"
              size="medium"
              sx={{ whiteSpace: 'nowrap' }}
              onClick={(e) => {
                e.stopPropagation();
                onViewProcessingClick();
              }}
            >
              Verification in Process
            </Button>
          </Tooltip>
        );
      default:
        return '-';
    }
  };

  const results = Object.entries(derived.results);

  const renderPrimary = (
    <>
      <TableRow hover selected={selected} sx={{ cursor: 'pointer' }}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onChange={(event) => {
              event.stopPropagation();
              onSelectRow();
            }}
            inputProps={{ 'aria-labelledby': row.id }}
          />
        </TableCell>
        <TableCell>
          <Stack>
            <Box mb="5px">
              <Tooltip
                arrow
                placement="top"
                disableInteractive
                title="Status of the uploaded email list."
              >
                <Label
                  variant="soft"
                  color={getStatusColor(derived.status)}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {getStatusLabel(derived.status)}
                </Label>
              </Tooltip>
            </Box>
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={`Email List Uploaded at: ${derived.dateStr}${timezone}.`}
            >
              <Box
                component="span"
                sx={{
                  color: 'text.disabled',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '180px',
                  display: 'inline-block',
                }}
              >
                {derived.dateStr}
              </Box>
            </Tooltip>
          </Stack>
        </TableCell>
        <TableCell>
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center" gap={2}>
              <Tooltip
                arrow
                placement="top"
                disableInteractive
                title={`Name of the email list uploaded by the Pabbly Customer: ${derived.name}.`}
              >
                <Box
                  component="span"
                  sx={{
                    color: 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '200px',
                    display: 'inline-block',
                  }}
                >
                  {derived.name}
                </Box>
              </Tooltip>
            </Box>
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={`ID of the email list uploaded by the Pabbly Customer: ${derived._id}.`}
            >
              <Box
                component="span"
                sx={{
                  color: 'text.disabled',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100px',
                  display: 'inline-block',
                }}
              >
                {derived._id}
              </Box>
            </Tooltip>
          </Box>
        </TableCell>
        <TableCell>
          <Tooltip
            arrow
            placement="top"
            disableInteractive
              title={`Email address of the Pabbly customer: ${derived.accountEmail}.`}
          >
            <Box
              component="span"
              onClick={(e) => {
                e.stopPropagation();
                onEmailClick(row);
              }}
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '300px',
                display: 'inline-block',
              }}
            >
              {derived.accountEmail}
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Tooltip
            title="Name of the third-party email verification application whose API is used for verification of specific email list."
            placement="top"
            arrow
          >
            <Box
              component="span"
              sx={{
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '180px',
                display: 'inline-block',
              }}
            >
              {derived.accountName === '' ? '-' : derived.accountName}
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
          {(() => {
            switch (derived.status) {
              case 'verified':
                return (
                  <Tooltip title="Click here to download the report." arrow placement="top">
                    <Button
                      variant="outlined"
                      color="primary"
                      size="medium"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (derived.jobId) {
                           await dispatch(downloadList({ jobId: derived.jobId })).unwrap(); 
                        }
                      }}
                    >
                      Download Report
                    </Button>
                  </Tooltip>
                );
              case 'processing':
                return (
                  <Tooltip title="Click here to view details." arrow placement="top">
                    <Button
                      variant="outlined"
                      color="primary"
                      size="medium"
                      sx={{ whiteSpace: 'nowrap' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProcessingClick();
                      }}
                    >
                      Verification in Process
                    </Button>
                  </Tooltip>
                );
              default:
                return '-';
            }
          })()}
        </TableCell>
        <TableCell
          align="right"
          sx={{ px: 1, whiteSpace: 'nowrap' }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Click to see options." arrow placement="top">
            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              onClick={(event) => onOpenPopover(event)}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      {/* <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { width: { xs: '100%', md: 600 }, p: 3 },
        }}
      >
        <Box>
          
          <DialogTitle sx={{ p: 2 }}>
            <Typography variant="h6">Download Verification Report</Typography>
            <Typography variant="body2" color="text.secondary" pb={3}>
              Verification details for <strong>{row.emailListName}</strong>
            </Typography>
            <IconButton
              onClick={handleDrawerClose}
              sx={{
                position: 'relative',
                right: 8,
                top: 8,
                color: 'text.secondary',
              }}
            >
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </DialogTitle>
          <DashboardChart />
        </Box>
      </Drawer> */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: {
              xs: '100%',
              md: '600px',
            },
            p: 3,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6">Verification Report</Typography>
            <Typography variant="h8">Check the full details of email verification here.</Typography>
          </Box>

          <IconButton onClick={() => setIsDrawerOpen(false)}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>

        <DashboardChart
          showAlert={showAlert}
          // handleAlertClose={handleAlertClose}
          jobId={row.jobId}
          title={row.emailListName}

          chart={{
            series: [
              { label: 'Deliverable Emails', value: row.ListResult?.deliverable || 0 },
              { label: 'Undeliverable Emails', value: row.ListResult?.undeliverable || 0 },
              { label: 'Accept-all Emails', value: row.ListResult?.accept_all || 0 },
              { label: 'Unknown Emails', value: row.ListResult?.unknown || 0 },
            ],
          }}
        />
      </Drawer>
    </>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper sx={{ m: 1.5 }}>
            {results.map(([key, value]) => (
              <Stack
                key={key}
                direction="row"
                gap={2}
                alignItems="center"
                sx={{
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) => `solid 2px ${theme.vars.palette.background.neutral}`,
                  },
                }}
              >
                <Tooltip title="Access token of your WhatsApp Number" arrow placement="top">
                  <Box display="flex" gap="5px">
                    <Typography fontSize={14} fontWeight={600}>
                      {key.charAt(0).toUpperCase() + key.slice(1)} Emails:
                    </Typography>
                    <Typography fontSize={14}>{value}</Typography>
                  </Box>
                </Tooltip>
              </Stack>
            ))}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
      {renderSecondary}
    </>
  );
}

export default EmailListTableRow;
