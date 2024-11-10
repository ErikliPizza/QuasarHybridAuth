import {boot} from "quasar/wrappers";
import {useAuthStore} from "stores/auth";

/**
 * Use it to access to auth store information across the project via $auth
 */
export default boot(async ({app}) => {
  app.config.globalProperties.$auth = useAuthStore().$state;
});
