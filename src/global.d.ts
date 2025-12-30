import type { AuthState } from './stores/auth';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $auth: AuthState;
  }
}
