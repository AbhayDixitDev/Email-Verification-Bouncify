
import React from 'react';
import { Link } from 'react-router-dom';

import {
  Box,
  Card,
  Drawer,
  Divider,
  Tooltip,
  Typography,
  IconButton,
  CardHeader,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

export default function ViewProcessingDrawer({ open, onClose, rowData }) {

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          width: {
            xs: '100%',
            md: 'auto',
            lg: '40%',
          },
        },
      }}
      // ModalProps={{
      //   BackdropComponent: CustomBackdrop, // Use the custom backdrop
      // }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6">Verification in Process</Typography>
          <Typography variant="h8">Check the full details of email verification here.</Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Box>

      {/* <Divider sx={{ my: 2 }} /> */}
      <Card>
        <CardHeader
          title={
            <Tooltip title="Email List Name: Test_List_Pabbly 1" arrow placement="top">
              Test_List_Pabbly 1
            </Tooltip>
          }
          sx={{ mb: 3 }}
        />

        <Divider />
        <Box sx={{ px: 3, pb: 2, mt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Email list is currently under the verification process. You can find the details below
            for the third-party email verification application handling it.{' '}
            <Link href="https://youtu.be/S-gpjyxqRZo" style={{ color: '#078DEE', paddingLeft: '3px' }} underline="always">
              Learn more
            </Link>
          </Typography>

          <Box sx={{ mb: 2, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
            <Box>
              <Typography variant="body2">
                <strong>job_id :</strong> d5kcnspm2za601jpxsi40fsfwfnipm0mi81l
              </Typography>
              <Typography variant="body2">
                <strong>success :</strong> 1
              </Typography>
              <Typography variant="body2">
                <strong>message :</strong> Job verification will be attempted shortly. Call /status
                endpoint to know the status of the Job.
              </Typography>
            </Box>
          </Box>

        </Box>
      </Card>
 
    </Drawer>
  );
}
