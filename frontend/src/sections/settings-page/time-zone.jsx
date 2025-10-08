import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Card,
  Button,
  Select,
  Divider,
  Tooltip,
  useTheme,
  MenuItem,
  TextField,
  CardHeader,
  Typography,
  InputLabel,
  FormControl,
  FormHelperText,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

// eslint-disable-next-line import/no-unresolved
import { CONFIG } from 'src/config-global';
// eslint-disable-next-line import/no-unresolved
import { saveTimeZone, fetchTimeZones,  fetchUserTimeZone, setSelectedTimeZone } from 'src/redux/slice/timeZoneSlice';

// eslint-disable-next-line import/no-unresolved
import { Iconify } from 'src/components/iconify';



// ----------------------------------------------------------------------

const metadata = { title: `Time-Zone | ${CONFIG.site.name}` };

export default function Page() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const searchInputRef = useRef(null);

  // Redux state
  const { timeZones, selectedTimeZone, loading } = useSelector((state) => state.timeZone);
  
  // Local state
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch timezones and user timezone on component mount
  useEffect(() => {
    dispatch(fetchTimeZones());
    dispatch(fetchUserTimeZone());
  }, [dispatch]);

  // Update local state when Redux state changes
  useEffect(() => {
    if (selectedTimeZone.key) {
      setSelectedTimezone(selectedTimeZone.key);
    }
  }, [selectedTimeZone]);

  const handleTimezoneChange = (event) => {
    const timezoneKey = event.target.value;
    setSelectedTimezone(timezoneKey);
    
    // Find the timezone object and update Redux state
    const timezoneObj = timeZones.find(tz => tz.key === timezoneKey);
    if (timezoneObj) {
      dispatch(setSelectedTimeZone(timezoneObj));
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTimezones = timeZones.filter(
    (tz) => tz.display.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleSaveTimezone = async () => {
    if (!selectedTimezone) {
      toast.error('Please select a timezone');
      return;
    }

    try {
      const timezoneObj = timeZones.find(tz => tz.key === selectedTimezone);
      if (timezoneObj) {
        await dispatch(saveTimeZone(timezoneObj)).unwrap();
        toast.success('Timezone updated successfully', {
          style: {
            marginTop: '15px',
          },
        });
      }
    } catch (error) {
      toast.error('Failed to update timezone');
    }
  };

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <Box sx={{ mt: 4 }}>
        <Card>
          <CardHeader
            title={
              <Typography variant="h6" sx={{ cursor: 'pointer' }}>
                <Tooltip
                  title="Choose the time zone for your account. All dates and times will align with this setting."
                  disableInteractive
                  arrow
                  placement="top"
                >
                  <span>Time Zone</span>
                </Tooltip>
              </Typography>
            }
            sx={{ mb: 3 }}
          />
          <Divider />
          <Box sx={{ p: 3 }}>
           

           

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="time-zone-select-label">Select Time Zone</InputLabel>

              <Select
                labelId="time-zone-select-label"
                id="time-zone-select"
                value={selectedTimezone}
                label="Select Time Zone"
                onChange={handleTimezoneChange}
              
                IconComponent={() => (
                  <Iconify width={24} icon="iconamoon:arrow-down-2-bold" sx={{ mr: 1 }} />
                )}
                MenuProps={{
                  PaperProps: {
                    style: {
                      width: 250,
                      maxHeight: 450,
                    },
                  },
                }}
              >
                <Box sx={{ p: 2, position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.paper' }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search time zone..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    inputRef={searchInputRef}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="eva:search-fill" width={24} height={24} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                {filteredTimezones.map((tz) => (
                  <MenuItem key={tz.key} value={tz.key}>
                    {tz.display}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Select the time zone that matches your current location.{' '}
                <a
                  href="https://forum.pabbly.com/threads/how-to-set-your-time-zone-in-pabbly-hook.25576/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}
                >
                  Learn more
                </a>
              </FormHelperText>
            </FormControl>
            <Box>
              <Tooltip
                title="Click 'Save' to apply the selected time zone to your account"
                arrow
                placement="top"
              >
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveTimezone}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Box>
        </Card>
      </Box>

    
    </>
  );
}
