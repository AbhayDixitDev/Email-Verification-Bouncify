import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Helmet} from 'react-helmet-async';

import {
    Box,
    Card,
    Table,
    Button,
    TableRow,
    TableHead,
    CardHeader,
    Divider,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    IconButton,
    Tooltip,
    Stack,
    Grid,
    Paper
} from '@mui/material';

import {CONFIG} from 'src/config-global';
import {fDateTimeInTimezone} from 'src/utils/format-time';

import {Iconify} from 'src/components/iconify';
import {Scrollbar} from 'src/components/scrollbar';
import {TableEmptyRows, TableHeadCustom, TableNoData} from 'src/components/table';

import {fetchActivityLogs, setFilters, setPagination, clearFilters} from 'src/redux/slice/activityLogSlice';
import {fetchUserTimeZone} from 'src/redux/slice/timeZoneSlice';
import ActivityLogDetailsModal from './activity-log-details-modal';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {
        id: 'action',
        label: 'Action',
        width: 120
    },
    {
        id: 'module',
        label: 'Module',
        width: 150
    },
    {
        id: 'url',
        label: 'URL',
        width: 200
    },
    {
        id: 'source',
        label: 'Source',
        width: 100
    }, {
        id: 'createdAt',
        label: 'Date & Time',
        width: 180
    }, {
        id: 'data',
        label: 'Details',
        width: 100
    },
];

const ACTION_OPTIONS = [
    {
        value: '',
        label: 'All Actions'
    }, {
        value: 'POST',
        label: 'POST'
    }, {
        value: 'PUT',
        label: 'PUT'
    }, {
        value: 'DELETE',
        label: 'DELETE'
    },
];

const SOURCE_OPTIONS = [
    {
        value: '',
        label: 'All Sources'
    }, {
        value: 'user',
        label: 'User Interface'
    }, {
        value: 'api',
        label: 'API'
    },
];

