import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Divider, Tooltip, MenuItem, MenuList, IconButton } from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function CreditTableRow({ row, selected }) {
  const popover = usePopover();
  const timezone = ', (UTC+05:30) Asia/Kolkata';

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'processing':
        return 'warning';
      case 'unverified':
        return 'error';
      default:
        return 'default';
    }
  };
  const getStatusLabel = (status) => status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <>
      <TableRow hover>
        <TableCell width={300}>
          <Stack spacing={2} direction="row" alignItems="center">
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={`Action occurred at: ${row.dateCreatedOn} ${timezone}`}
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
                {row.dateCreatedOn}
              </Box>
            </Tooltip>
          </Stack>
        </TableCell>

        <TableCell width={200}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={`Message for the action: ${row.message}`}
            >
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
                {row.message}
              </Box>
            </Tooltip>
          </Stack>
        </TableCell>

        <TableCell width={140}>
          <Tooltip arrow placement="top" disableInteractive title={`Action: ${row.action}`}>
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
              {row.action}
            </Box>
          </Tooltip>
        </TableCell>

        <TableCell width={140} align="right">
          <Tooltip
            arrow
            placement="top"
            disableInteractive
            title={`Status: ${row.credits === 'Alloted' ? `Credits Alloted ${row.noOfCredits}` : `Credits Consumed ${row.noOfCredits}`}`}
          >
            <Label
              variant="soft"
              color={getStatusColor(row.status)}
              sx={{ textTransform: 'capitalize' }}
            >
              {getStatusLabel(row.status)}
            </Label>
          </Tooltip>
        </TableCell>
        <TableCell
          align="right"
          sx={{ px: 1, whiteSpace: 'nowrap' }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Click to see options." arrow placement="top">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <Tooltip title="Update connection." arrow placement="left">
            <MenuItem sx={{ color: 'secondary' }}>
              <Iconify icon="material-symbols:settings-b-roll-rounded" />
              Update
            </MenuItem>
          </Tooltip>

          <Divider style={{ borderStyle: 'dashed' }} />

          <Tooltip title="Delete connection." arrow placement="left">
            <MenuItem sx={{ color: 'error.main' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          </Tooltip>
        </MenuList>
      </CustomPopover>
    </>
  );
}
