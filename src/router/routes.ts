import type { RouteRecordRaw } from 'vue-router';
import managementRoutes from './management.routes';
import guestRoutes from './guest.routes';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('components/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      ...managementRoutes,
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/Shared/Profile/ShowPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'profile/edit',
        name: 'profile-edit',
        component: () => import('pages/Shared/Profile/EditPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  // Guest routes
  ...guestRoutes,

  // Error routes
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
