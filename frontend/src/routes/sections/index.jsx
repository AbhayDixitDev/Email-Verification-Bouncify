import { Navigate, useRoutes } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { appRoutes } from './app';
import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { adminRoutes } from './admin';

// ----------------------------------------------------------------------

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to={CONFIG.auth.redirectPath} replace />,
    },

    // Auth
    ...authRoutes,

    // App
    ...appRoutes,

    //  Admin
    ...adminRoutes,

    // Main
    ...mainRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
