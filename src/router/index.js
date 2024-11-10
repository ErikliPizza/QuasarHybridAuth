import {route} from "quasar/wrappers";
import {createRouter, createMemoryHistory, createWebHistory, createWebHashHistory} from "vue-router";
import routes from "./routes";
import {useAuthStore} from "src/stores/auth";

export default route(function () {
  const createHistory = process.env.SERVER ? createMemoryHistory : process.env.VUE_ROUTER_MODE === "history" ? createWebHistory : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({left: 0, top: 0}),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Add navigation guard for authentication
  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Only trigger the initialAuthState if the route requires authentication
    if (to.meta.requiresAuth) {
      await authStore.initialAuthState();
    }

    // Use the cached state to determine if the user is authenticated
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({name: "login"});
    } else if (to.meta.guestOnly && authStore.isAuthenticated) {
      next("/");
    } else {
      next();
    }
  });

  return Router;
});
