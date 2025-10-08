import { useState, useEffect, useCallback } from 'react';

// Material UI components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// Custom hooks
import { useSetState } from 'src/hooks/use-set-state';

// Utils
import axios, { endpoints } from 'src/utils/axios';

// Components
import { Scrollbar } from 'src/components/scrollbar';

// Mock data
import { ACTIVITY_LOG_STATUS_OPTIONS } from 'src/_mock/_table/_apptable/_activity_log';
import {
  useTable,
  rowInPage,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { ActivityLogTableRow } from './activity-log-table-row';
import { ActivityLogDrawer } from '../drawer/activity-log-drawer';
import { ActivityLogTableToolbar } from './activity-log-table-toolbar';
import { ActivityLogTableFiltersResult } from './activity-log-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  {
    value: 'all',
    label: 'All',
    tooltip: 'Displays a combined view of actions across Created, Updated, and Deleted events.',
  },
  ...ACTIVITY_LOG_STATUS_OPTIONS,
];
const TABLE_HEAD = [
  {
    id: 'action_date',
    label: 'Action/Date',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip:
      'Date on which the activity was recorded and action event which informs about the specific event that has been performed.',
  },

  {
    id: 'actor',
    label: 'Actor',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'Name and email address of the user who performed the action.',
  },

  {
    id: 'section_source',
    label: 'Section/Source',
    width: 'flex',
    whiteSpace: 'nowrap',

    tooltip:
      ' View the section where the action occurred and whether it was done by a user or an API.',
  },

  {
    id: 'activity_data',
    label: 'Activity Data',
    width: 'flex',
    whiteSpace: 'nowrap',
    align: 'right',
    tooltip: 'View the activity data recorded during the action performed.',
  },
];

// Initial empty data, will be replaced by backend data
const dataOn = [];

// ----------------------------------------------------------------------

export function ActivityLogTable() {
  const table = useTable({
    defaultOrderBy: 'orderNumber',
    defaultSelected: [],
  });

  const [tableData, setTableData] = useState(dataOn);
  const [loading, setLoading] = useState(true);

  const filters = useSetState({
    name: '',
    status: 'all',
  });

  useEffect(() => {
    async function fetchActivityLogs() {
      setLoading(true);
      try {
        const res = await axios.get(endpoints.activityLog.list);
        // Adjust mapping if backend response differs
        setTableData(res.data.data || []);
      } catch (err) {
        // Optionally handle error
        setTableData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchActivityLogs();
  }, []);

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

  const [selectedRowData, setSelectedRowData] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleOpenDrawer = (rowData) => {
    setSelectedRowData(rowData);
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedRowData(null);
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
                  title="View all the activity logs here."
                >
                  <span>Activity Log</span>
                </Tooltip>
              </Typography>
              <Typography sx={{ mt: '4px' }} variant="body2" color="grey.600">
                Track all activities in your Pabbly Email Verification account, including user actions and API
                requests. Monitor created, updated, and deleted actions to ensure transparency and
                security.
              </Typography>
            </Box>
            <Box display="inline-block">
              <ActivityLogTableToolbar
                filters={filters}
                onResetPage={table.onResetPage}
                numSelected={table.selected.length}
                // Updated to use handlePopoverOpen
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
          boxShadow: (theme) =>
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
                  (tab.value === 'created' && 'success') ||
                  (tab.value === 'updated' && 'warning') ||
                  (tab.value === 'deleted' && 'error') ||
                  'default'
                }
              >
                {['created', 'updated', 'deleted'].includes(tab.value)
                  ? tableData.filter((user) => user.status === tab.value).length
                  : tableData.length}
              </Label>
            }
          />
        ))}
      </Tabs> */}
      {/* <ActivityLogTableToolbar
        filters={filters}
        onResetPage={table.onResetPage}
        numSelected={table.selected.length}
        // Updated to use handlePopoverOpen
      /> */}

      {canReset && (
        <ActivityLogTableFiltersResult
          filters={filters}
          totalResults={dataFiltered.length}
          onResetPage={table.onResetPage}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <Box sx={{ position: 'relative' }}>
        <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={dataFiltered.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              dataFiltered.map((row) => row.id)
            )
          }
        />
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 10 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {dataInPage
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => (
                      <ActivityLogTableRow
                        key={index}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onOpenDrawer={() => handleOpenDrawer(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataOn.length)}
                  />
                  {tableData.length === 0 ? (
                    <TableNoData
                      title="No Data Found"
                      description="No data found in the table"
                      notFound={notFound}
                    />
                  ) : (
                    <TableNoData
                      title="No Search Found"
                      description={`No search found with keyword "${filters.state.name}"`}
                      notFound={notFound}
                    />
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </Box>

      <TablePaginationCustom
        page={table.page}
        count={dataFiltered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
      <ActivityLogDrawer open={openDrawer} onClose={handleCloseDrawer} rowData={selectedRowData} />
    </Card>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name } = filters;

  let filteredData = inputData;

  // Filter by message (name)
  if (name) {
    filteredData = filteredData.filter(
      (order) =>
        (order.actor_name && order.actor_name.toLowerCase().includes(name.toLowerCase())) ||
        (order.actor_email && order.actor_email.toLowerCase().includes(name.toLowerCase())) ||
        (order.event && order.event.toLowerCase().includes(name.toLowerCase()))
      // (order.event_data && order.event_data.toLowerCase().includes(name.toLowerCase()))
    );
  }

  // Filter by status
  if (status !== 'all') {
    filteredData = filteredData.filter((order) => order.status === status);
  }

  // Filter by date range

  return filteredData;
}
