import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'stores/auth';
import type { App } from 'vue';

/**
 * Use it to access to auth store information across the project via $auth
 */
export default boot(({ app }: { app: App }) => {
  app.config.globalProperties.$auth = useAuthStore();
});
