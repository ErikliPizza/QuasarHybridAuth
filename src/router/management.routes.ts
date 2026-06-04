import type { RouteRecordRaw } from 'vue-router';

/**
 * Management routes
 * All routes related to system management features
 */
const managementRoutes: RouteRecordRaw[] = [
  // Users
  {
    path: 'users',
    name: 'users',
    children: [
      {
        path: 'index',
        name: 'users.index',
        component: () => import('pages/Management/Users/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'create',
        name: 'users.create',
        component: () => import('pages/Management/Users/CreatePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: ':id',
        name: 'users.show',
        component: () => import('pages/Management/Users/EditPage.vue'),
        meta: { requiresAuth: true },
        props: (route) => ({ id: Number(route.params.id) }),
      },
    ],
  },

  // Authorization
  {
    path: 'authorization',
    name: 'authorization',
    children: [
      {
        path: 'roles',
        name: 'roles',
        children: [
          {
            path: '',
            name: 'roles.index',
            component: () => import('pages/Management/Authorization/Roles/IndexPage.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'create',
            name: 'roles.create',
            component: () => import('pages/Management/Authorization/Roles/CreatePage.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: ':id/edit',
            name: 'roles.edit',
            component: () => import('pages/Management/Authorization/Roles/EditPage.vue'),
            meta: { requiresAuth: true },
            props: (route) => ({ id: Number(route.params.id) }),
          },
        ],
      },
      {
        path: 'permissions/create',
        name: 'permissions.create',
        component: () => import('pages/Management/Authorization/Permissions/CreatePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'permissions/:id/edit',
        name: 'permissions.edit',
        component: () => import('pages/Management/Authorization/Permissions/EditPage.vue'),
        meta: { requiresAuth: true },
        props: (route) => ({ id: Number(route.params.id) }),
      },
      {
        path: 'permissions',
        name: 'permissions.index',
        component: () => import('pages/Management/Authorization/Permissions/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
];

export default managementRoutes;
