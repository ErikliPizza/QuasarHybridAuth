const routes = [
  // Main layout for authenticated pages
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "index",
        component: () => import("pages/IndexPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/profile",
        name: "profile-settings",
        component: () => import("pages/Profile/SettingsPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/team",
        name: "team",
        component: () => import("pages/Team/IndexPage.vue"),
        meta: { requiresAuth: true },
      }
    ],
  },

  // Guest layout for guest-only pages
  {
    path: "/",
    component: () => import("layouts/GuestLayout.vue"),
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("pages/Auth/LoginPage.vue"),
        meta: { guestOnly: true },
      },
      {
        path: "forgot-password",
        name: "forgot-password",
        component: () => import("pages/Auth/ForgotPasswordPage.vue"),
        meta: { guestOnly: true },
      },
      {
        path: "register",
        name: "register",
        component: () => import("pages/Auth/RegisterPage.vue"),
        meta: { guestOnly: true },
      },
    ],
  },

  // Catch all for 404
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
