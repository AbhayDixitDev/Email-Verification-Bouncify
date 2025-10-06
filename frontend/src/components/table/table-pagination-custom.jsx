import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';

// ----------------------------------------------------------------------

export function TablePaginationCustom({
  sx,
  dense,
  onChangeDense,
  page=0,
  onPageChange,
  rowsPerPageOptions = [5, 10, 25],
  ...other
}) {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        page={page}
        onPageChange={onPageChange}
        component="div"
        {...other}
        sx={{ borderTopColor: 'transparent' }}
      />
    </Box>
  );
}
