import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const appicon = (name) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/app/${name}.svg`} />
);
const adminicon = (name) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/admin/${name}.svg`} />
);

const APPICONS = {
  dashboard: appicon('ic-dashboard'),
  reports: appicon('ic-reports'),
  credits: appicon('ic-credit'),
  gethelp: appicon('ic-gethelp'),
  settings: appicon('ic-settings'),
  users: appicon('ic-users'), // You'll need to add this icon
  logs: appicon('ic-logs'), // You'll need to add this icon
};
const ADMINICONS = {
  emailLists: adminicon('ic-email-lists'),
  settings: adminicon('ic-settings'),
};

// ----------------------------------------------------------------------

export const appNavData = [
  {
    items: [{ title: 'Dashboard', path: paths.app.root, icon: APPICONS.dashboard }],
  },
  {
    items: [
      {
        title: 'Settings',
        path: paths.app.settings.root,
        icon: APPICONS.settings,
        children: [
          { title: 'Credits Summary', path: paths.app.settings.credits },
          // { title: 'API', path: paths.app.settings.api },
          // { title: 'Team Members', path: paths.app.settings.teamMembers },
          { title: 'Activity Log', path: paths.app.settings.activityLog },
          { title: 'Time Zone', path: paths.app.settings.timezone },
        ],
      },
    ],
  },
  {
    items: [{ title: 'Get Help', path: paths.app.gethelp, icon: APPICONS.gethelp }],
  },
];

export const adminNavData = [
  {
    items: [{ title: 'Email Lists', path: paths.admin.root, icon: ADMINICONS.emailLists }],
  },
  {
    items: [
      {
        title: 'Settings',
        path: paths.admin.settings.root,
        icon: ADMINICONS.settings,
        children: [
          { title: 'Integrations', path: paths.admin.settings.integratedApps },
          { title: 'Email Notifications', path: paths.admin.settings.emailNoti },
          { title: 'Activity Log', path: paths.admin.settings.activitylog },
        ],
      },
    ],
  },
];

// Helper function to get the correct nav data based on the route
export const getNavData = (pathname) => {
  if (pathname.startsWith('/admin')) {
    return adminNavData;
  }
  return appNavData;
};
