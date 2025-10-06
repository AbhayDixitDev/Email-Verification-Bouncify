import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/app';

import ActivityLogView from '../activity-log/activity-log-view';

// ----------------------------------------------------------------------

const metadata = { title: `Activity Log | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      {/* <DashboardContent maxWidth="xl"> */}
        <ActivityLogView />
      {/* </DashboardContent> */}
    </>
  );
}