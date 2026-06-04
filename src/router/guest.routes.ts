import type { RouteRecordRaw } from 'vue-router';

/**
 * Guest routes
 * Routes accessible only to unauthenticated users
 */
const guestRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('components/layouts/GuestLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/Shared/Auth/LoginPage.vue'),
        meta: { guestOnly: true },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/Shared/Auth/RegisterPage.vue'),
        meta: { guestOnly: true },
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('pages/Shared/Auth/ForgotPasswordPage.vue'),
        meta: { guestOnly: true },
      },
    ],
  },
];

export default guestRoutes;
