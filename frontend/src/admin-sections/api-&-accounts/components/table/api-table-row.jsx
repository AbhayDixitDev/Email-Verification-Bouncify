import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Tooltip, Checkbox, IconButton, Typography } from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function ApiTableRow({ row, selected, onSelectRow, onOpenPopover }) {
  const popover = usePopover();
  const timezone = ', (UTC+05:30) Asia/Kolkata';

  const truncateText = (text, maxLength = 37) =>
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };
  const getStatusLabel = (status) => status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <TableRow hover selected={selected} sx={{ cursor: 'pointer' }}>
      <TableCell padding="checkbox">
        <Tooltip arrow placement="top" disableInteractive title="Select">
          <Checkbox
            checked={selected}
            onChange={(event) => {
              event.stopPropagation();
              onSelectRow();
            }}
            inputProps={{ 'aria-labelledby': row.id }}
          />
        </Tooltip>
      </TableCell>
      <TableCell>

        <Box>
          <Tooltip
            arrow
            placement="top"
            disableInteractive
            title={`${
              row.status === 'active'
                ? `Third-party email verification application API is being used to verify the email list.`
                : `Third-party email verification application API is not being used to verify the email list.
`
            }`}
          >
            <Label
              variant="soft"
              color={getStatusColor(row.status)}
              sx={{ textTransform: 'capitalize' }}
            >
              {getStatusLabel(row.status)}
            </Label>
          </Tooltip>
          <Typography variant="body2">
            <Tooltip
              arrow
              placement="top"
              title={`Name of the third party email verification application: ${row.name}.`}
              disableInteractive
            >
              <span>{truncateText(`${row.name}`)}</span>
            </Tooltip>
          </Typography>

          <Tooltip
            arrow
            placement="top"
            title={`Last Updated: ${row.last_used}${timezone}.`}
            disableInteractive
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
              {row.last_used}
            </Box>
          </Tooltip>
        </Box>
      </TableCell>
    
      <TableCell align="right">
        <Tooltip
          arrow
          placement="top"
          disableInteractive
          title={`Balance remaining: ${row.balance}.`}
        >
          {row.balance}
        </Tooltip>
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
  );
}
