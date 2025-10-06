import React, { useState } from 'react';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import {
  Box,
  Alert,
  Dialog,
  Button,
  Tooltip,
  Typography,
  DialogTitle,
  DialogActions,
} from '@mui/material';

import { fNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Chart, useChart, ChartLegends } from 'src/components/chart';

export function DashboardChart({ title, subheader, showAlert, chart, handleAlertClose, ...other }) {
  const theme = useTheme();

  const [hasShownUploadAlert, setHasShownUploadAlert] = useState(false);
  const [hasShownVerificationAlert, setHasShownVerificationAlert] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    mode: '',
  });
  const [selectedOption, setSelectedOption] = useState('all-results');

  const downloadActions = [
    {
      id: 'all-results',
      itemName: 'All Emails Result ',
      itemIcon: 'material-symbols:check-circle',
    },
    {
      id: 'deliverable',
      itemName: 'Deliverable Emails',
      itemIcon: 'ep:list',
    },
    {
      id: 'undeliverable',
      itemName: 'Undeliverable Emails',
      itemIcon: 'gridicons:cross-circle',
    },
  ];

  const chartColors = chart.colors ?? [
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.info.main,
    theme.palette.warning.main,
  ];

  const chartSeries = chart.series.map((item) => item.value);

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: chart.series.map((item) => item.label),
    stroke: { width: 0 },
    tooltip: {
      y: {
        formatter: (value) => fNumber(value),
        title: { formatter: (seriesName) => `${seriesName}` },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            value: { formatter: (value) => fNumber(value) },
            total: {
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return fNumber(sum);
              },
            },
          },
        },
      },
    },
    ...chart.options,
  });

  // Dialog handlers
  const handleOpen = (mode) => {
    setDialog({ open: true, mode });
    setSelectedOption('all-results'); // Reset selection when opening dialog
  };

  const handleClose = () => {
    setDialog({ open: false, mode: '' });
  };

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleDownload = () => {
    console.log(`Downloading ${selectedOption}`);
    handleClose();
  };

  return (
    <>
  
 <Scrollbar>
 <Card {...other}>
   <Box
     sx={{
       display: 'flex',
       justifyContent: 'space-between',
       alignItems: 'center',
       flexWrap:'wrap',
       p: 2,
       width: '100%',
     }}
   >
     <CardHeader
       sx={{
         flex: 1,
         p: 0,
        
       }}
       title={
       
         <Typography
           sx={{
             overflow: 'hidden',
             textOverflow: 'ellipsis',
             whiteSpace: 'nowrap',
             maxWidth: '320px', // Adjust the width accordingly
           }}
           variant="h6"
         >
           <Tooltip
             arrow
             placement="top"
             disableInteractive
             title={`Email List Name: ${title}`}
           >
             <span>{title.length > 30 ? `${title.slice(0, 30)}...` : title}</span>
           </Tooltip>
         </Typography>
       }
      
     />
     {/* Only show download button when not uploading or processing */}
 
        <Tooltip arrow placement="top" disableInteractive title="Click to download report.">
         <Button
         sx={{mt:{xs:'10px',sm:'0px'}}}
           variant="outlined"
           color="primary"
           onClick={() => handleOpen('download')}
           startIcon={<Iconify width={24} icon="solar:download-minimalistic-bold" />}
         >
           Download
         </Button>
       </Tooltip>
   
   </Box>
   <Divider />

 
     <>
       <Chart
         type="donut"
         series={chartSeries}
         options={{
           ...chartOptions,
           tooltip: {
             y: {
               formatter: (value) => fNumber(value),
               title: { formatter: (seriesName) => `${seriesName}` },
             },
           },
         }}
         width={{ xs: 240, xl: 260 }}
         height={{ xs: 240, xl: 260 }}
         sx={ { my: { xs: 'auto', md: 4 }, mx: 'auto' }}
       />
       <Divider sx={{ borderStyle: 'dashed' }} />
       <ChartLegends
         labels={chartOptions.labels}
         colors={chartOptions.colors}
         values={[156454, 12244, 43313, 53345, 78343]}
         totalEmails={188245}
         sx={{
           py: 2,
           flexDirection: 'column',
           borderTop: '1px dashed',
           borderColor: 'divider',
         }}
       />
     </>


 </Card> 
 </Scrollbar> 
      <Alert
        sx={{
          mt: 3,
          mb: 4,
          boxShadow: '0px 12px 24px -4px rgba(145, 158, 171, 0.2)',
        }}
        severity="warning"
      >
        Note: All data and reports will be automatically deleted after 15 days. A copy of the report
        will be sent to the pabbly customer&apos;s registered email before deletion.
      </Alert>

      <Dialog open={dialog.open} onClose={handleClose} maxWidth="sm" fullWidth>
        <Box 
        >
          {dialog.mode === 'download' && (
            <>
              <DialogTitle sx={{ p: 2 }}>
                <Typography variant="h6">Download Verification Report</Typography>
               
              </DialogTitle>
              <Divider sx={{ width: '100%', mb: 3 }} />
              <Box sx={{ px: 2 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(2, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                    },
                    gap: 2,
                    mb: 4,
                    '& > button': {
                      aspectRatio: '1 / 1',
                      width: '100%',
                      height:'auto',
                    },
                  }}
                >
                  {downloadActions.map((action) => (
                    <Button
                      key={action.id}
                      onClick={() => handleOptionSelect(action.id)}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        
                        // p: 2,
                        border: 2,
                        borderColor: selectedOption === action.id ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        bgcolor:
                          selectedOption === action.id ? 'primary.lighter' : 'background.paper',
                        '&:hover': {
                          borderColor:
                            selectedOption === action.id ? 'primary.main' : 'text.secondary',
                          bgcolor:
                            selectedOption === action.id ? 'primary.lighter' : 'action.hover',
                        },
                      }}
                    >
                      <Box>
                        <Iconify
                          icon={action.itemIcon}
                          width={24}
                          sx={{
                            color: selectedOption === action.id ? 'primary.main' : 'text.secondary',
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          mt: 1,
                          color: selectedOption === action.id ? 'primary.main' : 'text.secondary',
                          fontWeight: selectedOption === action.id ? 500 : 400,
                        }}
                      >
                        {action.itemName}
                      </Typography>
                    </Button>
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  You can download email verification results by selecting one of the three tabs:
                  All Emails, Deliverable Emails, or Undeliverable Emails. Simply choose a tab and
                  click &quot;Download CSV&quot; to obtain the report.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Note: All data and reports will be automatically deleted after 15 days. A copy of
                  the report will be sent to the pabbly customer&apos;s registered email before
                  deletion.
                </Typography>

                <DialogActions sx={{ pr: 0 }}>
                  <Tooltip title="Download the selected report above." arrow placement="top">
                    <Button variant="contained" color="primary" onClick={handleDownload}>
                      Download
                    </Button>
                  </Tooltip>

                  <Button variant="outlined" color="inherit" onClick={handleClose}>
                    Close
                  </Button>
                </DialogActions>
              </Box>
            </>
          )}
        </Box>
      </Dialog>
    </>
  );
}
