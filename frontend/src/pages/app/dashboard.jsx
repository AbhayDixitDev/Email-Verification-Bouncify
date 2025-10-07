import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import axios, { endpoints } from 'src/utils/axios';
import { useTheme } from '@emotion/react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import { useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import { Helmet } from 'react-helmet-async';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { Iconify } from 'src/components/iconify';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/app';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import BigCard from 'src/components/app-big-card/big-card';
import PageHeader from 'src/components/page-header/page-header';

import { listItems } from 'src/_mock/app-big-card/_dashboardBigCardListItems';
import { deductCredit, fetchCreditBalance } from 'src/redux/slice/creditSlice';
import Upload from 'src/sections/dashboard/component/upload/upload-file';

import { DashboardTable } from 'src/sections/dashboard/component/table/dashboard-table';
// import { FolderSection } from 'src/sections/dashboard/component/folder/dashboardfolder';
import CreditStatsCards from 'src/sections/dashboard/component/stats-cards/credit-stats-cards';
import VerifySingleEmail from 'src/sections/dashboard/component/verify-single-email/verify-single-email';
import { DashboardTrashTable } from 'src/sections/dashboard/component/dashboard-trash-table/dashboard-trash-table';
import { pollJobStatus } from 'src/redux/slice/listSlice';




const metadata = { title: 'Dashboard | Pabbly Email Verification' };
const { items, style } = listItems;

export default function Page() {
  const dispatch = useDispatch();
useEffect(() => {
  const activeJobId = localStorage.getItem('activeJobId');
  if (activeJobId) {
    dispatch(pollJobStatus({ jobId: activeJobId }));
  }
}, [dispatch]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [email, setEmail] = useState('');
  const [activeTable, setActiveTable] = useState('dashboard');
  const [selectedFolder, setSelectedFolder] = useState('Home');
  const [isFromSingleEmail, setIsFromSingleEmail] = useState(false);
  const { totalCredits, usedCredits, remainingCredits } = useSelector((state) => state.credits);
  
  const [alertState, setAlertState] = useState({
    open: false,
    severity: 'success',
    title: '',
    message: '',
    status: '',
  });

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);

  const handleTrashClick = () => {
    setActiveTable('trash');
  };

  const handleHomeClick = () => {
    setActiveTable('dashboard');
    setSelectedFolder('Home');
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // In Page.js
const [loading, setLoading] = useState(false);

const handleVerify = () => {
  setLoading(true); // Show loading spinner
  axios
    .post(`${endpoints.list.verifySingle}`, { email })
    .then((res) => {
      dispatch(deductCredit({ amount: 1 }));
      setAlertState({
        open: true,
        severity: res.data.data.result === 'deliverable' ? 'success' : 'error',
        status: res.data.data.result === 'deliverable' ? 'Accept All' : 'Undeliverable',
        message: res.data.data.result === 'deliverable'
          ? `The email "${email}" is valid!`
          : `${res.data.data.result}`,
        title: 'Verification Result',
      });
      setTimeout(() => {
        handleDialogClose('singleEmail');

        setLoading(false); // Stop loading
        window.location.reload();
      }, 1500); // Wait 1.5s before closing
    })
    .catch((err) => {
      setAlertState({
        open: true,
        severity: 'error',
        status: '',
        message: `${err.message}`,
        title: '',
      });
      setTimeout(() => {
        handleDialogClose('singleEmail');
        setLoading(false); // Stop loading
      }, 1500);
    })
    .finally(() => {
      setEmail('');
    });
};


  useEffect(() => {
    if (!totalCredits) {
      dispatch(fetchCreditBalance());
    }
  }, [totalCredits, dispatch]);

  // function calculateStats(allottedCredits, consumedCredits) {
  //   const remainingCredits = allottedCredits - consumedCredits;
  //   return {
  //     allotted: allottedCredits,
  //     consumed: consumedCredits,
  //     remaining: remainingCredits,
  //   };
  // }

  // const allottedCredits = 10000;
  // const consumedCredits = 32;

  // const stats = calculateStats(allottedCredits, consumedCredits);

  const [dialogState, setDialogState] = useState({
    singleEmail: false,
    bulkEmail: false,
  });

  const handleMenuItemClick = (type) => {
    setDialogState((prev) => ({
      ...prev,
      [type]: true,
    }));
    if (type !== 'singleEmail') {
      setIsFromSingleEmail(false);
    }
    handlePopoverClose();
  };

  const handleDialogClose = (type) => {
    setDialogState((prev) => ({
      ...prev,
      [type]: false,
    }));
  };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DashboardContent maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: { xs: 'flex-start', lg: 'center' },
            justifyContent: 'space-between',
            mb: 0,
          }}
        >
          <PageHeader
            title="Dashboard"
            Subheading="Verify and manage all your email lists in one place with the Pabbly Email Verification Dashboard. "
            link_added="https://forum.pabbly.com/threads/dashboard.26311/"
          />
          <Tooltip
            title="Click to verify single or bulk email addresses."
            arrow
            placement="top"
            disableInteractive
          >
            <Button
              sx={{ mt: { xs: 1, lg: 0 } }}
              startIcon={<Iconify icon="heroicons:plus-circle-16-solid" />}
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              onClick={handlePopoverOpen}
              color="primary"
              variant="contained"
              size="large"
            >
              Verify Email
            </Button>
          </Tooltip>
        </Box>
        <Box marginTop={5}>
          <CreditStatsCards />
        </Box>
        {/* <Box
          width="100%"
          sx={{
            mt: '40px',
            mb: '24px',
            gap: 3,
            display: 'grid',
            flexWrap: 'wrap',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
          }}
        >
          <StatsCards
            cardtitle="Email Credits Consumed"
            cardstats={stats.consumed}
            icon_name="Processed.svg"
            icon_color="#10CBF3"
            bg_gradient="#10CBF3"
            tooltipTittle="Number of emails credits consumed by your account."
          />
          <StatsCards
            cardtitle="Email Credits Remaining"
            cardstats={stats.remaining}
            icon_name="Complete.svg"
            icon_color="#1D88FA"
            bg_gradient="#1D88FA"
            tooltipTittle="Number of emails credits remaining in your account."
          />
          <StatsCards
            cardtitle="Total Number of Email Lists"
            cardstats="100"
            icon_name="list.svg"
            icon_color="#28a645"
            bg_gradient="#28a645"
            tooltipTittle="Number of email lists uploaded in your account."
          />
        </Box> */}

        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={4} lg={3}>
            <FolderSection onHomeClick={handleHomeClick} onTrashClick={handleTrashClick} />
          </Grid> */}
          <Grid item xs={12} md={12} lg={12}>
            <BigCard
              tooltip="View file upload guidelines for email verification."
              getHelp={false}
              isVideo
              bigcardtitle="Verification Guidelines"
              bigcardsubtitle="Please adhere to the following guidelines when uploading your CSV file:"
              style={style}
              items={items}
              videoLink="https://www.youtube.com/embed/MIcaDmC_ngM?si=EJ1SGtn0tdF96b1y"
              thumbnailName="email-verication-video-thumbnail.jpg"
              keyword="Note:"
              learnMoreLink="https://forum.pabbly.com/threads/dashboard.26311/"
              bigcardNote="All data and reports older than 15 days will be permanently removed automatically. For reference, you can Download Sample File to guide you in formatting your data correctly."
              action={
                <Tooltip
                  title="Click to verify single or bulk email addresses."
                  arrow
                  placement="top"
                  disableInteractive
                >
                  <Button
                    startIcon={<Iconify icon="heroicons:plus-circle-16-solid" />}
                    endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    onClick={handlePopoverOpen}
                    color="primary"
                    variant="outlined"
                    size="large"
                  >
                    Verify Email
                  </Button>
                </Tooltip>
              }
            />
            <Box sx={{ mt: 3 }}>
              
                <DashboardTable selectedFolder={selectedFolder} />
             
            </Box>
          </Grid>
        </Grid>
      </DashboardContent>

      <Dialog
        open={dialogState.singleEmail}
        onClose={() => handleDialogClose('singleEmail')}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 'sm',
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
        <VerifySingleEmail
  onVerify={handleVerify}
  email={email}
  setEmail={setEmail}
  onClose={() => handleDialogClose('singleEmail')}
  loading={loading}
