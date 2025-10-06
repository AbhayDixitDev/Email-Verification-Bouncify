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
import { API_STATUS_OPTIONS } from 'src/_mock/_table/_admintable/_users';

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

import { ApiTableRow } from './api-table-row';
import AddApiDialog from '../dialog/api-dialog';
import { ApiTableToolbar } from './api-table-toolbar';
import { ApiTableFiltersResult } from './api-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  {
    value: 'all',
    label: 'All',
    tooltip: 'View all the third party integrated application for email verification.',
  },
  ...API_STATUS_OPTIONS,
];
const TABLE_HEAD = [
  {
    id: 'status',
    label: 'Status/Name/Last Used',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'Status of the third party integrated application and last usage date and time.',
    align: 'left',
  },
  
  {
    id: 'balance',
    label: 'Balance',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'Remaining balance of the third party integrated application.',
    align: 'right',
  },
 

  { id: '', width: 10 },
];

const dataOn = [
  {
    id: '54985640',
    name: 'Bouncify 1',
    secret_key: '9E45565656C4772DB6DC08CB36FDCEC25A',

    balance: '2398436.00',
    used_count: '0',
    last_used: 'Dec 18, 2024 5:43:20',
    status: 'active',
  },
  {
    id: '54985641',

    name: 'Bouncify 2',
    secret_key: '52DB6DC08CB36FDCEC25A66766',

    balance: '146.00',
    used_count: '2',
    last_used: 'Dec 18, 2024 5:43:20',
    status: 'inactive',
  },
  {
    id: '54985642',

    name: 'Bouncify 3',
    secret_key: '52DB6DC08CB36FDCEC25A66766',

    balance: '146.00',
    used_count: '2',
    last_used: 'Dec 18, 2024 5:43:20',
    status: 'active',
  },
  {
    id: '54985643',

    name: 'Bouncify My addr',
    secret_key: '52DB6DC08CB36FDCEC25A66766',

    balance: '146.00',
    used_count: '2',
    last_used: 'Dec 18, 2024 5:43:20',
    status: 'inactive',
  },
];

// ----------------------------------------------------------------------

export function ApiTable({ onEditClick, handleOpenDialog }) {
  const table = useTable({
    defaultOrderBy: 'orderNumber',
    defaultSelected: [], // Add this to initialize selected state
  });
  const theme = useTheme();
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
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleDelete = () => {
    setDeleteOpen(true);
   
  };
  const handleConfirmDelete = () => {
    setDeleteOpen(false);
    setSnackbarState({
      open: true,
      message: 'Connected Integrations deleted successfully.',
      severity: 'success',
    });
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
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
              title="View and manage all the integrated application for email verification."
            >
              <Typography variant="h6">Connected Integrations</Typography>
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
      <ApiTableToolbar
        filters={filters}
        onResetPage={table.onResetPage}
        numSelected={table.selected.length} // Add this line
        handleOpenDialog={handleOpenDialog}
      />

      {canReset && (
        <ApiTableFiltersResult
          filters={filters}
          totalResults={dataFiltered.length}
          onResetPage={table.onResetPage}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <Box sx={{ position: 'relative' }}>
        <Scrollbar
        //  sx={{ minHeight: 4444 }}
        >
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              showCheckbox
         
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
                  <ApiTableRow
                    key={index}
                    row={row}
                    selected={table.selected.includes(row.id)}
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
          <Tooltip title="Update Integrated Application" arrow placement="left">
            <MenuItem
              onClick={() => {
                handleEditClick(selectedRow);
                handleClosePopover();
              }}
            >
              <Iconify icon="fluent:edit-48-filled" />
              Update
            </MenuItem>
          </Tooltip>
          <Divider sx={{ borderStyle: 'dashed' }} />  
          <Tooltip title="Delete Integrated Application" arrow placement="left">
            <MenuItem key="delete" sx={{ color: 'error.main' }} onClick={handleDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          </Tooltip>
        </MenuList>
      </CustomPopover>

      <AddApiDialog
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
        title="Do you really want to delete the Integrated Application?"
        content="Note that when an email verification integrated Application is deleted, it is permanently removed."
        open={deleteOpen}
        onClose={handleDeleteClose}
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        }
      />
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={3500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          boxShadow: '0px 8px 16px 0px rgba(145, 158, 171, 0.16)',
          mt: 8,
          zIndex: theme.zIndex.modal + 9999,
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
