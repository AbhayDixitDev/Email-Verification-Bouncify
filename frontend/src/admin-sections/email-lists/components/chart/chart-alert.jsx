
import { Box, Alert, Button, Typography } from '@mui/material';

export default function ChartAlert() {
 
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Stack items vertically
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center verticall
        mb: 3,
        mt: 6,
        px: 3,
      }}
    >
      <Alert severity="success" variant="outlined" sx={{ width: '100%' }}>
        <Typography variant="body1" fontWeight={600}>
          Uploaded Successfully
        </Typography>
      </Alert>
      <Button color="primary" sx={{ mt: 2 }} >
        Start Verification
      </Button>
    </Box>
  );
}
