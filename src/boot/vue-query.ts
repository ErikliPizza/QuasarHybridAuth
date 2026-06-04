import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { boot } from 'quasar/wrappers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default boot(({ app }) => {
  app.use(VueQueryPlugin, {
    queryClient,
  });
});
