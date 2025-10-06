import React from 'react';
import { useSelector } from 'react-redux';

import { Box, Tooltip } from '@mui/material';

// Utility to format the date and time in 24-hour format
const formatDateTime = (dateTime, tz) => {
  const date = new Date(dateTime);
  return date.toLocaleString('en-US', {
    timeZone: tz || 'UTC',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const DateTime = ({
  createdAt,
  tooltipText,
  color = 'text.disabled', // Default text color
  tooltipPlacement = 'bottom', // New prop for tooltip placement
}) => {
  const selectedTimeZone = useSelector((state) => state.timeZone?.selectedTimeZone);
  
  if (!createdAt) return null;
  const tzKey = selectedTimeZone?.key || 'UTC';
  const tzDisplay = selectedTimeZone?.value || '';
  const formattedTime = formatDateTime(createdAt, tzKey);
  const tooltipContent =
    tooltipText || `Execution Time: ${formattedTime}, ${tzDisplay} ${tzKey}`;

  return (
    <Box
      sx={{
        typography: 'body2',
        color, // Use the shorthand syntax
        mt: 0.5,
        whiteSpace: 'nowrap',
      }}
    >
      <Tooltip title={tooltipContent} placement={tooltipPlacement} arrow>
        {formattedTime}
      </Tooltip>
    </Box>
  );
};

export default DateTime;
