import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Tooltip, Checkbox, IconButton, Typography } from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function SmtpTableRow({ row, selected, onSelectRow, onOpenPopover }) {
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
              event.stopPropagation(); // Keep this if you need to prevent row click events
              onSelectRow(); // This will now work properly
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
                ? `SMTP is enabled for sending email notifications.`
                : `SMTP is disabled  for sending email notifications.`
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
            title={`Last Updated: ${row.last_updated}${timezone}.`}
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
              {row.last_updated}
            </Box>
          </Tooltip>
          </Typography>

        
        </Box>
      </TableCell>
      <TableCell>
        <Tooltip
          arrow
          placement="top"
          disableInteractive
          title={`View the SMTP server's host address used for sending emails: ${row.host}.`}
        >
          <Box
            component="span"
            sx={{
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {row.host}
          </Box>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Tooltip
          arrow
          placement="top"
          disableInteractive
          title={`View the port number used by the SMTP server for communication: ${row.port}.`}
        >
          <Box
            component="span"
            sx={{
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              // maxWidth: '100px',
              // display: 'inline-block',
            }}
          >
            {row.port}
          </Box>
        </Tooltip>
      </TableCell>
      <TableCell align="right">
        <Tooltip
          arrow
          placement="top"
          disableInteractive
          title={`View the encryption method used for secure communication with the SMTP server: ${row.encryption_method}.`}
        >
          <Box
            component="span"
            sx={{
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              // maxWidth: '100px',
              // display: 'inline-block',
            }}
          >
            {row.encryption_method}
          </Box>
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
