import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Tooltip, IconButton } from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function UsersTableRow({ row, selected, onSelectRow, onOpenPopover }) {
  const popover = usePopover();
  const timezone = ', (UTC+05:30) Asia/Kolkata';

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
      {/* <TableCell width={100}>
        <Stack spacing={2} direction="row" alignItems="center">
          <Tooltip arrow placement="top" disableInteractive title={`ID of the user: ${row.id}.`}>
            <Box
              component="span"
              sx={{
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100px',
                display: 'inline-block',
              }}
            >
              {row.id}
            </Box>
          </Tooltip>
        </Stack>
      </TableCell> */}

      <TableCell width={300}>
        <Stack direction="column" spacing={1}>
          <Box>
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={`Status of user: ${row.status === 'active' ? `Active` : `Inactive`}`}
            >
              <Label
                variant="soft"
                color={getStatusColor(row.status)}
                sx={{ textTransform: 'capitalize' }}
              >
                {getStatusLabel(row.status)}
              </Label>
            </Tooltip>
          </Box>

          <Box
            component="span"
            sx={{
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '200px',
              display: 'inline-block',
            }}
          >
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={`Name of the user: ${row.name}.`}
            >
              <span>{row.name}</span>
            </Tooltip>
          </Box>
        </Stack>
      </TableCell>

      <TableCell width={340}>
        <Tooltip
          arrow
          placement="top"
          disableInteractive
          title={`Email of the user: ${row.email}.`}
        >
          <Box
            component="span"
            sx={{
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '300px',
              display: 'inline-block',
            }}
          >
            {row.email}
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
