import React, { useState } from 'react';
import { useTheme } from '@emotion/react';

import {
  Box,
  Stack,
  Button,
  Popover,
  Tooltip,
  MenuItem,
  MenuList,
  TextField,
  Typography,
  FormControl,
  Autocomplete,
  useMediaQuery,
  InputAdornment,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

export function ApiTableToolbar({
  filters,
  onResetPage,
  publish,
  onChangePublish,
  numSelected,
  handleOpenDialog,
}) {
  const theme = useTheme();
  const isBelow600px = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const applicationName = ['Added', 'Verified Email', 'Verifying List'];

  const handlePopoverClose = () => setAnchorEl(null);

  const handleFilterName = (event) => {
    onResetPage(); // Reset the page to page 1 when filtering
    filters.setState({ name: event.target.value }); // Set the name filter based on the search input
  };

  const [isFilterApplied, setFilterApplied] = useState(false); // Local filter state

  const [selectedApplicationName, setSelectedApplicationName] = useState(null);

  const handleFilterIconClick = (e) => {
    e.stopPropagation();
    if (isFilterApplied) {
      handleFilterClose();
      resetFilters();
      setFilterApplied(false);
    }
  };

  const hasAnyFilterSelected = Boolean(selectedApplicationName);

  const resetFilters = () => {
    setSelectedApplicationName(null);
    setFilterApplied(false);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleApplyFilter = () => {
    if (hasAnyFilterSelected) {
      setFilterApplied(true);
      handleFilterClose();
    }
  };

  const buttonStyle = {
    
    fontSize: '15px',
    height: '48px',
    textTransform: 'none',
    padding: '16px',
    // width: isFilterApplied ? '156px' : '104.34px',
    position: 'relative',
    '& .MuiButton-startIcon': {
      pointerEvents: 'auto',
      marginRight: '8px',
      display: 'flex',
    },
  };

  return (
    <>
      <Stack
        // spacing={2}
        alignItems="center"
        direction={isBelow600px ? 'column' : 'row'}
        sx={{ p: 2.5, width: '100%', gap: 2 }}
      >
        {/* Search field */}
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            value={filters.state.name}
            onChange={handleFilterName}
            placeholder="Search by integrate application name..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Action button that appears when rows are selected */}

        {/* Buttons container */}
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
            <Tooltip title="Available actions for selected item(s)" arrow placement="top">
              <Button
                color="primary"
                endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  ...buttonStyle,
                  whiteSpace: 'nowrap',
                  // width: '200px',
                }}
              >
                Select Actions
              </Button>
            </Tooltip>
          )}
          <Tooltip
            title="Click here to integrate a new third party application for email verification."
            arrow
            placement="top"
          >
            <Button
              sx={{
                ...buttonStyle,
                whiteSpace: 'nowrap',

              }}
              size="large"
              color="primary"
            
              onClick={() => handleOpenDialog()} // Add arrow function here// Open TeamMemberDialog
              startIcon={
                <Iconify icon="heroicons:plus-circle-16-solid" style={{ width: 18, height: 18 }} />
              }
            >
              Integrate
            </Button>
          </Tooltip>
          <Tooltip title=" Click here to refresh data." arrow placement="top" disableInteractive>
            <Button
              sx={{
                ...buttonStyle,
                whiteSpace: 'nowrap',
              }}
              size="large"
              color="primary"
            >
              <Iconify
                icon="tabler:refresh"
                sx={{ width: '24px', height: '24px', color: 'primary' }}
                cursor="pointer"
              />
            </Button>
          </Tooltip>
        </Box>
      </Stack>

      <CustomPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuList>
          {[{ value: 'delete', label: 'Delete List', icon: 'solar:trash-bin-trash-bold' }].map(
            (option) => (
              <Tooltip
                title="Delete all the selected integrated applications."
                arrow
                placement="left"
              >
                <MenuItem
                  selected={option.value === publish}
                  onClick={() => {
                    handlePopoverClose();
                    onChangePublish(option.value);
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" />
                  Delete
                </MenuItem>
              </Tooltip>
            )
          )}
        </MenuList>
      </CustomPopover>
      {/*  Filter Task */}
      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box
          sx={{
            width: {
              xs: '100%',
              sm: '100%',
              md: 650,
            },
            flexDirection: {
              xs: 'column',
              sm: 'column',
              md: 'row',
            },
          }}
        >
          {/* Filter Header */}
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
                <Tooltip title="Filter your email verification logs." arrow placement="top">
                  <span> Filter Action</span>
                </Tooltip>
              </Typography>
            </Box>
            <Iconify
              icon="uil:times"
              onClick={handleFilterClose}
              style={{
                width: 20,
                height: 20,
                cursor: 'pointer',
                color: '#637381',
              }}
            />
          </Box>

          {/* Filter Options */}
          <Box
            sx={{
              p: '16px 16px 0px 16px',
              gap: 2,
              flexDirection: {
                xs: 'column',
                sm: 'column',
                md: 'row',
              },
            }}
          >
            {/* Application Name */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: {
                  xs: 'column',
                  sm: 'column',
                  md: 'row',
                },
                gap: 2,
                mb: 2,
              }}
            >
              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 }, justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>Action</Typography>
              </FormControl>

              <FormControl
                fullWidth
                sx={{
                  mb: { xs: 2, sm: 2, md: 0 },
                  width: { xs: '100%', sm: '100%', md: '390px' },
                }}
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
                    '& .MuiInputBase-input': {
                      fontSize: '14px',
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                    },
                  }}
                  size="small"
                  options={applicationName}
                  value={selectedApplicationName}
                  onChange={(event, newValue) => setSelectedApplicationName(newValue)}
                  renderInput={(params) => <TextField {...params} label="Select" />}
                  // sx={{ width: 300 }}
                />
              </FormControl>
            </Box>
          </Box>

          {/* Filter Footer */}
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
