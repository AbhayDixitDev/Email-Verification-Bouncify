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
import { SMTP_STATUS_OPTIONS } from 'src/_mock/_table/_admintable/_users';

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

import { DeleteDialog } from 'src/sections/dialog-boxes/confirm-delete-dialog';

import { SmtpTableRow } from './smtp-table-row';
import AddSmtpDialog from '../dialog/smtp-dialog';
import { SmtpTableToolbar } from './smtp-table-toolbar';
import TestSmtpDialog from '../dialog/test-smtp-dialog';
import { SmtpTableFiltersResult } from './smtp-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  {
    value: 'all',
    label: 'All',
    tooltip: 'View all connected SMTPs, including both active and inactive.',
  },
  ...SMTP_STATUS_OPTIONS,
];
const TABLE_HEAD = [
  {
    id: 'status',
    label: 'SMTP Status',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'Shows whether the SMTP is active or inactive for sending email notifications.',
    align: 'left',
  },
  // {
  //   id: 'last_updated',
  //   label: 'Last Updated',
  //   width: 'flex',
  //   whiteSpace: 'nowrap',
  //   tooltip: 'View the date when the SMTP was last updated.',
  // },
  {
    id: 'host',
    label: 'SMTP Host',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'View the SMTP hostname.',
  },
  {
    id: 'port',
    label: 'SMTP Port',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'View the SMTP port number.',
  },

  {
    id: 'encryption_method',
    label: 'Encryption Method',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'View the encryption method for SMTP connection.',
    align: 'right',
  },

  { id: '', width: 10 },
];

const dataOn = [
  {
    id: '56545547951',
    host: 'smtp@nomail.nonet',
    port: '587',
    encryption_method: 'TLS',
    username: '45435@nomail.nocom',
    status: 'active',
    last_updated: 'Dec 19, 2024 10:24:25',
  },
  {
    id: '56545547952',
    host: 'highcardboard.nocom',
    port: '2525',
    encryption_method: 'None',
    username: '4587436@nomail.nocom',
    status: 'inactive',
    last_updated: 'Dec 18, 2024 5:43:20',
  },
];

// ----------------------------------------------------------------------

export function SmtpTable({ onEditClick, handleOpenDialog }) {
  const table = useTable({
    defaultOrderBy: 'orderNumber',
    defaultSelected: [], // Add this to initialize selected state
  });
  const theme = useTheme();
  const [tableData, setTableData] = useState(dataOn);

  const filters = useSetState({
    name: '',
    status: 'all',
    apiType: '', // Add this
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
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [testSmtpOpen, setTestSmtpOpen] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleDelete = () => {
    // confirmDelete.onFalse();
    setDeleteOpen(true);
    // setSnackbarState({
    //   open: true,
    //   message: 'Email list deleted successfully.',
    //   severity: 'success',
    // });
  };
  const handleConfirmDelete = () => {
    setDeleteOpen(false);
    setSnackbarState({
      open: true,
      message: 'Connected SMTP deleted successfully.',
      severity: 'success',
    });
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };
  const handleTestSmtpClose = () => {
    setTestSmtpOpen(false);
  };
  const handleTestSnack = () => {
    setTestSmtpOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };

  const handleOpenPopover = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [selectedData, setSelectedData] = useState(null);

  // Handle edit click from popover
  const handleEditClick = (rowData) => {
    setSelectedData(rowData);
    setDialogMode('edit');
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedData(null);
  };

  // Handle successful submission
  const handleSubmitSuccess = (message) => {
    // Handle success (e.g., show notification, refresh data)
    console.log(message);
    handleCloseDialog();
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
              title="List of connected SMTP servers for sending email notifications, with options to add, update, delete, enable, or disable them."
            >
              <Typography variant="h6">SMTPs</Typography>
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
          boxShadow: () =>
            `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
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
      <SmtpTableToolbar
        filters={filters}
        onResetPage={table.onResetPage}
        numSelected={table.selected.length} // Add this line
        handleOpenDialog={handleOpenDialog}
      />

      {canReset && (
        <SmtpTableFiltersResult
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
              showCheckbox
              // showCheckbox={false}
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
                  <SmtpTableRow
                    key={index}
                    row={row}
                    onOpenPopover={(event) => handleOpenPopover(event, row)}
                    selected={table.selected.includes(row.id)}
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
          <Tooltip title="Update the SMTP details." arrow placement="left">
            <MenuItem
              onClick={() => {
                handleClosePopover();
                handleEditClick(selectedRow);
              }}
            >
              <Iconify icon="fluent:edit-48-filled" />
              Update
            </MenuItem>
          </Tooltip>

          <Tooltip title="Test SMTP" arrow placement="left">
            <MenuItem
              onClick={() => {
                handleClosePopover();
                // handleTestSmtpClose(selectedRow);
                handleTestSnack();
              }}
            >
              <Iconify icon="material-symbols:network-check" />
              Test SMTP
            </MenuItem>
          </Tooltip>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Tooltip title="Delete SMTP" arrow placement="left">
            <MenuItem
              key="delete"
              sx={{ color: 'error.main' }}
              onClick={() => {
                handleClosePopover();
                handleDelete();
              }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          </Tooltip>
        </MenuList>
      </CustomPopover>

      <AddSmtpDialog
        open={openDialog}
        onClose={handleCloseDialog}
        mode={dialogMode}
        initialData={selectedData}
        onSubmitSuccess={handleSubmitSuccess}
      />

      <TablePaginationCustom
        page={table.page}
        count={dataFiltered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
      <DeleteDialog
        title=" Do you really want to delete the connected SMTP?"
        content="Note that when an  connected SMTP is deleted, it is permanently removed."
        open={deleteOpen}
        onClose={handleDeleteClose}
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        }
      />
      <TestSmtpDialog
        title=" Do you really want to delete the connected SMTP?"
        content="Note that when an  connected SMTP is deleted, it is permanently removed."
        open={testSmtpOpen}
        onClose={() => setTestSmtpOpen(false)}
        smtpData={selectedRow}
        // action={
        //   <Button variant="contained" color="error" onClick={handleConfirmDelete}>
        //     Delete
        //   </Button>
        // }
      />
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={snackbarState.autoHideDuration}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          boxShadow: '0px 8px 16px 0px rgba(145, 158, 171, 0.16)',
          mt: 8,
          zIndex: theme.zIndex.modal + 99999,
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarState.severity}
          sx={{
            width: '100%',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            '& .MuiAlert-icon': {
              color:
                snackbarState.severity === 'error'
                  ? theme.palette.error.main
                  : theme.palette.success.main,
            },
          }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}

function applyFilter({ inputData, filters, dateError }) {
  const { status, name, startDate, endDate } = filters;

  let filteredData = inputData;

  // Filter by message (name)
  if (name) {
    filteredData = filteredData.filter(
      (order) => order.name && order.name.toLowerCase().includes(name.toLowerCase())
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
