const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "index",
        component: () => import("pages/IndexPage.vue"),
        meta: {requiresAuth: true},
      },
      {
        path: "/login",
        name: "login",
        component: () => import("pages/LoginPage.vue"),
        meta: {guestOnly: true},
      },
      {
        path: "/profile",
        name: "profile-settings",
        component: () => import("pages/Profile/SettingsPage.vue"),
        meta: {requiresAuth: true},
      },
      {
        path: "/forgot-password",
        name: "forgot-password",
        component: () => import("pages/ForgotPasswordPage.vue"),
        meta: {guestOnly: true},
      },
      {
        path: "/register",
        name: "register",
        component: () => import("pages/RegisterPage.vue"),
        meta: {guestOnly: true},
      }
    ],
  },

  // Catch all for 404
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
