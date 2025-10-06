import React, { useState } from 'react';
import { useTheme } from '@emotion/react';

import {
  Box,
  Stack,
  Button,
  Tooltip,
  Popover,
  MenuList,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  Autocomplete,
  useMediaQuery,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/confirm-dialog';

import { TeamMemberDialog } from '../../hooks/add-team-member';

export function SharedbyYouTeamMemberTableToolbar({
  filters,
  onResetPage,
  numSelected,
  nomemberAdded,
}) {
  // State variables
  const confirmDelete = useBoolean();
  const popover = usePopover();
  const theme = useTheme();
  const isBelow600px = useMediaQuery(theme.breakpoints.down('sm'));

  const [teamMemberDialogOpen, setTeamMemberDialogOpen] = useState(false);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [selectedstatus, setselectedstatus] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const permission = ['Read Access', 'Write Access'];
  const folder = [
    'Home',
    'Magnet Brains',
    'Pabbly Hook',
    'Pabbly Connect ',
    'Pabbly Subcription Billing',
    'Pabbly Admin ',
    'Pabbly Chatflow',
    'Pabbly Form Builder',
    'Pabbly Email Marketing',
    'Pabbly Plus',
  ];
  const hasAnyFilterSelected = Boolean(selectedstatus) || Boolean(selectedFolder);

  // Handlers
  const handleFilterEmail = (event) => {
    onResetPage();
    filters.setState({ email: event.target.value });
  };

  const handleTeamMemberDialogOpen = () => setTeamMemberDialogOpen(true);
  const handleTeamMemberDialogClose = () => setTeamMemberDialogOpen(false);

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);

  const handleFilterButtonClick = (e) => {
    if (!isFilterApplied || e.target.tagName !== 'svg') {
      setFilterAnchorEl(e.currentTarget);
    }
  };

  const handleFilterClose = () => setFilterAnchorEl(null);

  const handleApplyFilter = () => {
    if (hasAnyFilterSelected) {
      setFilterApplied(true);
      handleFilterClose();
    }
  };

  const resetFilters = () => {
    setselectedstatus(null);
    setSelectedFolder(null);
    setFilterApplied(false);
  };

  const handleFilterIconClick = (e) => {
    e.stopPropagation();
    if (isFilterApplied) {
      handleFilterClose();
      resetFilters();
    }
  };

  // Styles
  const buttonStyle = {
    color: isFilterApplied ? '#fff' : theme.palette.primary.main,
    fontSize: '15px',
    height: '48px',
    textTransform: 'none',
    padding: '16px',
    width: isFilterApplied ? '156px' : '104.34px',
    position: 'relative',
    '& .MuiButton-startIcon': {
      pointerEvents: 'auto',
      marginRight: '8px',
      display: 'flex',
    },
    '&:hover': {
      backgroundColor: isFilterApplied ? theme.palette.primary.main : '#ECF6FE',
    },
  };

  const toolbarButtonStyle = {
    fontSize: '15px',
    height: '48px',
    textTransform: 'none',
    padding: '0 16px',
  };

  return (
    <>
      <Stack
        spacing={2}
        alignItems="center"
        direction={isBelow600px ? 'column' : 'row'}
        sx={{ p: 2.5, width: '100%' }}
      >
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            value={filters.state.email}
            onChange={handleFilterEmail}
            placeholder="Search by email or folder name..."
            disabled={nomemberAdded}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'row',
            width: isBelow600px ? '100%' : 'auto',
            justifyContent: 'flex-end',
          }}
        >
          {numSelected > 0 && (
            <Button
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              onClick={handlePopoverOpen}
              color="primary"
              sx={{ ...buttonStyle, width: '200px' }}
            >
              Select Action
            </Button>
          )}

          <Tooltip title="Add a team member and share folder(s) with them." arrow placement="top">
            <Button
              sx={{ ...toolbarButtonStyle, width: '188px' }}
              size="large"
              color="primary"
              disabled={nomemberAdded}
              onClick={handleTeamMemberDialogOpen}
              startIcon={
                <Iconify icon="heroicons:plus-circle-16-solid" style={{ width: 18, height: 18 }} />
              }
            >
              Add Team Member
            </Button>
          </Tooltip>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'row',
            width: isBelow600px ? '100%' : 'auto',
            justifyContent: 'flex-end',
          }}
        >
          <Tooltip
            title={
              isFilterApplied
                ? "Click the 'X' to clear all applied filters."
                : 'Filter results to focus on specific team members or folders.'
            }
            arrow
            placement="top"
          >
            <Button
              sx={buttonStyle}
              variant={isFilterApplied ? 'contained' : ''}
              color="primary"
              startIcon={!isFilterApplied && <Iconify icon="mdi:filter" />}
              endIcon={
                isFilterApplied && (
                  <Box
                    component="span"
                    onClick={handleFilterIconClick}
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify
                      icon="uil:times"
                      style={{ width: 22, height: 22, cursor: 'pointer' }}
                    />
                  </Box>
                )
              }
              onClick={handleFilterButtonClick}
            >
              {isFilterApplied ? 'Filter Applied' : 'Filters'}
            </Button>
          </Tooltip>
        </Box>
      </Stack>

      {/* Popovers and Dialogs */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuList>
          <Tooltip title="Remove access to shared folder." arrow placement="left">
            <MenuItem
              sx={{ color: 'error.main' }}
              onClick={() => {
                confirmDelete.onTrue();
                popover.onClose();
              }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 2 }} />
              Remove Access
            </MenuItem>
          </Tooltip>
        </MenuList>
      </Popover>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Do you really want to remove folder(s) access?"
        content="You will no longer have access to the shared folder(s)."
        action={
          <Button variant="contained" color="error">
            Remove Access
          </Button>
        }
      />

      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box
          sx={{
            width: { xs: '100%', sm: '100%', md: 650 },
            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
          }}
        >
          <Box
            sx={{
              borderBottom: '1px dashed #919eab33',
              p: 2,
              display: 'flex',
              height: '100%',
              width: '100%',
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: '600' }}>
                <Tooltip
                  title="Filter to find specific team members based on folder and permission details."
                  arrow
                  placement="top"
                >
                  <span>Filter Action</span>
                </Tooltip>
              </Typography>
            </Box>
            <Iconify
              icon="uil:times"
              onClick={handleFilterClose}
              style={{ width: 20, height: 20, cursor: 'pointer', color: '#637381' }}
            />
          </Box>

          <Box
            sx={{
              p: '16px 16px 0px 16px',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'column', md: 'row' },
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                gap: 2,
                mb: 2,
                alignItems: 'center',
              }}
            >
              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                  <Tooltip
                    title="Filter team members based on the type of access they have, such as Read Access or Write Access."
                    arrow
                    placement="top"
                  >
                    <span>Permission Type</span>
                  </Tooltip>
                </Typography>
              </FormControl>

              <FormControl
                fullWidth
                sx={{ mb: { xs: 2, sm: 2, md: 0 }, width: { xs: '100%', md: '390px' } }}
              >
                <TextField
                  id="select-currency-label-x"
                  variant="outlined"
                  fullWidth
                  label="Equals to"
                  disabled
                  size="small"
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <Autocomplete
                  sx={{
                    '& .MuiInputBase-input': { fontSize: '14px' },
                    '& .MuiInputLabel-root': { fontSize: '14px' },
                  }}
                  size="small"
                  options={permission}
                  value={selectedstatus}
                  onChange={(event, newValue) => setselectedstatus(newValue)}
                  renderInput={(params) => <TextField {...params} label="Select" />}
                />
              </FormControl>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                gap: 2,
                mb: 2,
                alignItems: 'center',
              }}
            >
              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                  <Tooltip
                    title="Select a folder to filter the list of team members who have access to specific shared folders."
                    arrow
                    placement="top"
                  >
                    <span>Folders You’ve Shared</span>
                  </Tooltip>
                </Typography>
              </FormControl>

              <FormControl
                fullWidth
                sx={{ mb: { xs: 2, sm: 2, md: 0 }, width: { xs: '100%', md: '390px' } }}
              >
                <TextField
                  id="select-currency-label-x"
                  variant="outlined"
                  fullWidth
                  label="Equals to"
                  disabled
                  size="small"
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <Autocomplete
                  sx={{
                    '& .MuiInputBase-input': { fontSize: '14px' },
                    '& .MuiInputLabel-root': { fontSize: '14px' },
                  }}
                  size="small"
                  options={folder}
                  value={selectedFolder}
                  onChange={(event, newValue) => setSelectedFolder(newValue)}
                  renderInput={(params) => <TextField {...params} label="Select" />}
                />
              </FormControl>
            </Box>
          </Box>
          <Box
            sx={{
              p: 2,
              gap: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              borderTop: '1px dashed #919eab33',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilter}
              disabled={!hasAnyFilterSelected}
            >
              Apply Filter
            </Button>
          </Box>
        </Box>
      </Popover>

      <TeamMemberDialog
        open={teamMemberDialogOpen}
        onClose={handleTeamMemberDialogClose}
        title="Add Team Member"
        content="Define your team member details."
      />
    </>
  );
}
