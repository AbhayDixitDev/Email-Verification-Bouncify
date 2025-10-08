import { useTheme } from '@emotion/react';
import { Helmet } from 'react-helmet-async';

import { Box, Divider, Typography  } from '@mui/material';

// eslint-disable-next-line import/no-unresolved
import { CONFIG } from 'src/config-global';

// eslint-disable-next-line import/no-unresolved
import  {CreditTable}  from 'src/sections/dashboard copy/component/table/credit-table';

import CreditStatsCards from '../dashboard/component/stats-cards/credit-stats-cards';

// ----------------------------------------------------------------------

const metadata = { title: `Credits | ${CONFIG.site.name}` };

export default function ThreePage() {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      {/* Summary cards fetched from backend */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="h6">Credit Summary</Typography>
        <Typography variant="body2" color="text.secondary">
          View your allotted, consumed, and remaining email verification credits.
        </Typography>
      </Box>
      <CreditStatsCards/>
      <Divider sx={{ my: 3 }} />
      
      {/* <Box
        width="100%"
        sx={{
          mb: 3,
          gap: 3,
          display: 'grid',
          flexWrap: 'wrap',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        <StatsCards
          cardtitle="Email Credits Allotted"
          cardstats={stats.allotted}
          icon_name="2card.png"
          icon_color="#FFA92E"
          bg_gradient="#FFA92E"
          tooltipTittle="Number of credits allotted to your account."
        />
        <StatsCards
          cardtitle="Email Credits Consumed"
          cardstats={stats.consumed}
          icon_name="Processed.svg"
          icon_color="#10CBF3"
          bg_gradient="#10CBF3"
          tooltipTittle="Number of credits consumed by your account."
        />
        <StatsCards
          cardtitle="Email Credits Remaining"
          cardstats={stats.remaining}
          icon_name="Complete.svg"
          icon_color="#1D88FA"
          bg_gradient="#1D88FA"
          tooltipTittle="Number of credits remaining in your account."
        />
      </Box> */}
      <CreditTable />
      {/* </DashboardContent> */}
    </>
  );
}
