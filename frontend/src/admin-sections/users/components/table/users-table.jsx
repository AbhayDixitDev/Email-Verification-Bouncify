import { useTheme } from '@emotion/react';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import {
  Tab,
  Tabs,
  Alert,
  Button,
  Divider,
  Tooltip,
  MenuList,
  MenuItem,
  Snackbar,
  CardHeader,
  Typography,
} from '@mui/material';

import { useSetState } from 'src/hooks/use-set-state';

import { fIsBetween } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';
import { USER_STATUS_OPTIONS } from 'src/_mock/_table/_admintable/_users';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomPopover } from 'src/components/custom-popover';
import {
  useTable,
  rowInPage,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { UsersTableRow } from './users-table-row';
import AddDialog from '../dialog/update-credits-dialog';
import { UsersTableToolbar } from './users-table-toolbar';
import { UsersTableFiltersResult } from './users-table-filters-result';
import { CustomerDetailsDrawer } from '../../../email-lists/components/drawers/customer-drawer';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All', tooltip: 'All uploaded lists.' },
  ...USER_STATUS_OPTIONS,
];
const TABLE_HEAD = [
  // {
  //   id: 'id',
  //   label: 'ID',
  //   width: 'flex',
  //   whiteSpace: 'nowrap',
  //   tooltip: 'Date and time when the email verification action occurred.',
  // },

  {
    id: 'name',
    label: 'Status & Name',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'Description of the email verification action or status update.',
  },

  {
    id: 'email',
    label: 'Email',
    width: 'flex',
    whiteSpace: 'nowrap',

    tooltip: 'Details for the action happened to list.',
  },

  { id: '', width: 10 },
];

const dataOn = [
  {
    id: '565743434',
    name: 'Ankit Mandli',
    email: 'ankit.mandli@pabbly.com',
    status: 'active',
  },
  {
    id: '512',
    name: 'Ankit Mandliii',
    email: 'ankit.mandli@pabbly.com',
    status: 'inactive',
  },
];

// ----------------------------------------------------------------------

