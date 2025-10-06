import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Tooltip, Checkbox, IconButton } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function PlansTableRow({ row, selected, onSelectRow, onOpenPopover }) {
  const popover = usePopover();

  const timezone = ', (UTC+05:30) Asia/Kolkata';

  const renderPrimary = (
    <TableRow hover selected={selected} sx={{ cursor: 'pointer' }}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onChange={(event) => {
            event.stopPropagation(); // Keep this if you need to prevent row click events
            onSelectRow(); // This will now work properly
          }}
          inputProps={{ 'aria-labelledby': row.id }}
        />
      </TableCell>
      {/* <TableCell >
        <Stack spacing={2} direction="row" alignItems="center">
          <Tooltip arrow placement="top" disableInteractive title={`ID of the plan: ${row.id}.`}>
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
      <TableCell >
        <Stack spacing={2} direction="row" alignItems="center">
          <Tooltip arrow placement="top" disableInteractive title={`Plan Name: ${row.name}.`}>
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
              {row.name}
            </Box>
          </Tooltip>
        </Stack>
      </TableCell>

      <TableCell>
        <Tooltip arrow placement="top" disableInteractive title={`Credits: ${row.credits}.`}>
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
            {row.credits}
          </Box>
        </Tooltip>
      </TableCell>
      <TableCell >
        <Tooltip arrow placement="top" disableInteractive title={`Ammount: ${row.amount}.`}>
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
            {row.amount}
          </Box>
        </Tooltip>
      </TableCell>

      {/* <TableCell >
        <Tooltip
          arrow
          placement="top"
          disableInteractive
          title={`Pabbly plan id: ${row.pabbly_plan_id}.`}
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
            {row.pabbly_plan_id}
          </Box>
        </Tooltip>
      </TableCell>
      <TableCell align="right" >
        <Tooltip arrow placement="top" disableInteractive title={`Plan code: ${row.plan_code}.`}>
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
            {row.plan_code}
          </Box>
        </Tooltip>
      </TableCell> */}

      {/* <TableCell width={140} align="right">
        <Tooltip
          arrow
          placement="top"
          disableInteractive
          title={`Status of plan: ${row.status === 'verified' ? `Completed` : `Unprocessed`}`}
        >
          <Label
            variant="soft"
            color={getStatusColor(row.status)}
            sx={{ textTransform: 'capitalize' }}
          >
            {getStatusLabel(row.status)}
          </Label>
        </Tooltip>
      </TableCell> */}

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

  return <>{renderPrimary}</>;
}
