import { useState, useEffect } from 'react';

// Material UI
import Box from '@mui/material/Box';

// Utils
import axios, { endpoints } from 'src/utils/axios';

// Components
import StatsCards from 'src/components/stats-card/stats-card';

export default function CreditStatsCards() {
  const [credits, setCredits] = useState({ totalCredits: 0, usedCredits: 0, remainingCredits: 0 });
  const [totals, setTotals] = useState({ totalListsCombined: 0 });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [creditRes, statsRes] = await Promise.all([
          axios.get(endpoints.credit.getBalance),
          axios.get(endpoints.list.chart),
        ]);

        const creditPayload = creditRes?.data?.data || {};
        const statsPayload = statsRes?.data?.data || {};
        if (isMounted) {
          setCredits({
            totalCredits: creditPayload.totalCredits || 0,
            usedCredits: creditPayload.usedCredits || 0,
            remainingCredits: creditPayload.remainingCredits || 0,
          });
          setTotals({
            totalListsCombined: statsPayload.totalListsCombined || 0,
          });
        }
      } catch (err) {
        // Ignore display errors on dashboard top cards
        // console.error(err);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);
  return (
    <Box
      width="100%"
      sx={{
        mb: 3,
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
      {/* <StatsCards
        cardtitle="Email Credits Allotted"
        cardstats={stats.allotted}
        icon_name="2card.png"
        icon_color="#FFA92E"
        bg_gradient="#FFA92E"
        tooltipTittle="Number of emails credits allotted to your account."
      /> */}
      <StatsCards
        cardtitle="Email Credits Consumed"
        cardstats={credits.usedCredits}
        icon_name="Processed.svg"
        icon_color="#10CBF3"
        bg_gradient="#10CBF3"
        tooltipTittle="Number of emails credits consumed by your account."
      />
      <StatsCards
        cardtitle="Email Credits Remaining"
        cardstats={credits.remainingCredits}
        icon_name="Complete.svg"
        icon_color="#1D88FA"
        bg_gradient="#1D88FA"
        tooltipTittle="Number of emails credits remaining in your account."
      />
      <StatsCards
        cardtitle="Total Number of Email Lists"
        cardstats={totals.totalListsCombined}
        icon_name="list.svg"
        icon_color="#28a645"
        bg_gradient="#28a645"
        tooltipTittle="Number of email lists uploaded in your account."
      />
    </Box>
  );
}
