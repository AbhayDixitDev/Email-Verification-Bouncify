import { useState } from 'react';
import { useTheme } from '@emotion/react';
import { Helmet } from 'react-helmet-async';

import { Box, Button, Tooltip, useMediaQuery } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { listItemsSMTP } from 'src/_mock/admin-big-card/_dashboardBigCardListItems';

import { Iconify } from 'src/components/iconify';
import AdminBigCard from 'src/components/admin-big-card/big-card';

import { SmtpTable } from '../smtp-email/components/table/smtp-table';
import AddSmtpDialog from '../smtp-email/components/dialog/smtp-dialog';



// ----------------------------------------------------------------------

const metadata = { title: `Email Notification | ${CONFIG.site.name}` };
const { items, style } = listItemsSMTP;

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [dialogMode, setDialogMode] = useState('add');

  // Modified handler for opening dialog
  const handleOpenDialog = (plan = null) => {
    setSelectedPlan(plan);
    setDialogMode(plan ? 'edit' : 'add');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPlan(null);
    setDialogMode('add');
  };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

     
      <Box width="100%" sx={{ mb: '24px' }}>
        <Box>
          <AdminBigCard
            getHelp={false}
            isVideo
            bigcardtitle="Points To Remember!"
            buttontitle="Add SMTP"
            style={style}
            items={items}
            videoLink="https://www.youtube.com/embed/S-gpjyxqRZo?si=RraJU_Q1ht71Pk2T"
            thumbnailName="pabbly-pev-admin.png"
            action={
              <Tooltip
                title="Click here to add a new SMTP for sending emails notifications."
                arrow
                placement="top"
              >
                <Button
                  onClick={() => handleOpenDialog()}
                  startIcon={
                    <Iconify
                      icon="heroicons:plus-circle-16-solid"
                      style={{ width: 18, height: 18 }}
                    />
                  }
                  variant="outlined"
                  color="primary"
                  size="large"
                >
                  Add SMTP
                </Button>
              </Tooltip>
            }
          />
        </Box>
      </Box>
      <SmtpTable onEditClick={handleOpenDialog} handleOpenDialog={handleOpenDialog} />
      <AddSmtpDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        planData={selectedPlan}
        mode={dialogMode}
      />
    </>
  );
}
