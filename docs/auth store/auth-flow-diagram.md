# Authentication Flow Diagrams

## Visual Flow Schema

### 1. Main Login Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AUTHENTICATION FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────┐
                                    │  START  │
                                    └────┬────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │   User enters       │
                              │   email & password  │
                              └──────────┬──────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │   authStore.login() │
                              └──────────┬──────────┘
                                         │
                          ┌──────────────┴──────────────┐
                          │    Detect Platform          │
                          │    (isMobileApp check)      │
                          └──────────────┬──────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                         │
                    ▼                                         ▼
        ┌───────────────────┐                     ┌───────────────────┐
        │   MOBILE/NATIVE   │                     │       WEB SPA     │
        │  (Capacitor/      │                     │   (Browser)       │
        │   Cordova/        │                     │                   │
        │   Electron)       │                     │                   │
        └─────────┬─────────┘                     └─────────┬─────────┘
                  │                                         │
                  ▼                                         ▼
        ┌───────────────────┐                     ┌───────────────────┐
        │ authenticateWith  │                     │ initializeCsrf    │
        │ Token()           │                     │ Token()           │
        │                   │                     │                   │
        │ POST /auth/login  │                     │ GET /sanctum/     │
        │ (Bearer token)    │                     │ csrf-cookie       │
        └─────────┬─────────┘                     └─────────┬─────────┘
                  │                                         │
                  │                                         ▼
                  │                               ┌───────────────────┐
                  │                               │ authenticateWith  │
                  │                               │ Session()         │
                  │                               │                   │
                  │                               │ POST /auth/login  │
                  │                               │ (Session cookie)  │
                  │                               └─────────┬─────────┘
                  │                                         │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                            ┌─────────────────────┐
                            │   API Response      │
                            └──────────┬──────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
          ┌─────────────┐    ┌─────────────────┐    ┌─────────────┐
          │   SUCCESS   │    │  2FA REQUIRED   │    │   ERROR     │
          │             │    │                 │    │             │
          │ token       │    │ two_factor_     │    │ 401/422/    │
          │ returned    │    │ required: true  │    │ 500 etc.    │
          └──────┬──────┘    └────────┬────────┘    └──────┬──────┘
                 │                    │                    │
                 ▼                    ▼                    ▼
    ┌─────────────────────┐  ┌─────────────────┐   ┌─────────────────┐
    │ persistToken()      │  │ Set pending     │   │ Throw error     │
    │ (mobile only)       │  │ TwoFactor=true  │   │ (interceptor    │
    │                     │  │                 │   │  shows notify)  │
    │ fetchCurrentUser()  │  │ Store pending   │   │                 │
    │                     │  │ Credentials     │   │                 │
    │ setUser()           │  │                 │   │                 │
    └──────────┬──────────┘  └────────┬────────┘   └─────────────────┘
               │                      │
               ▼                      ▼
    ┌─────────────────────┐  ┌─────────────────────┐
    │   AUTHENTICATED     │  │   SHOW 2FA INPUT    │
    │                     │  │                     │
    │ Return:             │  │ Return:             │
    │ { success: true,    │  │ { success: false,   │
    │   user: User }      │  │   requiresTwoFactor │
    │                     │  │   : true }          │
    └─────────────────────┘  └──────────┬──────────┘
                                        │
                                        ▼
                             ┌─────────────────────┐
                             │  User enters 2FA    │
                             │  code               │
                             └──────────┬──────────┘
                                        │
                                        ▼
                             ┌─────────────────────┐
                             │ completeTwoFactor   │
                             │ Auth(code)          │
                             └──────────┬──────────┘
                                        │
                  ┌─────────────────────┴─────────────────────┐
                  │                                           │
                  ▼                                           ▼
        ┌───────────────────┐                     ┌───────────────────┐
        │   MOBILE          │                     │       WEB         │
        │                   │                     │                   │
        │ POST /auth/       │                     │ initializeCsrf()  │
        │ verify-two-factor │                     │                   │
        └─────────┬─────────┘                     │ POST /auth/       │
                  │                               │ verify-two-factor │
                  │                               │ -spa              │
                  │                               └─────────┬─────────┘
                  │                                         │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                            ┌─────────────────────┐
                            │ fetchCurrentUser()  │
                            │ setUser()           │
                            │ clearPending2FA()   │
                            └──────────┬──────────┘
                                       │
                                       ▼
                            ┌─────────────────────┐
                            │   AUTHENTICATED     │
                            └─────────────────────┘