export function UsersTable() {
  const table = useTable({
    defaultOrderBy: 'orderNumber',
    defaultSelected: [], // Add this to initialize selected state
  });

  const [tableData, setTableData] = useState(dataOn);

  const filters = useSetState({
    name: '',
    status: 'all',
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpenPopover = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [selectedUserStatus, setSelectedUserStatus] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Modify the handleOpenPopover to store the selected row

  // Add a handler for the View User action
  const handleViewUser = () => {
    if (selectedRow) {
      setSelectedUserId(selectedRow.id);
      setSelectedUserName(selectedRow.name);
      setSelectedUserEmail(selectedRow.email);
      setSelectedUserStatus(selectedRow.status);
      setDrawerOpen(true);
      handleClosePopover();
    }
  };

  const [addSubaccountDialogOpen, setAddSubaccountDialogOpen] = useState(false);
  const handleAddSubaccountDialogClose = () => setAddSubaccountDialogOpen(false); // State for Add Subaccount dialog

  const updateCredits = () => {
    setAddSubaccountDialogOpen(true);
    handleClosePopover();
  };

  const theme = useTheme();

  const [creditsValue, setCreditsValue] = useState('addCredits');
  const [creditsFieldValue, setCreditsFieldValue] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handle credits update
  const handleUpdateCredits = () => {
    // Validate minimum value before proceeding
    if (creditsFieldValue < 1) {
      setSnackbar({
        open: true,
        message: 'Credits value must be at least 1',
        severity: 'error',
      });
      return;
    }

    const action = creditsValue === 'addCredits' ? 'added to' : 'subtracted from';
    setSnackbar({
      open: true,
      message: `${creditsFieldValue} credits have been ${action} the account successfully!`,
      severity: 'success',
    });
    setAddSubaccountDialogOpen(false);
    // Reset values - set to 1 instead of 0 to maintain minimum value
    setCreditsValue('addCredits');
    setCreditsFieldValue(1);
  };

  // Add this function to handle credits field value changes
  const handleCreditsFieldValueChange = (value) => {
    // Ensure the value is at least 1
    const numericValue = Number(value);
    if (numericValue < 1) {
      setCreditsFieldValue(1);
    } else {
      setCreditsFieldValue(numericValue);
    }
  };
  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };
  return (
    <Card>
      <CardHeader
        title={
          <Box display="inline-block">
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title="View and manage all the users here."
            >
              <Typography variant="h6">Manage Users</Typography>
            </Tooltip>
          </Box>
        }
        sx={{ pb: 3 }}
      />
      <Divider />
      <Tabs
        value={filters.state.status}
        onChange={handleFilterStatus}
        sx={{
          px: 2.5,
          boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
        }}
      >
        {STATUS_OPTIONS.map((tab) => (
          <Tab
            key={tab.value}
            iconPosition="end"
            value={tab.value}
            label={
              <Tooltip disableInteractive placement="top" arrow title={tab.tooltip}>
                <span>{tab.label}</span>
              </Tooltip>
            }
            icon={
              <Label
                variant={
                  ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                  'soft'
                }
                color={
                  (tab.value === 'active' && 'success') ||
                  (tab.value === 'inactive' && 'error') ||
                  'default'
                }
              >
                {['active', 'inactive'].includes(tab.value)
                  ? tableData.filter((user) => user.status === tab.value).length
                  : tableData.length}
              </Label>
            }
          />
        ))}
      </Tabs>
      <UsersTableToolbar
        filters={filters}
        onResetPage={table.onResetPage}
        numSelected={table.selected.length} // Add this line
      />

      {canReset && (
        <UsersTableFiltersResult
          filters={filters}
          totalResults={dataFiltered.length}
          onResetPage={table.onResetPage}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <Box sx={{ position: 'relative' }}>
        <Scrollbar
        //  sx={{ minHeight: 444 }}
        >
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              showCheckbox={false}
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
            />

            <TableBody>
              {dataInPage
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row, index) => (
                  <UsersTableRow
                    key={index}
                    row={row}
                    selected={table.selected.includes(row)}
                    onOpenPopover={(event) => handleOpenPopover(event, row)}
                    onSelectRow={() => {
                      table.onSelectRow(row.id); // Make sure this is called correctly
                    }}
                  />
                ))}

              <TableEmptyRows
                height={table.dense ? 56 : 56 + 20}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataOn.length)}
              />
              {tableData.length === 0 ? (
                <TableNoData
                  title="Not Data Found"
                  description="No data found in the table"
                  notFound={notFound}
                />
              ) : (
                <TableNoData
                  title="Not Search Found"
                  description={`No search found with keyword "${filters.state.name}"`}
                  notFound={notFound}
                />
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </Box>
      <CustomPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <Tooltip title="View user." arrow placement="left">
            <MenuItem onClick={handleViewUser}>
              <Iconify icon="mdi:eye" />
              View User
            </MenuItem>
          </Tooltip>
          {selectedRow && selectedRow.status === 'inactive' ? (
            <MenuItem
              onClick={() => {
                // Add your activation logic here
                handleClosePopover();
              }}
            >
              <Iconify icon="ic:round-toggle-on" />
              Mark as Active
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                // Add your deactivation logic here

                handleClosePopover();
              }}
            >
              <Iconify icon="ic:round-toggle-off" />
              Mark as Inactive
            </MenuItem>
          )}
          <Tooltip title="View user." arrow placement="left">
            <MenuItem onClick={updateCredits}>
              <Iconify icon="fluent:edit-48-filled" />
              Update Credits
            </MenuItem>
          </Tooltip>
        </MenuList>
      </CustomPopover>
      <AddDialog
        addDialogOpen={addSubaccountDialogOpen}
        handleDialogClose={handleAddSubaccountDialogClose}
        creditsValue={creditsValue}
        setCreditsValue={setCreditsValue}
        creditsFieldValue={creditsFieldValue}
        setCreditsFieldValue={setCreditsFieldValue}
        action={
          <Button variant="contained" color="primary" onClick={handleUpdateCredits}>
            Update
          </Button>
        }
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          mt: 7,
          boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            '& .MuiAlert-icon': {
              color:
                snackbar.severity === 'error'
                  ? theme.palette.error.main
                  : theme.palette.success.main,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <CustomerDetailsDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId}
        userName={selectedUserName}
        userEmail={selectedUserEmail}
        userStatus={selectedUserStatus}
      />
      <TablePaginationCustom
        page={table.page}
        count={dataFiltered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate } = filters;

  let filteredData = inputData;

  // Filter by message (name)
  if (name) {
    filteredData = filteredData.filter(
      (order) =>
        (order.name && order.name.toLowerCase().includes(name.toLowerCase())) ||
        (order.email && order.email.toLowerCase().includes(name.toLowerCase()))
    );
  }

  // Filter by status
  if (status !== 'all') {
    filteredData = filteredData.filter((order) => order.status === status);
  }

  // Filter by date range
  if (!dateError) {
    if (startDate && endDate) {
      filteredData = filteredData.filter((order) =>
        fIsBetween(new Date(order.dateCreatedOn), startDate, endDate)
      );
    }
  }

  return filteredData;
}
