import dayjs from 'dayjs';
import { useState } from 'react';
import { useTheme } from '@emotion/react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  Button,
  Popover,
  Tooltip,
  Typography,
  FormControl,
  Autocomplete,
  useMediaQuery,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

export function ActivityLogTableToolbar({ filters, onResetPage }) {
  const theme = useTheme();
  const isBelow600px = useMediaQuery(theme.breakpoints.down('sm'));

  // Combined filter states
  const [filterState, setFilterState] = useState({
    user: {
      condition: null,
      search: '',
    },
    sectionSource: {
      condition: null,
      type: null,
    },
    eventStatus: {
      condition: null,
      type: null,
    },
    activityData: {
      condition: null,
      search: '',
    },
    actorEmail: {
      condition: null,
      search: '',
    },
  });

  // UI states
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isFilterApplied, setFilterApplied] = useState(false);

  const filterfirstfield = ['Equals', 'Not Equals to', 'Contains', 'Does not contains'];
  const filtersecondfield = ['All', 'API', 'User'];
  const status = ['All', 'Created', 'Updated','Deleted'];

  // Check if any filter field is filled
  const hasAnyFilterSelected = Object.values(filterState).some((section) =>
    Object.values(section).some((value) => value !== null && value !== '')
  );

  const handleFilterName = (event) => {
    onResetPage();
    filters.setState({ name: event.target.value });
  };

  const handleFilterChange = (section, field, value) => {
    setFilterState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const resetFilters = () => {
    setFilterState({
      user: { condition: null, search: '' },
      sectionSource: { condition: null, type: null },
      eventStatus: { condition: null, search: null },
      actorEmail: { condition: null, search: '' },
      activityData: { condition: null, search: '' },
    });
    setFilterApplied(false);
  };

  const handleFilterIconClick = (e) => {
    e.stopPropagation();
    if (isFilterApplied) {
      handleFilterClose();
      resetFilters();
    }
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
      setFilterApplied(true);
      handleFilterClose();
    }
  };
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState(dayjs(new Date()));
  const [error, setError] = useState('');
  const datePickerStyle = {
    height: '30px',
    '& .MuiInputBase-input': {
      height: 'auto',
      padding: '8px 14px',
    },
  };
  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    if (endDate && newValue && endDate.isBefore(newValue)) {
      setEndDate(null);
    } else {
      setError('');
    }
  };
  const handleEndDateChange = (newValue) => {
    if (startDate && newValue && newValue.isBefore(startDate)) {
      return;
    }
    setEndDate(newValue);
    setError('');
  };
  const textFieldProps = {
    fullWidth: true,
    sx: {
      '& .MuiOutlinedInput-input': {
        height: 'auto',
        padding: '8px 14px',
        fontSize: '14px',
      },
      '& .MuiInputLabel-root': {
        fontSize: '14px',
      },
    },
  };

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
        spacing={2}
        alignItems="center"
        direction={isBelow600px ? 'column' : 'row'}
        // sx={{ p: 2.5, width: '100%', gap: 1 }}
      >
        {/* <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            value={filters.state.name}
            onChange={handleFilterName}
            placeholder="Search by actor email..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box> */}

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
                : 'Filter your activity logs.'
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
      </Stack>
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
                <Tooltip title="Filter your activity logs." arrow placement="top">
                  <span>Filter</span>
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
            
            {/* Date range */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: {
                  xs: 'column', // Stack vertically on mobile
                  sm: 'column', // Stack vertically on tablet
                  md: 'row', // Arrange in row on desktop
                },
                gap: 2,
                mb: 2,
              }}
            >
              <FormControl  sx={{ width: "250px", mb: { xs: 2, sm: 2, md: 0 }, justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                  <Tooltip
                    title="Filter logs by selecting start date and end date to view only the logs within this range."
                    arrow
                    placement="top"
                  >
                  Date Range
                  </Tooltip>
                </Typography>
              </FormControl>

              <FormControl
                fullWidth
                sx={{
                  mb: { xs: 2, sm: 2, md: 0 },
                  width: { xs: '100%', sm: '100%', md: '220px' }, // Responsive width
                }}
              >
                <TextField
                  id="select-currency-label-x"
                  variant="outlined"
                  fullWidth
                  label="Between"
                  disabled
                  size="small"
                />
              </FormControl>

              {/* DatePicker */}
              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <Stack direction="row" spacing={2} flexGrow={1}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Tooltip
                      title={
                        startDate
                          ? dayjs(startDate).format('MM/DD/YYYY HH:mm')
                          : 'Select date and time'
                      } // Formats date and time
                      arrow
                      placement="top"
                    >
                      <div style={{ width: '350px' }}>
                        <DateTimePicker
                          sx={{ datePickerStyle, alignItems: 'center', alignContent: 'center' }}
                          // size="small"
                          label="Start Date"
                          value={startDate}
                          minDate={dayjs('2017-01-01')}
                          onChange={handleStartDateChange}
                          slotProps={{
                            textField: textFieldProps,
                          }}
                        />
                      </div>
                    </Tooltip>
                  </LocalizationProvider>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Tooltip
                      title={
                        startDate
                          ? dayjs(endDate).format('MM/DD/YYYY HH:mm')
                          : 'Select date and time'
                      } // Formats date and time
                      arrow
                      placement="top"
                    >
                      <div style={{ width: '350px' }}>
                        <DateTimePicker
                          sx={datePickerStyle}
                          size="small"
                          label="End Date"
                          value={endDate}
                          minDate={startDate || dayjs('2017-01-01')}
                          onChange={handleEndDateChange}
                          slotProps={{
                            textField: textFieldProps,
                          }}
                        />
                      </div>
                    </Tooltip>
                  </LocalizationProvider>
                </Stack>
              </FormControl>
            </Box>

             {/* Status */}
             <Box
              sx={{
                display: 'flex',
                flexDirection: {
                  xs: 'column', // Stack vertically on mobile
                  sm: 'column', // Stack vertically on tablet
                  md: 'row', // Arrange in row on desktop
                },
                gap: 2,
                mb: 2,
              }}
            >
              <FormControl  sx={{ width:"250px", mb: { xs: 2, sm: 2, md: 0 }, justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                <Tooltip
                    title="Filter logs by selecting status to view only the logs of specific status."
                    arrow
                    placement="top"
                  >
                    <span>Status</span>
                  </Tooltip></Typography>
              </FormControl>

              <FormControl
                fullWidth
                sx={{
                  mb: { xs: 2, sm: 2, md: 0 },
                  width: { xs: '100%', sm: '100%', md: '220px' },
                }}
              >
                <TextField
                  id="select-currency-label-x"
                  variant="outlined"
                  fullWidth
                  label="Equal"
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
                  options={status}
                  // value={selectedStatus}
                  value={filterState.eventStatus.condition}
                  onChange={(_, newValue) =>
                    handleFilterChange('eventStatus', 'condition', newValue)
                  }
                  renderInput={(params) => <TextField {...params} label="Select" />}
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
              <FormControl  sx={{ width:"250px", mb: { xs: 2, sm: 2, md: 0 }, justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                  <Tooltip
                    title="Filter logs by searching actor email to view only by this email."
                    arrow
                    placement="top"
                  >
                    <span>Actor Email</span>
                  </Tooltip>
                </Typography>
              </FormControl>

              <FormControl
                fullWidth
                sx={{
                  mb: { xs: 2, sm: 2, md: 0 },
                  width: { xs: '100%', sm: '100%', md: '220px' },
                }}
              >
                <TextField
                  id="select-currency-label-x"
                  variant="outlined"
                  fullWidth
                  label="Equal"
                  disabled
                  size="small"
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Search"
                  size="small"
                  value={filterState.actorEmail.search}
                  onChange={(e) => handleFilterChange('actorEmail', 'search', e.target.value)}
                />
              </FormControl>
            </Box>
          

         
            {/* Event Source Filter Section */}
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
              <FormControl  sx={{ width:"250px", mb: { xs: 2, sm: 2, md: 0 }, justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                  <Tooltip
                    title="Filter logs by selecting source to view only the logs of specific source."
                    arrow
                    placement="top"
                  >
                    <span>Source</span>
                  </Tooltip>
                </Typography>
              </FormControl>

              <FormControl
                fullWidth
                sx={{
                  mb: { xs: 2, sm: 2, md: 0 },
                  width: { xs: '100%', sm: '100%', md: '220px' },
                }}
              >
                <TextField
                  id="select-currency-label-x"
                  variant="outlined"
                  fullWidth
                  label="Equal"
                  disabled
                  size="small"
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <Autocomplete
                  size="small"
                  options={filtersecondfield}
                  value={filterState.sectionSource.type}
                  onChange={(_, newValue) => handleFilterChange('sectionSource', 'type', newValue)}
                  renderInput={(params) => <TextField {...params} label="All" />}
                />
              </FormControl>
            </Box>

            {/* Activity Data Filter Section */}
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
              <FormControl  sx={{ width:"250px", mb: { xs: 2, sm: 2, md: 0 }, justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                  <Tooltip
                    title="Filter logs by searching activity data to view only by this data."
                    arrow
                    placement="top"
                  >
                    <span>Activity Data</span>
                  </Tooltip>
                </Typography>
              </FormControl>

              <FormControl
                fullWidth
                sx={{
                  mb: { xs: 2, sm: 2, md: 0 },
                  width: { xs: '100%', sm: '100%', md: '220px' },
                }}
              >
                <TextField
                  id="select-currency-label-x"
                  variant="outlined"
                  fullWidth
                  label="Equal"
                  disabled
                  size="small"
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Search"
                  size="small"
                  value={filterState.activityData.search}
                  onChange={(e) => handleFilterChange('activityData', 'search', e.target.value)}
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
