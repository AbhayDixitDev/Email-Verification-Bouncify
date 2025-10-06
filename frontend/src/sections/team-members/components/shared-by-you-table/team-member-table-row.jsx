import { toast } from 'sonner';
import React, { useState } from 'react';

import {
  Box,
  Stack,
  Button,
  Tooltip,
  Divider,
  TableRow,
  Checkbox,
  MenuList,
  MenuItem,
  TableCell,
  IconButton,
  CircularProgress,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/confirm-dialog';

import { TeamMemberDialog } from '../../hooks/add-team-member';

export function SharedbyYouTeamMemberTableRow({ row, selected, onSelectRow, serialNumber }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [openTeamMemberDialog, setOpenTeamMemberDialog] = useState(false);

  const handleOpenPopover = (event) => setAnchorEl(event.currentTarget);
  const handleClosePopover = () => setAnchorEl(null);
  const handleOpenConfirmDelete = () => {
    setConfirmDelete(true);
    handleClosePopover();
  };
  const handleCloseConfirmDelete = () => setConfirmDelete(false);

  const getTooltip = (type, rowData) => {
    const tooltips = {
      folder: `Folder Name: ${rowData.folders_you_shared}`,
      sharedOn: `Folder Shared On: ${rowData.updatedAt} (UTC+05:30) Asia/Kolkata`,
      permission:
        row.permission === 'Write Access'
          ? 'Team members can upload email lists, start verification, and download verification reports. They cannot create new folders, delete folders, or remove email lists.'
          : 'Team members can only download verification reports.',
    };
    return tooltips[type];
  };

  const handleOpenTeamMemberDialog = () => {
    setOpenTeamMemberDialog(true);
    handleClosePopover();
  };

  const handleCloseTeamMemberDialog = () => {
    setOpenTeamMemberDialog(false);
  };

  return (
    <>
      <TableRow hover selected={selected} sx={{ '&:hover .copy-button': { opacity: 1 } }}>
        {/* Checkbox */}
        <TableCell padding="checkbox">
          <Tooltip title="Select" arrow placement="top" disableInteractive>
            <Checkbox
              checked={selected}
              onClick={onSelectRow}
              inputProps={{ 'aria-label': 'Row checkbox' }}
            />
          </Tooltip>
        </TableCell>

        {/* Shared On */}
        <TableCell width={400} align="left">
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            sx={{
              width: '200px',
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'flex-start',
            }}
          >
            <Tooltip title={getTooltip('sharedOn', row)} arrow placement="top" disableInteractive>
              {row.createdAt}
            </Tooltip>
          </Stack>
        </TableCell>

        {/* Email */}
        {/* <TableCell width={400}>
          <Box
            sx={{
              width: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Tooltip title={`Email: ${row.email}`} arrow placement="top" disableInteractive>
              {row.email}
            </Tooltip>
          </Box>
        </TableCell> */}
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Stack
              sx={{
                // color: '#078dee',
                typography: 'body2',
                flex: '1 1 auto',
                alignItems: 'flex-start',
              }}
            >
              <Box
                component="span"
                sx={{
                  maxWidth: { xs: '530px', md: '800px' },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Tooltip title={`Email: ${row.email}`} placement="top" arrow>
                  {row.email}
                </Tooltip>
              </Box>
              <Box
                component="span"
                sx={{
                  color: 'text.disabled',
                  maxWidth: {
                    xs: '250px', // For extra small screens
                    sm: '650px', // For small screens
                    md: '700px', // For medium screens
                    lg: '750px', // For large screens
                    xl: '950px', // For extra large screens
                  },
                  display: 'inline-block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <Tooltip title={getTooltip('folder', row)} placement="bottom" arrow>
                  {row.folders_you_shared}
                </Tooltip>
              </Box>
            </Stack>
          </Stack>
        </TableCell>
        {/* Workflows */}
        {/* <TableCell width={400}>
          <Box
            sx={{
              width: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Tooltip title={getTooltip('folder', row)} arrow placement="top" disableInteractive>
              {row.folders_you_shared}
            </Tooltip>
          </Box>
        </TableCell> */}

        {/* Permission */}
        <TableCell>
          <Stack
            sx={{
              // width: '200px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'end',
              alignContent: 'flex-end',
            }}
          >
            <Tooltip title={getTooltip('permission', row)} arrow placement="top" disableInteractive>
              {row.permission}
            </Tooltip>
          </Stack>
        </TableCell>

        {/* Options */}
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Click to see options." arrow placement="top" disableInteractive>
            <IconButton onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      {/* Popover */}
      <CustomPopover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClosePopover}>
        <MenuList>
          <Tooltip
            title="Update access to shared folder."
            arrow
            placement="left"
            disableInteractive
          >
            <MenuItem onClick={handleOpenTeamMemberDialog}>
              <Iconify icon="solar:pen-bold" />
              Update Access
            </MenuItem>
          </Tooltip>
          <Divider style={{ borderStyle: 'dashed' }} />
          <Tooltip
            title="Remove access to shared folder."
            arrow
            placement="left"
            disableInteractive
          >
            <MenuItem onClick={handleOpenConfirmDelete} sx={{ color: 'error.main' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Remove Access
            </MenuItem>
          </Tooltip>
        </MenuList>
      </CustomPopover>

      <TeamMemberDialog
        open={openTeamMemberDialog}
        onClose={handleCloseTeamMemberDialog}
        currentMember={row} // Pass the current row data to the dialog
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDelete}
        onClose={handleCloseConfirmDelete}
        disabled={isLoading}
        title=" Do you really want to remove folder(s) access?"
        content="You will no longer have access to the shared folder(s)."
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleCloseConfirmDelete();

              toast.success(`Access Removed Successfully!`, {
                style: {
                  marginTop: '15px',
                },
              });
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Remove Access'}
          </Button>
        }
      />

      {/* Success Snackbar */}
    </>
  );
}
