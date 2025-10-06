import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import {
  Alert,
  Divider,
  Tooltip,
  MenuList,
  MenuItem,
  Snackbar,
  CardHeader,
  Typography,
} from '@mui/material';

import { useSetState } from 'src/hooks/use-set-state';

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

import { PlansTableRow } from './plans-table-row';
import { PlansTableToolbar } from './plans-table-toolbar';
import DownloadReportDialog from '../dialogs/plan-dialog';
import { PlansTableFiltersResult } from './plans-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // {
  //   id: 'id',
  //   label: 'ID',
  //   width: 'flex',
  //   whiteSpace: 'nowrap',
  //   tooltip: 'Id of the plan.',
  // },

  {
    id: 'name',
    label: 'Plan Name',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'Name of the Pabbly Email Verification plan.',
  },

  {
    id: 'credits',
    label: 'Credits',
    width: 'flex',
    whiteSpace: 'nowrap',

    tooltip: 'Number of credits alotted to the plan.',
  },
  {
    id: 'amount',
    label: 'Price ($)',
    width: 'flex',
    whiteSpace: 'nowrap',

    tooltip: 'Price at which the plan is available.',
  },
  // {
  //   id: 'pabbly_plan_id',
  //   label: 'Pabbly Plan ID',
  //   width: 'flex',
  //   whiteSpace: 'nowrap',

  //   tooltip: 'Pabbly plan id recieved from Pabbly checkout page.',
  // },

  // {
  //   id: 'plan_code',
  //   label: 'Plan Code',
  //   width: 'flex',
  //   whiteSpace: 'nowrap',
  //   align: 'right',
  //   tooltip: 'Unique code for this plan.',
  // },
  { id: '', width: 10 },
];

const dataOn = [
  {
    // id: '3',
    name: '10M Emails',
    credits: '10000000',
    amount: '2999.00',
    pabbly_plan_id: '5c271aac1ba44845cf0e6bd1',
    plan_code: '10m-emails',
  },
  {
    // id: '4',
    name: '5M Emails',
    credits: '5000000',
    amount: '1799.00',
    pabbly_plan_id: '5c271aac1ba44gsdjf0e6bd1',
    plan_code: '5m-emails',
  },
  {
    // id: '5',
    name: '2.5M Emails',
    credits: '2500000',
    amount: '1199.00',
    pabbly_plan_id: '5c2asahfkjh44845cf0e6bd1',
    plan_code: '2.5m-emails',
  },
  {
    // id: '6',
    name: '1M Emails',
    credits: '1000000',
    amount: '599.00',
    pabbly_plan_id: '5c271aac1ba44845cf0e6bd1',
    plan_code: '1-m-emails',
  },
  {
    // id: '7',
    name: '500K Emails',
    credits: '500000',
    amount: '479.00',
    pabbly_plan_id: '5c271aac1ba44845cf0e6bd1',
    plan_code: '500k-emails',
  },
];

// ----------------------------------------------------------------------

export function PlansListTable({ onEditPlan }) {
  const table = useTable({
    defaultOrderBy: 'orderNumber',
    defaultSelected: [],
  });

  const [tableData, setTableData] = useState(dataOn);

  const filters = useSetState({
    name: '',
    status: 'all',
    apiType: '',
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
  const handleEdit = () => {
    if (selectedRow && onEditPlan) {
      onEditPlan(selectedRow);
      handleClosePopover();
    }
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Add handlers for dialog
  const handleOpenDialog = (mode = 'add', plan = null) => {
    setDialogMode(mode);
    setSelectedPlan(plan || selectedRow); // Use selectedRow if no plan is provided
    setOpenDialog(true);
    handleClosePopover(); // Close the popover when opening dialog
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPlan(null);
  };

  // Modify handleEdit to use dialog

  // Add snackbar handler
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
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
              title="View and manage the Pabbly Email Verification plans."
            >
              <Typography variant="h6">Plans List</Typography>
            </Tooltip>
          </Box>
        }
        sx={{ pb: 3 }}
      />
      <Divider />

      <PlansTableToolbar
        filters={filters}
        onResetPage={table.onResetPage}
        numSelected={table.selected.length} // Add this line
      />

      {canReset && (
        <PlansTableFiltersResult
          filters={filters}
          totalResults={dataFiltered.length}
          onResetPage={table.onResetPage}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <Box sx={{ position: 'relative' }}>
        <Scrollbar>
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
                  <PlansTableRow
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
          <Tooltip title="Edit plan" arrow placement="left">
            <MenuItem onClick={() => handleOpenDialog('edit')}>
              <Iconify icon="fluent:edit-48-filled" />
              Edit
            </MenuItem>
          </Tooltip>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Tooltip title="Delete plan" arrow placement="left">
            <MenuItem key="delete" sx={{ color: 'error.main' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          </Tooltip>
        </MenuList>
      </CustomPopover>
      <DownloadReportDialog
        open={openDialog}
        onClose={handleCloseDialog}
        mode={dialogMode}
        planData={selectedPlan}
        onSubmitSuccess={(message) => {
          setSnackbar({
            open: true,
            message,
            severity: 'success',
          });
          handleCloseDialog();
        }}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Fixed
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
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
  const { name } = filters;

  let filteredData = inputData;

  // Filter by message (name)
  if (name) {
    filteredData = filteredData.filter(
      (order) => order.name && order.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  return filteredData;
}
