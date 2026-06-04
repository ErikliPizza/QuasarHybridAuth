import type { AuthStore } from './stores/auth';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $auth: AuthStore;
  }
}
