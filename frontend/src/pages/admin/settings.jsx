import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/app';

import { Iconify } from 'src/components/iconify';
import CustomTabs from 'src/components/custom-tabs/custom-tabs';

// ----------------------------------------------------------------------

const metadata = { title: `Settings | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const SETTINGS_TABS = [
    {
      value: 'integrated-applications',
      path: '/admin/settings/integrated-applications',
      icon: <Iconify icon="icons8:tasks" width={24} />,
      label: 'Integrations',
      tooltip: 'Integrate and manage third-party email verification API accounts.',
      pageTitle: 'Integrations',
      pageSubheading:
        'Integrate and manage third-party email verification API accounts (MyAddr, Bouncify) used to verify email lists uploaded by customers in their Pabbly Email Verification accounts.',
    },
    {
      value: 'email-notifications',
      path: '/admin/settings/email-notifications',
      icon: <Iconify icon="material-symbols:notifications-active" width={24} />,
      label: 'Email Notifications',
      tooltip: 'Integrate and manage SMTP configurations to streamline verification',
      pageTitle: 'Email Notifications',
      pageSubheading:
        'Manage the SMTP settings used for sending email notifications in the Pabbly Email Verification application.',
    },
    {
      value: 'activity-log',
      path: '/admin/settings/activity-log',
      icon: <Iconify icon="material-symbols:work-history" width={24} />,
      label: 'Activity Log',
      tooltip:
        'Track and monitor all team members activities within the Pabbly Email Verification Admin Panel.',
      pageTitle: 'Activity Log',
      pageSubheading:
        'Track and monitor all team members activities within the Pabbly Email Verification Admin Panel, including actions such as downloading verification reports, deleting email lists, adding integrations, and configuring email notifications. ',
      link: 'https://forum.pabbly.com/threads/activity-log.26108/',
    },

    // ... more tabs
  ];
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DashboardContent maxWidth="xl">
        <CustomTabs
          tabs={SETTINGS_TABS}
          defaultTab="integrated-applications"
          defaultPath="/admin/settings/integrated-applications"
          dashboardContentProps={{ maxWidth: 'xl' }}
        />
      </DashboardContent>
    </>
  );
}
