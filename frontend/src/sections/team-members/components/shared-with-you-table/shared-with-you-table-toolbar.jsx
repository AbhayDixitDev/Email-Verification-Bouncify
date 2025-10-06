import React, { useState } from 'react';
import { useTheme } from '@emotion/react';

import {
  Box,
  Stack,
  Button,
  Popover,
  Tooltip,
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

export function SharedWithYouTeamMemberTableToolbar({
  filters,
  onResetPage,
  numSelected,
  nofoldersShared,
}) {
  // State variables
  const theme = useTheme();
  const confirmDelete = useBoolean();
  const popover = usePopover();
  const isBelow600px = useMediaQuery(theme.breakpoints.down('sm'));

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [isFilterApplied, setFilterApplied] = useState(false);
  const [selectedstatus, setselectedstatus] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const hasAnyFilterSelected = Boolean(selectedstatus) || Boolean(selectedFolder);
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

  // Handlers
  const handleFilterEmail = (event) => {
    onResetPage();
    filters.setState({ email: event.target.value });
  };

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

  return (
    <>
      <Stack
        spacing={1}
        alignItems="center"
        direction={isBelow600px ? 'column' : 'row'}
        sx={{ p: 2.5, width: '100%' }}
      >
        <Box sx={{ width: '100%' }}>
          <TextField
            disabled={nofoldersShared}
            fullWidth
            value={filters.state.email}
            onChange={handleFilterEmail}
            placeholder="Search by email or folder name..."
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
                : 'Filter folders by access type or source.'
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

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuList>
          <Tooltip title="Remove access to shared folders." arrow placement="left">
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
                  title="Filter to find specific folders shared with you based on who shared them or the access type."
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
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                alignItems: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                  <Tooltip
                    title="Filter folders shared with you by the type of access, such as Read or Write Access."
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
                alignItems: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                  <Tooltip
                    title="Filter by the source that shared the folders with you."
                    arrow
                    placement="top"
                  >
                    <span>Folders Shared By</span>
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
    </>
  );
}
