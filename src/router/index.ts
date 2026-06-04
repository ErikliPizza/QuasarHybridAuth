import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import type { RouteLocationNormalized } from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth';

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to: RouteLocationNormalized) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth) {
      const isValidSession = await authStore.validateSession();
      if (!isValidSession) {
        return { name: 'login' };
      }
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
      const isValidSession = await authStore.validateSession();
      if (isValidSession) {
        return { name: 'index' };
      }
    }

    return true;
  });

  return Router;
});
