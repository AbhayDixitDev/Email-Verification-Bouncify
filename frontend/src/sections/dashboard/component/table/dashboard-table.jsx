import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@emotion/react';

import { fDateTimeInTimezone } from 'src/utils/format-time';

import {
  Tab,
  Box,
  Tabs,
  Card,
  Table,
  Button,
  Dialog,
  Divider,
  Tooltip,
  MenuList,
  MenuItem,
  TableBody,
  CardHeader,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { TablePagination } from '@mui/material';

import { varAlpha } from 'src/theme/styles';
import { DASHBOARD_STATUS_OPTIONS } from 'src/_mock/_table/_apptable/_dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomPopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/confirm-dialog';
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

import { MoveToFolderPopover } from 'src/sections/dialog-boxes/move-to-folder-dailog';
import { fetchLists, deleteList } from 'src/redux/slice/listSlice';

import { DashboardTableRow } from './dashboard-table-row';
import { DashboardTableToolbar } from './dashboard-table-toolbar';
import { DashboardTableFiltersResult } from './dashboard-table-filters-result';

// constants/table.js
const STATUS_OPTIONS = [
  { value: 'all', label: 'All', tooltip: 'View all email lists that have been uploaded.' },
  ...DASHBOARD_STATUS_OPTIONS,
];

const TABLE_HEAD = [
  {
    id: 'filename',
    label: 'Status/Name/Date',
    width: 400,
    whiteSpace: 'nowrap',
    tooltip: 'View email verification status, email list name and upload date.',
  },
  {
    id: 'consumed',
    label: 'Number of Emails/Credits Consumed',
    width: 400,
    whiteSpace: 'nowrap',
    tooltip:
      'View the number of email addresses in the uploaded email list and the verification credits used.',
  },
  {
    id: 'action',
    label: 'Action',
    width: 300,
    whiteSpace: 'nowrap',
    align: 'right',
    tooltip: 'View option to start email verification and download the verification report.',
  },
  { id: '', width: 10 },
];

// data/mockData.js
const dataOn = [
  {
    status: 'uploading',
    name: 'List 1',
    numberOfEmails: 128,
    creditconsumed: '0 Credit Consumed',
    date: 'Oct 23, 2024 17:45:32',
  },
  {
    status: 'Unverified',
    name: 'List 2',
    numberOfEmails: 65,
    creditconsumed: '65 Credit Consumed',
    date: 'Oct 23, 2024 17:45:32',
  },
  {
    status: 'Unverified',
    name: 'List 3',
    numberOfEmails: 250,
    creditconsumed: '0 Credit Consumed',
    date: 'Oct 23, 2024 17:45:32',
    requiresCredits: true, // Add this flag for the new row
  },
  {
    status: 'processing',
    name: 'List 4',
    numberOfEmails: 65,
    creditconsumed: '65 Credit Consumed',
    date: 'Oct 23, 2024 17:45:32',
  },
  {
    status: 'Verified',
    name: 'List 5',
    numberOfEmails: 653343,
    creditconsumed: '653343 Credit Consumed',
    date: 'Oct 23, 2024 17:45:32',
  },
];
// utils/filterUtils.js
function applyFilter({ inputData, comparator, filters }) {
  const { status, name } = filters;

  let filteredData = [...inputData];

  if (name) {
    filteredData = filteredData.filter((item) =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    filteredData = filteredData.filter((item) => item.status === status);
  }

  const stabilizedThis = filteredData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

export function DashboardTable() {
  const theme = useTheme();
  const table = useTable({ defaultOrderBy: 'orderNumber' });
  const dispatch = useDispatch();
  const listState = useSelector((state) => state.list);
  const { selectedTimeZone } = useSelector((state) => state.timeZone);

  const backendToUiStatus = (status) => {
    if (status === 'COMPLETED') return 'Verified';
    if (status === 'PROCESSING') return 'processing';
    if (status === 'UNPROCESSED') return 'Unverified';
    if (status === 'FAILED') return 'Failed';
  };

  const uiToBackendStatus = (ui) => {
    if (ui === 'Verified') return 'COMPLETED';
    if (ui === 'processing') return 'PROCESSING';
    if (ui === 'Unverified') return 'UNPROCESSED';
    if (ui === 'Failed') return 'FAILED';
    return '';
  };

  // Helper function to format date with timezone
  const formatDateWithTimezone = (date) => {
    if (!date) return '';
    const timezone = selectedTimeZone?.key || 'UTC';
    return fDateTimeInTimezone(date, timezone, 'MMM DD, YYYY HH:mm:ss');
  };

  const [tableData, setTableData] = useState(() => (listState?.data?.listData || []).map((item, index) => ({
    id: item._id || index,
    status: backendToUiStatus(item.status),
    name: item.listName || item.filename || 'Untitled List',
    numberOfEmails: item.totalEmails || 0,
    creditconsumed:
        item.status === 'COMPLETED'
          ? `${item?.report?.verified || item.totalEmails || 0} Credit Consumed`
          : '0 Credit Consumed',
      date: formatDateWithTimezone(item.createdAt || item.uploadedAt),
    jobId: item.jobId,
    report: {
      deliverable: item?.report?.results?.deliverable || 0,
      undeliverable: item?.report?.results?.undeliverable || 0,
      acceptAll: item?.report?.results?.accept_all || 0, 
      unknown: item?.report?.results?.unknown || 0,
      verified: item?.report?.verified || 0,
    }    
  })));

  const filters = useSetState({
    name: '',
    status: 'all',
  });

  useEffect(() => {
    console.log(tableData);
  },[tableData])

  const [processingRowId, setProcessingRowId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const confirmDelete = useBoolean();
  const isStartVerification = useSelector((state) => state.fileUpload.isStartVerification);
  const isVerificationCompleted = useSelector((state) => state.fileUpload.isVerificationCompleted);

  // Update tableData when listState changes
  useEffect(() => {
    setTableData((listState?.data?.listData || []).map((item, index) => ({
      id: item._id || index,
      status: backendToUiStatus(item.status),
      name: item.listName || item.filename || 'Untitled List',
      numberOfEmails: item.totalEmails || 0,
      creditconsumed:
        item.status === 'COMPLETED'
          ? `${item?.report?.verified || item.totalEmails || 0} Credit Consumed`
          : '0 Credit Consumed',
      date: formatDateWithTimezone(item.createdAt || item.uploadedAt),
      jobId: item.jobId,
      report: {
        deliverable: item?.report?.results?.deliverable || 0,
        undeliverable: item?.report?.results?.undeliverable || 0,
        acceptAll: item?.report?.results?.accept_all || 0,
        unknown: item?.report?.results?.unknown || 0,
        verified: item?.report?.verified || 0,
      },
    })));
    
  }, [listState?.data?.listData]);

  // Fetch lists from backend when filters or pagination change
  useEffect(() => {
    console.log('Fetching lists with params:', {
      page: table.page + 1,
      limit: table.rowsPerPage,
      search: filters.state.name,
      status: filters.state.status === 'all' ? '' : filters.state.status
    });
    const params = {
      page: table.page + 1,  // MUI Table is 0-indexed, API is 1-indexed
      limit: table.rowsPerPage,
      search: filters.state.name,
      status: filters.state.status === 'all' ? '' : filters.state.status
    };
    dispatch(fetchLists(params));
  }, [dispatch, table.page, table.rowsPerPage, filters.state.name, filters.state.status]);


  const [creditDialogOpen, setCreditDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setCreditDialogOpen(false);
  };

  const handleBuyCredits = () => {
    // Handle buy credits action
    setCreditDialogOpen(false);
    // Optionally navigate to credits purchase page
    // navigate('/credits/purchase');
  };

  const handleStartVerification = (rowId) => {
    const targetRow = tableData.find((item) => item.id === rowId);

    if (targetRow.requiresCredits) {
      setCreditDialogOpen(true);
      return;
    }

      

    setProcessingRowId(rowId);
    setTableData((prevData) =>
      prevData.map((item) => {
        if (item.id === rowId) {
          return {
            ...item,
            status: 'processing',
            creditconsumed: `${item.numberOfEmails} Credit Consumed`,
          };
        }
        return item;
      })
    );
  };

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const handleOpenPopover = (event, row) => {
    if (row.status !== 'processing') {
      setAnchorEl(event.currentTarget);
      setSelectedRow(row);
    }
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleConfirmDelete = (jobId) => {
    confirmDelete.onTrue(
      dispatch(deleteList({ jobId: jobId })).unwrap()
    );
    
    handleClosePopover();
  };

  const handleDelete = async () => {
    confirmDelete.onFalse();
    try {
      if (selectedRow?.jobId) {
        await dispatch(deleteList({ jobId: selectedRow.jobId })).unwrap();
        toast.success(`Email list deleted successfully.`, {
          style: { marginTop: '15px' },
        });
        // Refresh current page with current filters
        const params = {
          page: table.page + 1,
          limit: table.rowsPerPage,
          search: filters.state.name,
          status: filters.state.status === 'all' ? '' : filters.state.status
        };
        dispatch(fetchLists(params));
      }
    } catch (err) {
      toast.error(`Failed to delete list: ${err?.message || 'Unknown error'}`);
    }
  };

  // Computed values - use backend data directly since pagination is handled server-side
  const dataFiltered = tableData; // Backend already filters and paginates

  useEffect(() => {
    console.log('Table state:', {
      page: table.page,
      rowsPerPage: table.rowsPerPage,
      total: listState.data.pagination.total,
      paginationData: listState.data.pagination,
      listState: listState
    });
  }, [table, listState]);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
  const [openMoveFolder, setOpenMoveFolder] = useState(false);

  // Add this handler in DashboardTrashTable component
  const handleMoveToFolder = () => {
    setOpenMoveFolder(true);
    handleClosePopover();
  };

  return (
    <Card>
      <CardHeader
        title={
          <Box display="inline-block">
            <Tooltip title="Folder Name: Home" arrow placement="top">
              <Typography variant="h6" sx={{overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: {xs:"200px", md:"500px"},}}>Home</Typography>
            </Tooltip>
          </Box>
        }
        subheader="Verify and manage all your uploaded email lists here."
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
                  (tab.value === 'Verified' && 'success') ||
                  (tab.value === 'processing' && 'info') ||
                  (tab.value === 'uploading' && 'warning') ||
                  (tab.value === 'Unverified' && 'error') ||
                  'default'
                }
              >
                {['Verified', 'processing', 'uploading', 'Unverified'].includes(tab.value)
                  ? tableData.filter((user) => user.status === tab.value).length
                  : tableData.length}
              </Label>
            }
          />
        ))}
      </Tabs>

      <DashboardTableToolbar
        filters={filters}
        onResetPage={table.onResetPage}
        numSelected={table.selected.length}
      />

      {canReset && (
        <DashboardTableFiltersResult
          filters={filters}
          totalResults={dataFiltered.length}
          onResetPage={table.onResetPage}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <Box sx={{ position: 'relative' }}>
        {/* <DashboardTableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={dataFiltered.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              dataFiltered.map((row) => row.id)
            )
          }
        /> */}
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'}>
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
              {dataFiltered.map((row, index) => (
                <DashboardTableRow
                  key={row.id}
                  row={row}
                  selected={table.selected.includes(row.id)}
                  onSelectRow={() => table.onSelectRow(row.id)}
                  onOpenPopover={(event) => handleOpenPopover(event, row)}
                  dashboardTableIndex={index}
                  onStartVerification={() => handleStartVerification(row.id)}
                  isProcessing={processingRowId === row.id && isStartVerification}
                  isCompleted={processingRowId === row.id && isVerificationCompleted}
                />
              ))}

              {dataFiltered.length === 0 && (
                <TableNoData
                  title="No Data Found"
                  description="No data found in the table"
                  notFound={true}
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
          {selectedRow && selectedRow.status !== 'processing' && (
            <>
              <Tooltip title="Move to folder" arrow placement="left">
                <MenuItem onClick={handleMoveToFolder}>
                  <Iconify icon="fluent:folder-move-16-filled" />
                  Move to folder
                </MenuItem>
              </Tooltip>
              <Divider style={{ borderStyle: 'dashed' }} />
              <Tooltip title="Delete email list." arrow placement="left">
                <MenuItem onClick={() => handleConfirmDelete(selectedRow.jobId)} sx={{ color: 'error.main' }}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                  Delete
                </MenuItem>
              </Tooltip>
            </>
          )}
        </MenuList>
      </CustomPopover>
      <MoveToFolderPopover
        open={openMoveFolder}
        jobId={selectedRow?.jobId}
        onClose={() => {
          setOpenMoveFolder(false);
          setSelectedRow(null);
          // Refresh current page with current filters
          const params = {
            page: table.page + 1,
            limit: table.rowsPerPage,
            search: filters.state.name,
            status: filters.state.status === 'all' ? '' : filters.state.status
          };
          dispatch(fetchLists(params));
        }}
      />
      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Do you really want to delete the email list?"
        content="Note that when an email list is deleted it is moved to the trash folder."
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />

      <Dialog open={creditDialogOpen} onClose={handleDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: 'bold',
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {/* <Iconify icon="mdi:credit-card-outline" /> */}
          Upgrade
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2">
            You don&apos;t have enough credits to verify the email list. Please purchase more
            credits to start email verification.
          </Typography>

          {/* <Box sx={{ bgcolor: 'background.neutral', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              • Credits required: 250
              <br />• Available credits: 0
            </Typography>
          </Box> */}
        </DialogContent>

        <DialogActions sx={{ pb: 3, gap: 1 }}>
          <Button
            target="blank"
            href="https://www.pabbly.com/email-list-cleaning/#pricing"
            color="primary"
            variant="contained"
            // startIcon={<Iconify icon="mdi:cart-outline" />}
          >
            Upgrade Now
          </Button>
          <Button onClick={handleDialogClose} color="inherit" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <TablePaginationCustom
        page={table.page}
        count={listState.data?.pagination?.total || 0}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
      />
    </Card>
  );
}