/>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogState.bulkEmail} onClose={() => handleDialogClose('bulkEmail')} fullWidth>
        <DialogTitle display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6">Verify Bulk Email List</Typography>
            <Typography mt="4px" fontSize="14px" color="text.secondary">
              Upload email list for bulk verification. Download{' '}
              <Link href="src/assets/sample-files/sample_csv.csv" download underline="always">
                sample file
              </Link>{' '}
              here.
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Upload setAlertState={setAlertState} onUpload={() => handleDialogClose('bulkEmail')} />
        </DialogContent>
        <DialogActions>
          <Box
            sx={{
              mt: 1,
              pt: 0,
              gap: 1,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button variant="contained" color="primary" onClick={() => handleDialogClose('bulkEmail')}>
              Upload
            </Button>
            <Button onClick={() => handleDialogClose('bulkEmail')} variant="outlined">
              Cancel
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuList>
          <Tooltip
            title="Click to verify a single email."
            arrow
            placement="left"
            disableInteractive
          >
            <MenuItem onClick={() => handleMenuItemClick('singleEmail')}>
              Verify Single Email
            </MenuItem>
          </Tooltip>
          <Tooltip title="Click to verify bulk emails." arrow placement="left" disableInteractive>
            <MenuItem onClick={() => handleMenuItemClick('bulkEmail')}>Verify Bulk Emails</MenuItem>
          </Tooltip>
        </MenuList>
      </Popover>
    </>
  );
}
