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
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

export function EmailListTableToolbar({
  filters,
  onResetPage,
  publish,
  onChangePublish,
  numSelected,
}) {
  const theme = useTheme();
  const isBelow600px = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const apiType = ['All', 'Verified', 'Unverified', 'Processing'];

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
      filters.setState({ apiType: '' }); // Add this line
      setFilterApplied(false);
    }
  };
  const hasAnyFilterSelected = Boolean(selectedApplicationName);

  const resetFilters = () => {
    setSelectedApplicationName(null);
    filters.setState({ apiType: '' }); // Add this line
    setFilterApplied(false);
  };

  const handleFilterButtonClick = (e) => {
    if (!isFilterApplied || e.target.tagName !== 'svg') {
      setFilterAnchorEl(e.currentTarget);
    }
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleApplyFilter = () => {
    if (hasAnyFilterSelected) {
      filters.setState({ apiType: selectedApplicationName }); // Add this line
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
        // sx={{ p: 2.5, width: '100%', gap: 1 }}
      >
        {/* Search field */}
        {/* <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            value={filters.state.name}
            onChange={handleFilterName}
            placeholder="Search by email list name or customer email..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box> */}

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
                }}
              >
                Select Actions
              </Button>
            </Tooltip>
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
                : 'Filter your email verification logs.'
            }
            arrow
            placement="top"
          >
            <Button
              sx={{
                ...buttonStyle,
                whiteSpace: 'nowrap',
                color: isFilterApplied ? 'common.white' : theme.palette.primary.main,

                '&:hover': {
                  backgroundColor: isFilterApplied ? '' : '#ECF6FE', // Matches hover effect for Select Actions button
                },
              }}
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
                      style={{
                        width: 22,
                        height: 22,
                        cursor: 'pointer',
                      }}
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
        {/* <Box>
          <Tooltip title="Click here to refresh data." arrow placement="top">
            <Button
              sx={{
                // ...buttonStyle,
                whiteSpace: 'nowrap',
                // width: isBelow600px ? '188px' : '188px',
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
        </Box> */}
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
              <Tooltip title="Delete all the selected lists." arrow placement="left">
                <MenuItem
                  selected={option.value === publish}
                  onClick={() => {
                    handlePopoverClose();
                    onChangePublish(option.value);
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" />
                  Delete List
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
                  <span> Filter</span>
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
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                  <Tooltip
                    title="Filter email lists by selecting verification status only the email lists within it will be shown."
                    arrow
                    placement="top"
                  >
                    Verification Status
                  </Tooltip>
                </Typography>
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
                  options={apiType}
                  value={selectedApplicationName}
                  onChange={(event, newValue) => setSelectedApplicationName(newValue)}
                  renderInput={(params) => <TextField {...params} label="Select" />}
                  // sx={{ width: 300 }}
                />
              </FormControl>
            </Box>
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
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                  <Tooltip
                    title="Filter the email lists based on specific email list ID."
                    arrow
                    placement="top"
                  >
                    <span>Email List ID</span>
                  </Tooltip>
                </Typography>
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
                <TextField variant="outlined" fullWidth label="Search" size="small" />
              </FormControl>
            </Box>
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
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                  <Tooltip
                    title="Filter the email lists for specific Pabbly customer email."
                    arrow
                    placement="top"
                  >
                    <span>Customer Email</span>
                  </Tooltip>
                </Typography>
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
                <TextField variant="outlined" fullWidth label="Search" size="small" />
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
