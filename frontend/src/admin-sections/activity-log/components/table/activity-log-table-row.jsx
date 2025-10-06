import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function ActivityLogTableRow({ row, selected, onOpenDrawer }) {
  const timezone = '(UTC+05:30) Asia/Kolkata';

  const getStatusColor = (status) => {
    switch (status) {
      case 'created':
        return 'success';
      case 'updated':
        return 'warning';
      case 'deleted':
        return 'error';
      default:
        return 'default';
    }
  };
  const getStatusLabel = (status) => status.charAt(0).toUpperCase() + status.slice(1);

  // Limit bullet points to a maximum of 20

  const renderPrimary = (
    <TableRow hover selected={selected} sx={{ cursor: 'pointer' }}>
      <TableCell>
        <Stack spacing="5px" direction="column">
          <Box>
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={
                row.status === 'deleted'
                  ? 'Delete means to actions such as deleting email lists, connected integrations, and connected SMTPs. '
                  : row.status === 'updated'
                    ? 'Updated means to actions such as updating existing integrations, connected SMTPs, and downloading the verification report.'
                    : row.status === 'created'
                      ? 'Create means to actions such as adding a new email verification API in the integration section and adding a new SMTP in the email notification section.'
                      : `${row.status.charAt(0).toUpperCase() + row.status.slice(1)} action has been performed`
              }
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
              color: 'text.disabled',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '300px',
              display: 'inline-block',
            }}
          >
                        <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={`Action Performed: ${fDateTime(row.date)}, ${timezone}.`}
            >
              {fDateTime(row.date)}
            </Tooltip>
          </Box>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack direction="column">
          <Box
            component="span"
            sx={{
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '400px',
              display: 'inline-block',
            }}
          >
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title="Name of the actor who performed the activity."
            >
              <span> {row.actor_name}</span>
            </Tooltip>
          </Box>

          <Box
            component="span"
            sx={{
              color: 'text.disabled',
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
              title="Email address of the actor who performed the activity."
            >
              <span>{row.actor_email}</span>
            </Tooltip>
          </Box>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack direction="column">
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
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title="View the section where the action occurred."
            >
              <span>{row.section}</span>
            </Tooltip>
          </Box>

          <Box
            component="span"
            sx={{
              color: 'text.disabled',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '300px',
              display: 'inline-block',
            }}
          >
            {' '}
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title="View whether the action was performed by a user or an API."
            >
              <span>{row.source}</span>
            </Tooltip>
          </Box>
        </Stack>
      </TableCell>

      <TableCell align="right">
        <Tooltip
          arrow
          placement="top"
          disableInteractive
          title="Click to view the activity data recorded during the action performed."
        >
          <Box
            onClick={() => onOpenDrawer(row)}
            component="span"
            sx={{
              color: '#078DEE',
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '300px',
              display: 'inline-block',
            }}
          >
            {row.activity_data}
          </Box>
        </Tooltip>
      </TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
}
