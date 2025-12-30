# Authentication Store Documentation

## Overview

The `auth` store (`src/stores/auth.ts`) manages all authentication-related state and operations in the application. It provides a unified interface for both web (session-based) and mobile (token-based) authentication flows.

## Table of Contents

- [Architecture](#architecture)
- [Type Definitions](#type-definitions)
- [State Management](#state-management)
- [Available Actions](#available-actions)
- [Getters](#getters)
- [Usage Examples](#usage-examples)
- [Security Considerations](#security-considerations)
- [Migration Guide](#migration-guide)

---

## Architecture

### Platform Detection

The store automatically detects the platform at initialization:

| Platform          | Auth Method             | Token Storage     |
| ----------------- | ----------------------- | ----------------- |
| Web (SPA)         | Session-based with CSRF | HTTP-only cookies |
| Capacitor/Cordova | Bearer token            | localStorage      |
| Electron          | Bearer token            | localStorage      |

### API Instances

- **`api`**: Main API instance with auth interceptors (Bearer token for mobile)
- **`sessionApi`**: Session-based API for CSRF-protected endpoints

---

## Type Definitions

### User

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  gravatar: string;
  tfa: boolean; // Two-factor auth enabled
}
```

### LoginCredentials

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}
```

### TwoFactorCredentials

```typescript
interface TwoFactorCredentials extends LoginCredentials {
  two_factor_code: string;
}
```

### PasswordResetPayload

```typescript
interface PasswordResetPayload {
  email: string;
  verification_code: string;
  password: string;
  password_confirmation: string;
}
```

### LoginResult

```typescript
interface LoginResult {
  success: boolean;
  requiresTwoFactor: boolean;
  user?: User;
}
```

---

## State Management

### State Properties

| Property               | Type                       | Description                      |
| ---------------------- | -------------------------- | -------------------------------- |
| `isMobileApp`          | `boolean`                  | Platform detection flag          |
| `user`                 | `User \| null`             | Current authenticated user       |
| `isAuthenticated`      | `boolean`                  | Authentication status            |
| `token`                | `string \| null`           | Bearer token (mobile only)       |
| `sessionCheckInterval` | `number`                   | Session validation interval (ms) |
| `lastSessionCheck`     | `number \| null`           | Last validation timestamp        |
| `pendingTwoFactor`     | `boolean`                  | 2FA verification pending         |
| `pendingCredentials`   | `LoginCredentials \| null` | Stored credentials for 2FA       |

### Storage Keys

All localStorage operations use centralized keys:

```typescript
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
};
```

---

## Available Actions

### Authentication Flow

#### `login(credentials: LoginCredentials): Promise<LoginResult>`

Primary login method that routes to appropriate auth strategy.

**Returns:**

- `{ success: true, requiresTwoFactor: false, user }` - Login complete
- `{ success: false, requiresTwoFactor: true }` - 2FA required

```typescript
const result = await authStore.login({
  email: 'user@example.com',
  password: 'password123',
});

if (result.requiresTwoFactor) {
  // Show 2FA input
} else if (result.success) {
  // Redirect to dashboard
}
```

#### `completeTwoFactorAuth(code: string): Promise<void>`

Completes the 2FA verification step.

```typescript
await authStore.completeTwoFactorAuth('123456');
```

#### `cancelTwoFactorAuth(): void`

Cancels pending 2FA and clears stored credentials.

```typescript
authStore.cancelTwoFactorAuth();
```

#### `logout(): Promise<void>`

Logs out the user and clears all auth state.

```typescript
await authStore.logout();
```

#### `validateSession(): Promise<boolean>`

Validates the current session (throttled to prevent excessive API calls).

```typescript
const isValid = await authStore.validateSession();
```

### Password Reset Flow

#### `requestPasswordReset(email: string): Promise<void>`

Sends a password reset email.

```typescript
await authStore.requestPasswordReset('user@example.com');
```

#### `completePasswordReset(payload: PasswordResetPayload): Promise<void>`

Completes password reset with verification code.

```typescript
await authStore.completePasswordReset({
  email: 'user@example.com',
  verification_code: 'ABC123',
  password: 'newPassword123',
  password_confirmation: 'newPassword123',
});
```

### User Management

#### `fetchCurrentUser(): Promise<User | null>`

Fetches and updates the current user's data.

```typescript
const user = await authStore.fetchCurrentUser();
```

#### `clearAuthState(): void`

Clears all authentication state (useful for forced logout).

```typescript
authStore.clearAuthState();
```

---

## Getters

| Getter                | Return Type     | Description                       |
| --------------------- | --------------- | --------------------------------- |
| `displayName`         | `string`        | User's name, email, or "Guest"    |
| `hasTwoFactorEnabled` | `boolean`       | Whether 2FA is enabled            |
| `apiInstance`         | `AxiosInstance` | Platform-appropriate API instance |

```typescript
// Usage
const name = authStore.displayName;
const has2FA = authStore.hasTwoFactorEnabled;
```

---

## Usage Examples

### Basic Login Flow

```typescript
import { useAuthStore } from 'stores/auth';

const authStore = useAuthStore();

async function handleLogin(email: string, password: string) {
  try {
    const result = await authStore.login({ email, password });

    if (result.requiresTwoFactor) {
      // Show 2FA modal
      return;
    }

    // Login successful
    router.push('/dashboard');
  } catch (error) {
    // Handle error (shown via notification system)
  }
}
```

### With Two-Factor Authentication

```typescript
async function handleTwoFactorSubmit(code: string) {
  try {
    await authStore.completeTwoFactorAuth(code);
    router.push('/dashboard');
  } catch (error) {
    // Invalid code - allow retry
  }
}
```

### Route Guard Integration

```typescript
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    const isValid = await authStore.validateSession();

    if (!isValid) {
      return next('/login');
    }
  }

  next();
});
```

### Reactive User Display

```vue
<template>
  <div v-if="authStore.isAuthenticated">
    <span>Welcome, {{ authStore.displayName }}</span>
    <button @click="authStore.logout()">Logout</button>
  </div>
</template>

<script setup>
import { useAuthStore } from 'stores/auth';
const authStore = useAuthStore();
</script>
```

---

## Security Considerations

### Token Storage

- **Web (SPA)**: Uses HTTP-only session cookies managed by the server
- **Mobile**: Stores Bearer token in localStorage with automatic header injection

### CSRF Protection

- Web apps initialize CSRF token before sensitive operations
- Mobile apps bypass CSRF (token-based auth doesn't require it)

### Session Validation

- Throttled to prevent excessive API calls (default: 60 seconds)
- Automatically clears auth state on validation failure

### Data Validation

- User data from localStorage is validated before use
- Corrupted data is automatically cleaned up

---

## Migration Guide

### From Previous Version

| Old Method           | New Method                | Notes              |
| -------------------- | ------------------------- | ------------------ |
| `MobileLogin()`      | `login()`                 | Automatic routing  |
| `SessionLogin()`     | `login()`                 | Automatic routing  |
| `verifyTwoFactor()`  | `completeTwoFactorAuth()` | Clearer naming     |
| `initialAuthState()` | `validateSession()`       | Better description |
| `resetPassword()`    | `completePasswordReset()` | Clearer naming     |
| `getUser()`          | `fetchCurrentUser()`      | Better description |
| `clearAuth()`        | `clearAuthState()`        | Clearer naming     |

### State Property Changes

| Old Property        | New Property           |
| ------------------- | ---------------------- |
| `mobile`            | `isMobileApp`          |
| `twoFactorRequired` | `pendingTwoFactor`     |
| `authCheckInterval` | `sessionCheckInterval` |
| `lastAuthCheck`     | `lastSessionCheck`     |

---

## Error Handling

All async actions may throw errors. The axios interceptor handles:

- **401 Unauthorized**: Automatic logout and redirect
- **Network errors**: Notification displayed
- **API errors**: Notification with server message

Custom error handling:

```typescript
try {
  await authStore.login(credentials);
} catch (error) {
  // Error already handled by interceptor
  // Add custom logic if needed
  console.error('Login failed:', error);
}
```
