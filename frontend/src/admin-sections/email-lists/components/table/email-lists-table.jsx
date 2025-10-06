import { useTheme } from '@emotion/react';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import {
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

import { EMAIL_LISTS_STATUS_OPTIONS } from 'src/_mock/_table/_admintable/_emailLists';

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

import { EmailListTableRow } from './email-lists-table-row';
import UpdateCreditsDialog from '../dialog/credit-update-dialog';
import { CustomerDetailsDrawer } from '../drawers/customer-drawer';
import { EmailListTableToolbar } from './email-lists-table-toolbar';
import ViewProcessingDialog from '../dialog/view-processing-dialog';
import { EmailListTableFiltersResult } from './email-lists-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All', tooltip: 'View all email lists that have been uploaded.' },
  ...EMAIL_LISTS_STATUS_OPTIONS,
];
const TABLE_HEAD = [
  {
    id: 'status_date',
    label: 'Verification Status/Date',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'View email verification status and upload date.',
  },

  {
    id: 'emailListName/id',
    label: 'Email List Name/ID',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'Name and ID of email list uploaded by the Pabbly cutomer for verification.',
  },

  {
    id: 'accountEmailName',
    label: 'Customer Email',
    width: 'flex',
    whiteSpace: 'nowrap',

    tooltip: 'Email address of the Pabbly customer.',
  },
  {
    id: 'connectedIntegration',
    label: 'Connected Integration',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: `Name of the third-party email verification application whose API is used for verification of email list.`,
  },

  {
    id: 'result',
    label: 'Report',
    align: 'right',
    tooltip: 'Report of the email lists uploaded by the Pabbly cutomer for verification.',
    width: 'flex',
  },
  { id: '', width: 10 },
];

const dataOn = [
  {
    id: '5657951',
    emailListName: 'Test_List_Pabbly 1',
    accountEmail: 'gerry@briodigital.com',
    accountName: 'Bouncify 1',
    Date: 'Oct 23, 2024 17:45:32',
    status: 'verified',
    apiType: 'bouncify',
    ListResult: {
      total: 10,
      verified: 1,
      deliverable: 5,
      undeliverable: 5,
      accept_all: 0,
      unknown: 0,
    },
  },
  {
    id: '5657412',
    emailListName: 'Test_List_Pabbly 2',
    accountEmail: 'belinda@bellouco.com',
    accountName: 'Bouncify 2',
    Date: 'Oct 23, 2024 17:45:32',
    status: 'processing',
    apiType: 'my addr',
    ListResult: {
      total: 10,
      verified: 1,
      deliverable: 1,
      undeliverable: 5,
      accept_all: 0,
      unknown: 0,
    },
  },
  {
    id: '5657854',
    emailListName: 'Test_List_Pabbly 3',
    accountEmail: 'cpemberton@bigmarketsolutions.com',
    accountName: 'Bouncify 3',
    Date: 'Oct 23, 2024 17:45:32',
    status: 'unverified',
    apiType: 'bouncify',
    ListResult: {
      total: 10,
      verified: 1,
      deliverable: 1,
      undeliverable: 5,
      accept_all: 0,
      unknown: 0,
    },
  },
  // {
  //   id: '5657698',
  //   emailListName: 'Test_List_Pabbly 4',
  //   accountEmail: 'singhabhishek729826@gmail.com',
  //   accountName: 'Bouncify 4',
  //   Date: 'Oct 23, 2024 17:45:32',
  //   status: 'canceled',
  //   apiType: 'bouncify',
  //   ListResult: {
  //     total: 10,
  //     verified: 1,
  //     deliverable: 1,
  //     undeliverable: 5,
  //     accept_all: 0,
  //     unknown: 0,
  //   },
  // },
  // {
  //   id: '5657879',
  //   emailListName: 'Test_List_Pabbly 5',
  //   accountEmail: 'clark@conversionetics.com',
  //   accountName: 'Bouncify 5',
  //   Date: 'Oct 23, 2024 17:45:32',
  //   status: 'canceled from admin panel',
  //   apiType: 'bouncify',
  //   ListResult: {
  //     total: 10,
  //     verified: 1,
  //     deliverable: 1,
  //     undeliverable: 5,
  //     accept_all: 0,
  //     unknown: 0,
  //   },
  // },
];

