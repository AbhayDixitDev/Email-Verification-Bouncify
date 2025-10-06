import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Tooltip, Typography } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Label } from 'src/components/label';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export function CreditTableRow({ row, selected }) {

  
  const getStatusTooltip = (status) => {
    switch (status) {
      case 'Deducted':
        return 'Credits were deducted from your account';
      case 'Added':
        return 'Credits were added to your account';
      default:
        return '';
    }
  };

  const getTypeTooltip = (type) => {
    switch (type) {
      case 'Bulk':
        return 'Bulk email verification';
      case 'Single':
        return 'Single email verification';
      case 'Credits':
        return 'Credits operation';
      default:
        return '';
    }
  };

  const getCreditChange = (type, credits) => type == 'DEDUCTION' ? `-${credits}` : `+${credits}`;

  const getCreditColor = (type) => {
    console.log(type);
    return type == 'DEDUCTION' ? 'error.main' : 'success.main';

  }

  return (
    <TableRow hover>
      {/* Type */}
      <TableCell>
        <Tooltip title={getTypeTooltip(row.type)} arrow>
          <Typography variant="body2">{row.type}</Typography>
        </Tooltip>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Label variant="soft" color={row.status == 'DEDUCTION' ? 'error' : 'success'}>
          {row.status}
        </Label>
      </TableCell>

      {/* Date */}
      <TableCell>
        <Tooltip title={`${row.date} (UTC+05:30) Asia/Kolkata`} arrow>
          <Typography variant="body2" color="text.secondary">
            {row.date}
          </Typography>
        </Tooltip>
      </TableCell>

      {/* Summary */}
      <TableCell>
        <Tooltip title={row.summary} arrow>
          <Typography 
            variant="body2" 
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '300px',
            }}
          >
            {row.summary}
          </Typography>
        </Tooltip>
      </TableCell>

      {/* Folder */}
      <TableCell>
        <Tooltip title={row.folder} arrow>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '150px',
            }}
          >
            {row.folder}
          </Typography>
        </Tooltip>
      </TableCell>

      {/* Credits */}
      <TableCell align="right">
        <Tooltip 
          title={row.status === 'DEDUCTION' ? 'Credits deducted' : 'Credits added'} 
          arrow
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: getCreditColor(row.status),
              fontWeight: 'medium'
            }}
          >
            {getCreditChange(row.status, row.credits)}
          </Typography>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
