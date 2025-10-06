import { Helmet } from 'react-helmet-async';

import { Box, Grid } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { listItemsActivityLog } from 'src/_mock/admin-big-card/_activitylogBigCardItems';

import BigCard from 'src/components/app-big-card/big-card';

import { ActivityLogTable } from '../activity-log/components/table/activity-log-table';

// ----------------------------------------------------------------------

const metadata = { title: `Activity Log | ${CONFIG.site.name}` };

export default function Page() {
  const { items, style } = listItemsActivityLog;

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <Box sx={{ mt: 4 }}>
        <Grid mt={3} xs={12} md={8} mb={3}>
          <BigCard
            tooltip="View file upload guidelines for email verification."
            getHelp={false}
            isVideo
            bigcardtitle="Points To Remember!"
            style={style}
            items={items}
            videoLink="https://www.youtube.com/embed/MIcaDmC_ngM?si=EJ1SGtn0tdF96b1y"
            thumbnailName="activity-log.png"
            learnMoreLink="https://forum.pabbly.com/threads/activity-log.26108/"
          />
        </Grid>
        <ActivityLogTable />
      </Box>
    </>
  );
}