export default function ActivityLogView() {
    const dispatch = useDispatch();
    const {
        activityLogs,
        pagination,
        filters,
        loading,
        error
    } = useSelector((state) => state.activityLog);
    const {selectedTimeZone} = useSelector((state) => state.timeZone);

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedActivityLog, setSelectedActivityLog] = useState(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    // Fetch activity logs when component mounts or filters change
    useEffect(() => {
        dispatch(fetchActivityLogs({
            page: page + 1,
            limit: rowsPerPage,
            ...filters
        }));
    }, [dispatch, page, rowsPerPage, filters]);

    // Ensure user's timezone is loaded when visiting this page directly
    useEffect(() => {
        if (!selectedTimeZone ?. key) {
            dispatch(fetchUserTimeZone());
        }
    }, [
        dispatch,
        selectedTimeZone ?. key
    ]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = (filterType, value) => {
        dispatch(setFilters({[filterType]: value}));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        // Debounce search
        const timeoutId = setTimeout(() => {
            dispatch(setFilters({module: event.target.value}));
            setPage(0);
        }, 500);
        return() => clearTimeout(timeoutId);
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
        setSearchTerm('');
        setPage(0);
    };

    const handleViewDetails = (activityLog) => {
        setSelectedActivityLog(activityLog);
        setDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setDetailsModalOpen(false);
        setSelectedActivityLog(null);
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'POST':
                return 'success';
            case 'PUT':
                return 'warning';
            case 'DELETE':
                return 'error';
            default:
                return 'default';
        }
    };

    const getSourceColor = (source) => {
        switch (source) {
            case 'user':
                return 'primary';
            case 'api':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const formatDate = (date) => {
        if (!date) 
            return '';
        
        const timezone = selectedTimeZone ?. key || 'UTC';
        return fDateTimeInTimezone(date, timezone, 'MMM DD, YYYY HH:mm:ss');
    };

    const filteredLogs = activityLogs.filter((log) => log.url.toLowerCase().includes(searchTerm.toLowerCase()) || (log.module_name && log.module_name.toLowerCase().includes(searchTerm.toLowerCase())));

    return (
        <>
            <Helmet>
                <title>Activity Log | {
                    CONFIG.site.name
                }</title>
            </Helmet>

            <Box sx={{ mb: 1.5 }}>
        <Typography variant="h6">Activity Log</Typography>
        <Typography variant="body2" color="text.secondary">
          View your activity logs.
        </Typography>
      </Box>

 
                <Card>
                <Divider />
                   
                    <Box sx={
                        {p: 3}
                    }>
                        {/* Filters */}
                        <Grid container
                            spacing={2}
                            sx={
                                {mb: 0}
                        }>
                            <Grid item
                                xs={12}
                                md={4}>
                                <TextField fullWidth placeholder="Search by module or URL..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    InputProps={
                                        {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Iconify icon="eva:search-fill"/>
                                                </InputAdornment>
                                            )
                                        }
                                    }/>
                            </Grid>
                            <Grid item
                                xs={12}
                                md={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Action</InputLabel>
                                    <Select value={
                                            filters.action
                                        }
                                        label="Action"
                                        onChange={
                                            (e) => handleFilterChange('action', e.target.value)
                                    }>
                                        {
                                        ACTION_OPTIONS.map((option) => (
                                            <MenuItem key={
                                                    option.value
                                                }
                                                value={
                                                    option.value
                                            }>
                                                {
                                                option.label
                                            } </MenuItem>
                                        ))
                                    } </Select>
                                </FormControl>
                            </Grid>
                            <Grid item
                                xs={12}
                                md={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Source</InputLabel>
                                    <Select value={
                                            filters.source
                                        }
                                        label="Source"
                                        onChange={
                                            (e) => handleFilterChange('source', e.target.value)
                                    }>
                                        {
                                        SOURCE_OPTIONS.map((option) => (
                                            <MenuItem key={
                                                    option.value
                                                }
                                                value={
                                                    option.value
                                            }>
                                                {
                                                option.label
                                            } </MenuItem>
                                        ))
                                    } </Select>
                                </FormControl>
                            </Grid>
                            <Grid item
                                xs={12}
                                md={2}>
                                <Button variant="outlined"
                                    onClick={handleClearFilters}
                                    startIcon={
                                        <Iconify
                                    icon="eva:refresh-fill"/>
                                }>
                                    Clear
                                </Button>
                            </Grid>
                        </Grid>

                    </Box>

                    {/* Activity Logs Table */}
                    <TableContainer sx={
                        {
                            position: 'relative',
                            overflow: 'unset'
                        }
                    }>
                        <Scrollbar>
                            <Table size="medium"
                                sx={
                                    {minWidth: 960}
                            }>
                                <TableHeadCustom headLabel={TABLE_HEAD}
                                    rowCount={
                                        filteredLogs.length
                                    }
                                    numSelected={0}/>

                                <TableBody> {
                                    filteredLogs.map((log, index) => (
                                        <TableRow key={
                                                log._id
                                            }
                                            hover>
                                            <TableCell>
                                                <Chip label={
                                                        log.action
                                                    }
                                                    color={
                                                        getActionColor(log.action)
                                                    }
                                                    size="small"/>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" noWrap>
                                                    {
                                                    log.module_name || 'N/A'
                                                } </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" noWrap
                                                    sx={
                                                        {maxWidth: 200}
                                                }>
                                                    {
                                                    log.url
                                                } </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip sx={{textTransform: 'uppercase'}} label={
                                                        log.event_source
                                                    }
                                                    color={
                                                        getSourceColor(log.event_source)
                                                    }
                                                    size="small"/>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {
                                                    formatDate(log.createdAt)
                                                } </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="View details">
                                                    <IconButton size="small"
                                                        onClick={
                                                            () => handleViewDetails(log)
                                                    }>
                                                        <Iconify icon="eva:eye-fill"/>
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }

                                    <TableEmptyRows height={56}
                                        emptyRows={
                                            Math.max(0, rowsPerPage - filteredLogs.length)
                                        }/> {
                                    filteredLogs.length === 0 && (
                                        <TableNoData title="No activity logs found" description="No activity logs match your current filters"
                                            notFound={true}/>
                                    )
                                } </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>

                    {/* Pagination */}
                    <TablePagination page={page}
                        component="div"
                        count={
                            pagination.total
                        }
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={
                            [5, 10, 25]
                        }
                        onRowsPerPageChange={handleChangeRowsPerPage}/> {/* Details Modal */}
                    <ActivityLogDetailsModal open={detailsModalOpen}
                        onClose={handleCloseDetailsModal}
                        activityLog={selectedActivityLog}/>
                </Card>


        </>
    );
}
