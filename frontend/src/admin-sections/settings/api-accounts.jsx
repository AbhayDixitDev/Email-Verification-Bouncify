import { useState } from 'react';
import { useTheme } from '@emotion/react';
import { Helmet } from 'react-helmet-async';

import { Box, Button, Tooltip, useMediaQuery } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { listItemsApi } from 'src/_mock/admin-big-card/_dashboardBigCardListItems';

import { Iconify } from 'src/components/iconify';
import StatsCards from 'src/components/stats-card/stats-card';
import AdminBigCard from 'src/components/admin-big-card/big-card';

import { ApiTable } from '../api-&-accounts/components/table/api-table';
import AddApiDialog from '../api-&-accounts/components/dialog/api-dialog';



// ----------------------------------------------------------------------

const metadata = { title: `Integrations | ${CONFIG.site.name}` };
const { items, style } = listItemsApi;

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

 
        <Box
          sx={{
            mb: '24px',
            gap: 3,
            display: 'grid',
            flexWrap: 'wrap',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              xl: 'repeat(3, 1fr)',
            },
          }}
        >
          <Tooltip title="Total number of Connected Integrations." arrow placement="top">
            <div>
              <StatsCards
                cardtitle="Total Connected Integrations"
                cardstats="5"
                icon_name="stash--integrations-duotone.svg"
                icon_color="#FFA92E"
                bg_gradient="#FFA92E"
              />
            </div>{' '}
          </Tooltip>

          <Tooltip title="Total number of Active Integrations." arrow placement="top">
            <div>
              <StatsCards
                cardtitle="Total Active Integrations"
                cardstats="1"
                icon_name="verified.svg"
                icon_color="#28A645"
                bg_gradient="#22C55E"
              />
            </div>
          </Tooltip>
          <Tooltip title="Total number of Inactive Integrations." arrow placement="top">
            <div>
              <StatsCards
                cardtitle="Total Inactive Integrations"
                cardstats="1"
                icon_name="unverified.svg"
                icon_color="#B71D18"
                bg_gradient="#B71D18"
              />
            </div>
          </Tooltip>
          {/* <Tooltip
            title="Total number of email lists that is under verification process."
            arrow
            placement="top"
          >
            <div>
              <StatsCards
                cardtitle="Under Process Email Lists"
                cardstats="1"
                icon_name="process.svg"
                icon_color="#1D88FA"
                bg_gradient="#1D88FA"
              />
            </div>{' '}
          </Tooltip> */}
        </Box>


        <Box width="100%" sx={{ mb: '24px' }}>
          <Box>
            <AdminBigCard
              getHelp={false}
              isVideo
              bigcardtitle="Points To Remember!"
              buttontitle="Integrate  WhatsApp Number"
              style={style}
              items={items}
              videoLink="https://www.youtube.com/embed/S-gpjyxqRZo?si=RraJU_Q1ht71Pk2T"
              thumbnailName="pabbly-pev-admin.png"
              action={
                <Tooltip
                  title="Click here to integrate a new third party application for email verification."
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
                    Integrate
                  </Button>
                </Tooltip>
              }
            />
          </Box>
        </Box>
        <ApiTable onEditClick={handleOpenDialog} handleOpenDialog={handleOpenDialog} />
        <AddApiDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          planData={selectedPlan}
          mode={dialogMode}
        />
 
    </>
  );
}