// ----------------------------------------------------------------------

export function EmailListTable() {
  // const navigate = useNavigate();
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
  const [confirmDelete, setConfirmDelete] = useState(true);

  const handleOpenPopover = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  const handleDelete = () => {
    setDeleteOpen(true);
  };
  const handleConfirmDelete = () => {
    setDeleteOpen(false);
    setSnackbarState({
      open: true,
      message: 'Email list(s) deleted successfully.',
      severity: 'success',
    });
  };
  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };
  const handleViewCustomerClick = (row) => {
    setSelectedUserEmail(row.accountEmail);
    setSelectedUserName(row.accountName);
    setSelectedUserId(row.id);
    setDrawerOpen(true);
    handleClosePopover();
  };

  const handleLoginAs = () => {
    window.open('https://accounts.pabbly.com/login', '_blank', 'noopener,noreferrer');
    handleClosePopover();
  };

  const renderMenuItems = (status) => {
    const items = [];

    // Delete is shown for all statuses
    const deleteItem = (
      <>
        {/* <Tooltip title="View full details of Pabbly customer." arrow placement="left">
          <MenuItem onClick={() => handleViewCustomerClick(selectedRow)}>
            <Iconify icon="mdi:eye" />
            View Customer
          </MenuItem>
        </Tooltip>
        <Tooltip title="Login as Pabbly customer." arrow placement="left">
          <MenuItem onClick={handleLoginAs} target="_blank">
            <Iconify icon="majesticons:login" />
            Login As
          </MenuItem>
        </Tooltip> */}

        <Tooltip title="Update email credits of Pabbly customer." arrow placement="left">
          {/* <MenuItem onClick={() => handleCreditUpdateDialog(selectedRow)}> */}
          <MenuItem onClick={() => handleViewCustomerClick(selectedRow)}>
            <Iconify icon="tabler:credit-card-filled" />
            Update Credits
          </MenuItem>
        </Tooltip>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Tooltip
          title={
            status === 'processing' ? 'Cancel the email verification process.' : 'Delete email list'
          }
          arrow
          placement="left"
        >
          <MenuItem key="delete" sx={{ color: 'error.main' }} onClick={() => handleDelete()}>
            {/* <Iconify icon="solar:trash-bin-trash-bold" /> */}
            {status === 'processing' ? (
              <Iconify icon="material-symbols:cancel-rounded" />
            ) : (
              <Iconify icon="solar:trash-bin-trash-bold" />
            )}
            {status === 'processing' ? 'Cancel' : 'Delete'}
          </MenuItem>
        </Tooltip>
      </>
    );

    items.push(deleteItem);

    return items;
  };
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserStatus, setSelectedUserStatus] = useState('active');
  const handleUserEmailClick = (account) => {
    setSelectedUserEmail(account.accountEmail);
    setSelectedUserName(account.accountName);
    setSelectedUserId(account.id);
    setDrawerOpen(true);
  };
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedDownloadRow, setSelectedDownloadRow] = useState(null);
  const [updateCreditsDialogOpen, setUpdateCreditsDialogOpen] = useState(false);
  const [selectedCreditRow, setSelectedCreditRow] = useState(null);

  const handleUpdateCreditsClick = (row) => {
    setSelectedCreditRow(row);
    setUpdateCreditsDialogOpen(true);
  };

  const handleCreditUpdateDialog = (row) => {
    setSelectedDownloadRow(row);
    setDownloadDialogOpen(true);
  };
  const [viewProcessingDialogOpen, setViewProcessingDialogOpen] = useState(false);
  const [selectedProcessingRow, setSelectedProcessingRow] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleViewProcessingClick = (row) => {
    setSelectedProcessingRow(row);
    setViewProcessingDialogOpen(true);
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" justifyContent="space-between" flexDirection={{xs:'column',md:'row'}} alignItems={{xs:'flex-end',md:'center'}}>
            <Box display="inline-block" mb={{xs:2,md:0}}>
              <Typography variant="h6">
                <Tooltip
                  arrow
                  placement="top"
                  disableInteractive
                  title="View all email lists uploaded by Pabbly customers for email verification."
                >
                  <span>Email Lists</span>
                </Tooltip>
              </Typography>
              <Typography sx={{ mt: '4px' }} variant="body2" color="grey.600">
              Access and manage all the email lists uploaded by Pabbly customers. You can add or remove email credits from the customers Pabbly Email Verification accounts.
              </Typography>
            </Box>
            <Box display="inline-block">
            <EmailListTableToolbar
        filters={filters}
        onResetPage={table.onResetPage}
        numSelected={table.selected.length} // Add this line
      /> 
             
            </Box>
          </Box>
        }
        sx={{ pb: 3 }}
      />
      {/* <Divider /> */}
      {/* <Tabs
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
                  (tab.value === 'verified' && 'success') ||
                  (tab.value === 'unverified' && 'error') ||
                  (tab.value === 'processing' && 'info') ||
                  (tab.value === 'canceled' && 'error') ||
                  (tab.value === 'canceled from admin panel' && 'error') ||
                  'default'
                }
              >
                {[
                  'verified',
                  'unverified',
                  'processing',
                  'canceled',
                  'canceled from admin panel',
                ].includes(tab.value)
                  ? tableData.filter((user) => user.status === tab.value).length
                  : tableData.length}
              </Label>
            }
          />
        ))}
      </Tabs> */}
      {/* <EmailListTableToolbar
        filters={filters}
        onResetPage={table.onResetPage}
        numSelected={table.selected.length} // Add this line
      /> */}

      {canReset && (
        <EmailListTableFiltersResult
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
                  <EmailListTableRow
                    key={index}
                    row={row}
                    onOpenPopover={(event) => handleOpenPopover(event, row)}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => {
                      table.onSelectRow(row.id);
                    }}
                    onEmailClick={handleUserEmailClick}
                    onDownloadClick={() => handleCreditUpdateDialog(row)}
                    onViewProcessingClick={() => handleViewProcessingClick(row)} // Add this prop
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
        <MenuList>{selectedRow && renderMenuItems(selectedRow.status)}</MenuList>
      </CustomPopover>
      <ViewProcessingDialog
        open={viewProcessingDialogOpen}
        onClose={() => {
          setViewProcessingDialogOpen(false);
          setSelectedProcessingRow(null);
        }}
        rowData={selectedDownloadRow}
      />
      <UpdateCreditsDialog
        open={downloadDialogOpen}
        onClose={() => setDownloadDialogOpen(false)}
        rowData={selectedDownloadRow} // Add this prop
      />
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
      <DeleteDialog
        title="Do you really want to delete the email list(s)?"
        content="Note that when an email list is deleted, it is permanently removed."
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

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate, apiType } = filters;

  let filteredData = inputData;

  // Filter by message (name)
  if (name) {
    filteredData = filteredData.filter(
      (order) =>
        (order.emailListName && order.emailListName.toLowerCase().includes(name.toLowerCase())) ||
        (order.accountEmail && order.accountEmail.toLowerCase().includes(name.toLowerCase()))
    );
  }

  // Filter by status
  if (status !== 'all') {
    filteredData = filteredData.filter((order) => order.status === status);
  }

  // Filter by API type
  if (apiType) {
    filteredData = filteredData.filter(
      (order) => order.apiType.toLowerCase() === apiType.toLowerCase()
    );
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