```

---

### 2. Logout Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                               LOGOUT FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────────┐
                              │   authStore.logout()│
                              └──────────┬──────────┘
                                         │
                          ┌──────────────┴──────────────┐
                          │                             │
                          ▼                             ▼
              ┌───────────────────┐         ┌───────────────────┐
              │   MOBILE          │         │       WEB         │
              │                   │         │                   │
              │ POST /auth/logout │         │ POST /auth/logout │
              │ via api instance  │         │ via sessionApi    │
              └─────────┬─────────┘         └─────────┬─────────┘
                        │                             │
                        └──────────────┬──────────────┘
                                       │
                          ┌────────────┴────────────┐
                          │   (try/catch)           │
                          │   Error? Log warning    │
                          │   but continue anyway   │
                          └────────────┬────────────┘
                                       │
                                       ▼ (finally block)
                          ┌─────────────────────────┐
                          │   clearAuthState()      │
                          │                         │
                          │   • user = null         │
                          │   • isAuthenticated =   │
                          │     false               │
                          │   • token = null        │
                          │   • clear pending 2FA   │
                          │   • localStorage.remove │
                          │     (TOKEN, USER)       │
                          │   • Delete Auth header  │
                          └────────────┬────────────┘
                                       │
                                       ▼
                          ┌─────────────────────────┐
                          │   LOGGED OUT            │
                          └─────────────────────────┘
```

---

### 3. Password Reset Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PASSWORD RESET FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌─────────────────────────────┐
     │  USER FORGOT PASSWORD       │
     └──────────────┬──────────────┘
                    │
                    ▼
     ┌─────────────────────────────┐
     │  Enter email address        │
     └──────────────┬──────────────┘
                    │
                    ▼
     ┌─────────────────────────────┐
     │  requestPasswordReset()     │
     │                             │
     │  POST /auth/password/reset/ │
     │  request                    │
     │  { email }                  │
     └──────────────┬──────────────┘
                    │
                    ▼
     ┌─────────────────────────────┐
     │  Email sent with            │
     │  verification code          │
     └──────────────┬──────────────┘
                    │
                    ▼
     ┌─────────────────────────────┐
     │  User enters:               │
     │  • Verification code        │
     │  • New password             │
     │  • Password confirmation    │
     └──────────────┬──────────────┘
                    │
                    ▼
     ┌─────────────────────────────┐
     │  completePasswordReset()    │
     │                             │
     │  POST /auth/password/reset/ │
     │  apply                      │
     │  {                          │
     │    email,                   │
     │    verification_code,       │
     │    password,                │
     │    password_confirmation    │
     │  }                          │
     └──────────────┬──────────────┘
                    │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
    ┌─────────┐        ┌─────────┐
    │ SUCCESS │        │  ERROR  │
    └────┬────┘        └────┬────┘
         │                  │
         ▼                  ▼
    ┌─────────────┐   ┌─────────────┐
    │ Redirect to │   │ Show error  │
    │ login page  │   │ message     │
    └─────────────┘   └─────────────┘
```

---

### 4. Session Validation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SESSION VALIDATION FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌─────────────────────────────┐
     │   validateSession()         │
     │   (called by route guard    │
     │    or on app init)          │
     └──────────────┬──────────────┘
                    │
                    ▼
     ┌─────────────────────────────┐
     │   Check throttle            │
     │                             │
     │   now - lastSessionCheck    │
     │   > sessionCheckInterval?   │
     │   (default: 60 seconds)     │
     └──────────────┬──────────────┘
                    │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
    ┌─────────┐        ┌─────────────┐
    │   NO    │        │     YES     │
    │ (Skip)  │        │ (Check API) │
    └────┬────┘        └──────┬──────┘
         │                    │
         │                    ▼
         │      ┌─────────────────────────┐
         │      │   fetchCurrentUser()    │
         │      │                         │
         │      │   GET /auth/me          │
         │      └──────────────┬──────────┘
         │                     │
         │          ┌──────────┴──────────┐
         │          │                     │
         │          ▼                     ▼
         │     ┌─────────┐          ┌─────────┐
         │     │ SUCCESS │          │  ERROR  │
         │     │ 200 OK  │          │  (401)  │
         │     └────┬────┘          └────┬────┘
         │          │                    │
         │          ▼                    ▼
         │   ┌─────────────┐      ┌─────────────┐
         │   │ setUser()   │      │ clearAuth   │
         │   │ Update      │      │ State()     │
         │   │ timestamp   │      │             │
         │   │             │      │ Redirect to │
         │   │ Return true │      │ login       │
         │   └──────┬──────┘      └──────┬──────┘
         │          │                    │
         └────┬─────┘                    │
              │                          │
              ▼                          ▼
     ┌─────────────────┐        ┌─────────────────┐
     │ isAuthenticated │        │ isAuthenticated │
     │ = true          │        │ = false         │
     └─────────────────┘        └─────────────────┘
```

