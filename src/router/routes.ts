import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    // Authenticated routes
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
            {
                path: 'departments',
                name: 'departments',
                children: [
                    {
                        path: '',
                        name: 'departments.index',
                        component: () => import('pages/Departments/IndexPage.vue'),
                        meta: { requiresAuth: true },
                    },
                    {
                        path: 'create',
                        name: 'departments.create',
                        component: () => import('pages/Departments/CreatePage.vue'),
                        meta: { requiresAuth: true },
                    },
                    {
                        path: ':id/edit',
                        name: 'departments.edit',
                        component: () => import('pages/Departments/EditPage.vue'),
                        meta: { requiresAuth: true },
                        props: true,
                    },
                ],
            },
            {
                path: 'authorization',
                name: 'authorization',
                children: [
                    {
                        path: 'roles',
                        name: 'roles.index',
                        component: () => import('pages/Authorization/Roles/IndexPage.vue'),
                        meta: { requiresAuth: true },
                    },
                    {
                        path: 'permissions/create',
                        name: 'permissions.create',
                        component: () => import('pages/Authorization/Permissions/CreatePage.vue'),
                        meta: { requiresAuth: true },
                    },
                    {
                        path: 'permissions',
                        name: 'permissions.index',
                        component: () => import('pages/Authorization/Permissions/IndexPage.vue'),
                        meta: { requiresAuth: true },
                    },
                    {
                        path: 'roles/:id/permissions',
                        name: 'roles.permissions',
                        component: () => import('pages/Authorization/Roles/RolePermissionsPage.vue'),
                    },
                ],
            },
            {
                path: 'example',
                name: 'example',
                component: () => import('pages/ExamplePage.vue'),
                meta: { requiresAuth: true },
            },
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

    // Error routes
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    },
];

export default routes;