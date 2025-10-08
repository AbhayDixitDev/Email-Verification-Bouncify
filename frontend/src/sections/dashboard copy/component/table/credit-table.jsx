import { useTheme } from '@emotion/react';
import React,{ useEffect, useCallback  } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Divider, CircularProgress } from '@mui/material';

// eslint-disable-next-line import/no-unresolved
import { useSetState } from 'src/hooks/use-set-state';

// eslint-disable-next-line import/no-unresolved
import { fIsBetween } from 'src/utils/format-time';

// eslint-disable-next-line import/no-unresolved
import { fetchCreditsHistory } from 'src/redux/slice/creditSlice';

// eslint-disable-next-line import/no-unresolved
import { Scrollbar } from 'src/components/scrollbar';

// eslint-disable-next-line import/no-unresolved

import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
// eslint-disable-next-line import/no-unresolved
} from 'src/components/table';

import { CreditTableRow } from './credit-table-row';
import { CreditTableToolbar } from './credit-table-toolbar';
import { CreditTableFiltersResult } from './credit-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  {
    id: 'type',
    label: 'Type',
    width: '120px',
    whiteSpace: 'nowrap',
    tooltip: 'Type of verification',
  },
  {
    id: 'status',
    label: 'Status',
    width: '120px',
    whiteSpace: 'nowrap',
    tooltip: 'Verification status',
  },
  {
    id: 'date',
    label: 'Date',
    width: '180px',
    whiteSpace: 'nowrap',
    tooltip: 'Date and time of verification',
  },
  {
    id: 'summary',
    label: 'Summary',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'Verification summary',
  },
  {
    id: 'folder',
    label: 'Folder',
    width: '150px',
    whiteSpace: 'nowrap',
    tooltip: 'Folder containing the verification',
  },
  {
    id: 'credits',
    label: 'Credits',
    width: '100px',
    whiteSpace: 'nowrap',
    align: 'right',
    tooltip: 'Credits used',
  },
];

// Map API data to table format
const mapApiDataToTable = (data = []) => {
  if (!Array.isArray(data)) {
    console.error('Expected an array but got:', data);
    return [];
  }
  
  return data.map((item, index) => {
    if (!item) return null;
    
    // Safely handle the date
    let formattedDate = 'N/A';
    try {
      if (item.createdAt) {
        formattedDate = new Date(item.createdAt).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
    }
    
    return {
      id: item._id || `item-${index}`,
      type: item.type === 'BULK' ? 'Bulk' : item.type === 'SINGLE' ? 'Single' : 'Credits',
      status: item.type === 'ADDITION' ? 'ADDITION' :  'DEDUCTION',
      date: formattedDate,
      summary: item.description || item.summary || 'N/A',
      folder: item.folder || '--',
      credits: item.amount || 0,
      statusColor: item.status === 'COMPLETED' ? 'success' :
                item.status === 'FAILED' ? 'error' :
                item.status === 'IN_PROGRESS' ? 'warning' : 'info',
    };
  });
};

// ----------------------------------------------------------------------

export function CreditTable() {
  const dispatch = useDispatch();
  const { history, loading, error } = useSelector((state) => state.credits);
  const theme = useTheme();

  const table = useTable({ defaultOrderBy: 'date' });
  
  // Map API data to table format with error handling
  const tableData = React.useMemo(() => {
    try {
      // console.log('Mapping history data:', history);
      // console.log('Mapping history data:', history?.data);
      const data = history?.data || [];
      return mapApiDataToTable(data);
    } catch (err) {
      console.error('Error mapping table data:', err);
      return [];
    }
  }, [history]);

  // Log for debugging
  React.useEffect(() => {
    console.log('Redux state updated:', { 
      history, 
      loading, 
      error,
      hasHistoryData: !!history?.data,
      historyDataType: history?.data ? (Array.isArray(history.data) ? 'array' : typeof history.data) : 'none'
    });
  }, [history, loading, error]);

  // Fetch credit history on component mount and when pagination changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          page: table.page + 1,
          limit: table.rowsPerPage,
        };
        // console.log('Fetching with params:', params);
        const result =await dispatch(fetchCreditsHistory(params));
        // console.log('Fetch result:', result);
      } catch (err) {
        console.error('Error fetching credit history:', err);
      }
    };

    fetchData();
  }, [dispatch, table.page, table.rowsPerPage]);

  const filters = useSetState({
    name: '',
    status: 'all',
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  // Since we're using server-side pagination, we don't need to slice the data here
  // The API is already returning the correct page of data
  const dataInPage = dataFiltered;

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataInPage.length && canReset) || !dataInPage.length;

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  // Show loading state
  if (loading && !history?.data?.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error message if there's an error and no data
  if (error && !history?.data?.length) {
    return (
      <Box sx={{ p: 3, color: 'error.main' }}>
        Error loading credit history: {error}
      </Box>
    );
  }

  return (
    <Card>
      
      <Divider />

      <CreditTableToolbar filters={filters} onResetPage={table.onResetPage} />

      {canReset && (
        <CreditTableFiltersResult
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
              {dataInPage.map((row, index) => (
                  <CreditTableRow
                    key={index}
                    row={row}
                    selected={table.selected.includes(row.id)}
                  />
                ))}

              <TableEmptyRows
                height={table.dense ? 56 : 56 + 20}
                emptyRows={emptyRows(0, table.rowsPerPage, dataInPage.length)}
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

      <TablePaginationCustom
        page={history?.page ? history.page - 1 : 0} // Convert to 0-based index for MUI
        count={history?.total || 0}
        rowsPerPage={history?.limit || 10}
        onPageChange={(event, newPage) => {
          // Convert to 1-based page number for the API
          const nextPage = newPage + 1;
          dispatch(fetchCreditsHistory({ 
            page: nextPage, 
            limit: history?.limit || 10 
          }));
          table.onChangePage(event, newPage);
        }}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={(event) => {
          const newRowsPerPage = parseInt(event.target.value, 10);
          dispatch(fetchCreditsHistory({ 
            page: 1, // Reset to first page
            limit: newRowsPerPage
          }));
          table.onChangeRowsPerPage(event);
          table.onChangePage(null, 0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
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
      (order) => order.message && order.message.toLowerCase().includes(name.toLowerCase())||
     order.folder && order.folder.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter by status
  if (status !== 'all') {
    filteredData = filteredData.filter((order) => order.credits === status);
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