---

### 5. State Machine Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AUTH STATE MACHINE                                 │
└─────────────────────────────────────────────────────────────────────────────┘

                           ┌─────────────────┐
                           │                 │
         ┌─────────────────│   GUEST         │◄──────────────────┐
         │                 │   (Logged Out)  │                   │
         │                 │                 │                   │
         │                 └────────┬────────┘                   │
         │                          │                            │
         │                    login()                            │
         │                          │                            │
         │                          ▼                            │
         │                 ┌─────────────────┐                   │
         │    ┌────────────│                 │────────────┐      │
         │    │            │   LOGGING_IN    │            │      │
         │    │            │                 │            │      │
         │    │            └─────────────────┘            │      │
         │    │                                           │      │
         │  error                                   two_factor   │
         │    │                                    _required     │
         │    │                                           │      │
         │    ▼                                           ▼      │
         │    │            ┌─────────────────┐                   │
         │    │            │                 │                   │
         │    └───────────►│   PENDING_2FA   │                   │
         │                 │                 │                   │
         │                 └────────┬────────┘                   │
         │                          │                            │
         │            completeTwoFactorAuth()                    │
         │                    or cancel()                        │
         │                          │                            │
         │       ┌──────────────────┼──────────────────┐         │
         │       │                  │                  │         │
         │       ▼                  │                  ▼         │
         │   success                │               cancel       │
         │       │                  │                  │         │
         │       │                  │                  │         │
         │       ▼                  │                  └─────────┤
         │                          │                            │
         │                          ▼                            │
         │                 ┌─────────────────┐                   │
         │                 │                 │                   │
         └────────────────►│  AUTHENTICATED  │───────────────────┘
                           │                 │     logout()
                           └─────────────────┘

```

---

## State Transitions Table

| Current State | Action                    | Next State    | Side Effects                    |
| ------------- | ------------------------- | ------------- | ------------------------------- |
| GUEST         | `login()`                 | LOGGING_IN    | API call initiated              |
| LOGGING_IN    | Success                   | AUTHENTICATED | User data fetched, token stored |
| LOGGING_IN    | 2FA Required              | PENDING_2FA   | Credentials stored              |
| LOGGING_IN    | Error                     | GUEST         | Error notification shown        |
| PENDING_2FA   | `completeTwoFactorAuth()` | AUTHENTICATED | User data fetched               |
| PENDING_2FA   | `cancelTwoFactorAuth()`   | GUEST         | Pending state cleared           |
| PENDING_2FA   | Error                     | PENDING_2FA   | Allow retry                     |
| AUTHENTICATED | `logout()`                | GUEST         | All state cleared               |
| AUTHENTICATED | 401 Response              | GUEST         | Auto-logout triggered           |
| ANY           | `clearAuthState()`        | GUEST         | Force reset                     |

---

## API Endpoints Reference

| Endpoint                       | Method | Description         | Used By                   |
| ------------------------------ | ------ | ------------------- | ------------------------- |
| `/auth/login`                  | POST   | Primary login       | `login()`                 |
| `/auth/logout`                 | POST   | Logout              | `logout()`                |
| `/auth/me`                     | GET    | Get current user    | `fetchCurrentUser()`      |
| `/auth/verify-two-factor`      | POST   | Verify 2FA (mobile) | `completeTwoFactorAuth()` |
| `/auth/verify-two-factor-spa`  | POST   | Verify 2FA (web)    | `completeTwoFactorAuth()` |
| `/auth/password/reset/request` | POST   | Request reset       | `requestPasswordReset()`  |
| `/auth/password/reset/apply`   | POST   | Complete reset      | `completePasswordReset()` |
| `/sanctum/csrf-cookie`         | GET    | Initialize CSRF     | `initializeCsrfToken()`   |
