import { boot } from 'quasar/wrappers';
import { plugin, defaultConfig } from '@formkit/vue';
import '@formkit/themes/genesis';
import { formkitConfig } from 'app/formkit.config';

export default boot(({ app }) => {
  app.use(plugin, defaultConfig(formkitConfig));
});
