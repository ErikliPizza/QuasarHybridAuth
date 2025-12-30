import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Add navigation guard for authentication
  Router.beforeEach(
    async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) => {
      const authStore = useAuthStore();

      // Validate session for protected routes (throttled to prevent excessive API calls)
      if (to.meta.requiresAuth) {
        await authStore.validateSession();
      }

      // Redirect unauthenticated users to login
      if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'login' });
      }
      // Redirect authenticated users away from guest-only pages
      else if (to.meta.guestOnly && authStore.isAuthenticated) {
        next('/');
      }
      // Allow navigation
      else {
        next();
      }
    },
  );

  return Router;
});
