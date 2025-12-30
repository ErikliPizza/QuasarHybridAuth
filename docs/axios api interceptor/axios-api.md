# Axios API Configuration Documentation

## Overview

The `axios.ts` boot file (`src/boot/axios.ts`) configures HTTP clients for the application. It provides two Axios instances optimized for different use cases, automatic error handling, and notification integration.

## Table of Contents

- [Architecture](#architecture)
- [API Instances](#api-instances)
- [Type Definitions](#type-definitions)
- [Interceptors](#interceptors)
- [Error Handling](#error-handling)
- [CSRF Protection](#csrf-protection)
- [Usage Examples](#usage-examples)
- [Configuration](#configuration)

---

## Architecture

### Request Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HTTP REQUEST FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

    Component                    Axios Instance               Server
        │                              │                         │
        │  api.get('/users')           │                         │
        ├─────────────────────────────►│                         │
        │                              │                         │
        │              ┌───────────────┴───────────────┐         │
        │              │   REQUEST INTERCEPTOR         │         │
        │              │                               │         │
        │              │   • Attach Bearer token       │         │
        │              │     (mobile only)             │         │
        │              │   • Add XSRF token header     │         │
        │              └───────────────┬───────────────┘         │
        │                              │                         │
        │                              │  HTTP Request           │
        │                              ├────────────────────────►│
        │                              │                         │
        │                              │  HTTP Response          │
        │                              │◄────────────────────────┤
        │                              │                         │
        │              ┌───────────────┴───────────────┐         │
        │              │   RESPONSE INTERCEPTOR        │         │
        │              │                               │         │
        │              │   • Show success notification │         │
        │              │   • Handle 401 → redirect     │         │
        │              │   • Show error notification   │         │
        │              └───────────────┬───────────────┘         │
        │                              │                         │
        │  Response / Error            │                         │
        │◄─────────────────────────────┤                         │
        │                              │                         │
```

### Platform Detection

The module automatically detects the platform and configures appropriate settings:

| Platform                   | Base URL Source            | Auth Method            |
| -------------------------- | -------------------------- | ---------------------- |
| Web (SPA)                  | `VITE_API_BASE_URL`        | Session cookies + CSRF |
| Mobile (Capacitor/Cordova) | `VITE_API_BASE_URL_MOBILE` | Bearer token           |

---

## API Instances

### `api` - Main API Instance

The primary instance for making authenticated API requests.

```typescript
import { api } from 'boot/axios';

// GET request
const users = await api.get('/users');

// POST request
const newUser = await api.post('/users', { name: 'John' });

// PUT request
await api.put('/users/1', { name: 'Jane' });

// DELETE request
await api.delete('/users/1');
```

**Features:**

- Base URL includes API prefix (e.g., `/api/v1`)
- Automatic Bearer token attachment (mobile)
- CSRF token handling (web)
- Response/Error interceptors

### `sessionApi` - Session API Instance

Used for authentication-related endpoints and CSRF initialization.

```typescript
import { sessionApi, initializeCsrfToken } from 'boot/axios';

// Initialize CSRF token before login
await initializeCsrfToken();

// Make session-based auth request
await sessionApi.post('/auth/login', credentials);
```

**Features:**

- Base URL without API prefix (for Sanctum endpoints)
- Session cookie handling
- CSRF token initialization

---

## Type Definitions

### ApiNotification

Notification payload included in API responses:

```typescript
interface ApiNotification {
  enabled: boolean;
  type?: 'positive' | 'negative' | 'warning' | 'info';
  message?: string;
}
```

### ApiResponse

Standard API response wrapper:

```typescript
interface ApiResponse<T = unknown> {
  data?: T;
  notify?: ApiNotification;
}
```

### ApiErrorResponse

Error response structure:

```typescript
interface ApiErrorResponse {
  notify?: ApiNotification;
  message?: string;
  errors?: Record<string, string[]>; // Validation errors
}
```

### UnauthorizedResponse

Returned when handling 401 errors:

```typescript
interface UnauthorizedResponse {
  status: 401;
  message: 'Unauthorized';
}
```

---

## Interceptors

### Request Interceptor

Applied to the `api` instance only:

```
┌─────────────────────────────────────────────────────────────┐
│                   REQUEST INTERCEPTOR                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   1. Check localStorage for 'auth_token'                    │
│                                                              │
│   2. If token exists:                                        │
│      └─► Add header: Authorization: Bearer <token>           │
│                                                              │
│   3. Return modified config                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Response Interceptor

Applied to both `api` and `sessionApi`:

```
┌─────────────────────────────────────────────────────────────┐
│                  RESPONSE INTERCEPTOR                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   SUCCESS (2xx):                                             │
│   └─► Check for notify.enabled in response                   │
│       └─► Show Quasar notification if enabled                │
│                                                              │
│   ERROR (4xx/5xx):                                           │
│   ├─► 401: Trigger unauthorized handler (debounced)         │
│   │   └─► Clear auth state                                   │
│   │   └─► Redirect to /login                                 │
│   │   └─► Return resolved promise (prevent error cascade)    │
│   │                                                          │
│   └─► Other: Show error notification                         │
│       └─► Use notify.message if provided                     │
│       └─► Fall back to generic error message                 │
│                                                              │
│   NETWORK ERROR:                                             │
│   └─► Show network error notification                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Error Handling

### Error Response Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ERROR HANDLING FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │ API Error   │
                              └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
             ┌──────────┐     ┌──────────┐     ┌──────────┐
             │   401    │     │  Other   │     │ Network  │
             │  Unauth  │     │  4xx/5xx │     │  Error   │
             └────┬─────┘     └────┬─────┘     └────┬─────┘
                  │                │                │
                  ▼                ▼                ▼
        ┌─────────────────┐ ┌─────────────┐ ┌─────────────┐
        │ handleUnauth    │ │ handleApi   │ │ handleNet   │
        │ orizedAccess()  │ │ Error()     │ │ workError() │
        │ (debounced)     │ │             │ │             │
        └────────┬────────┘ └──────┬──────┘ └──────┬──────┘
                 │                 │               │
                 ▼                 │               │
        ┌─────────────────┐        │               │
        │ clearAuthState()│        │               │
        │ redirect /login │        │               │
        └────────┬────────┘        │               │
                 │                 │               │
                 ▼                 ▼               ▼
        ┌─────────────────────────────────────────────────┐
        │              Show Notification                   │
        │         (Quasar Notify plugin)                  │
        └─────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────────────┐
        │   401: Promise.resolve({ status: 401, ... })    │
        │   Other: Promise.reject(error)                  │
        └─────────────────────────────────────────────────┘
```

### Error Messages

Default error messages are centralized:

```typescript
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access detected. Please log in again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  GENERIC_ERROR: 'An error occurred. Please try again.',
  DEFAULT_SUCCESS: 'Operation successful!',
};
```

### Server-Driven Notifications

The API can control notifications via response payload:

```json
// Success response with notification
{
  "data": { "id": 1, "name": "John" },
  "notify": {
    "enabled": true,
    "type": "positive",
    "message": "User created successfully!"
  }
}

// Error response with custom message
{
  "notify": {
    "enabled": true,
    "type": "negative",
    "message": "Email already exists."
  }
}
```

---

## CSRF Protection

### Laravel Sanctum Integration

For web applications, CSRF protection is required:

```typescript
import { initializeCsrfToken, sessionApi } from 'boot/axios';

// Before making authenticated requests (e.g., login)
await initializeCsrfToken(); // GET /sanctum/csrf-cookie

// Then make the request
await sessionApi.post('/auth/login', credentials);
```

### When to Initialize CSRF

| Scenario              | Initialize CSRF?        |
| --------------------- | ----------------------- |
| Before login          | ✅ Yes                  |
| Before register       | ✅ Yes                  |
| Before password reset | ❌ No (public endpoint) |
| Regular API calls     | ❌ No (cookie persists) |

---

## Usage Examples

### Basic GET Request

```typescript
import { api } from 'boot/axios';

async function fetchUsers() {
  const response = await api.get<{ users: User[] }>('/users');
  return response.data.users;
}
```

### POST with Error Handling

```typescript
import { api } from 'boot/axios';

async function createUser(userData: CreateUserDto) {
  try {
    const response = await api.post<{ user: User }>('/users', userData);
    return response.data.user;
  } catch (error) {
    // Error notification already shown by interceptor
    // Handle specific logic if needed
    throw error;
  }
}
```

### Using in Vue Components (Options API)

```vue
<script>
export default {
  methods: {
    async fetchData() {
      // Using global property
      const response = await this.$api.get('/data');
      this.data = response.data;
    },
  },
};
</script>
```

### Using in Composition API

```vue
<script setup>
import { api } from 'boot/axios';
import { ref, onMounted } from 'vue';

const data = ref(null);

onMounted(async () => {
  const response = await api.get('/data');
  data.value = response.data;
});
</script>
```

### Custom Notification Control

```typescript
// Server response that triggers notification
// POST /users returns:
{
  "user": { "id": 1, "name": "John" },
  "notify": {
    "enabled": true,
    "type": "positive",
    "message": "User John was created!"
  }
}

// The interceptor automatically shows the notification
const response = await api.post('/users', { name: 'John' });
// Notification appears: "User John was created!"
```

---

## Configuration

### Environment Variables

Required environment variables in `.env`:

```env
# Web application API URL
VITE_API_BASE_URL=http://localhost:8000

# Mobile application API URL (if different)
VITE_API_BASE_URL_MOBILE=https://api.example.com

# API prefix (e.g., 'api/v1')
VITE_API_BASE_PREFIX=api/v1
```

### Configuration Constants

```typescript
// Storage key (must match auth store)
const AUTH_TOKEN_KEY = 'auth_token';

// Debounce delay for 401 handler
const UNAUTHORIZED_DEBOUNCE_MS = 1000;

// API configuration object
const API_CONFIG = {
  apiBaseUrl: '...', // Main API with prefix
  sessionBaseUrl: '...', // Session API without prefix
};
```

---

## Exports

| Export                | Type                  | Description                         |
| --------------------- | --------------------- | ----------------------------------- |
| `api`                 | `AxiosInstance`       | Main API instance with interceptors |
| `sessionApi`          | `AxiosInstance`       | Session API for auth endpoints      |
| `initializeCsrfToken` | `() => Promise<void>` | CSRF token initializer              |
| `isMobileApp`         | `boolean`             | Platform detection flag             |
| `API_CONFIG`          | `object`              | API URL configuration               |
| `ERROR_MESSAGES`      | `object`              | Default error messages              |
| `showNotification`    | `function`            | Utility to show notifications       |
| `ApiNotification`     | `interface`           | Notification type                   |
| `ApiResponse`         | `interface`           | Response wrapper type               |
| `ApiErrorResponse`    | `interface`           | Error response type                 |

---

## Best Practices

1. **Use `api` for regular requests** - It has all interceptors configured
2. **Use `sessionApi` only for auth** - Specifically for CSRF and session endpoints
3. **Let interceptors handle errors** - Don't duplicate notification logic
4. **Server-driven notifications** - Let the API control user-facing messages
5. **Type your responses** - Use generics for better type safety:

```typescript
interface UserResponse {
  user: User;
}

const response = await api.get<UserResponse>('/users/1');
const user = response.data.user; // Properly typed
```
