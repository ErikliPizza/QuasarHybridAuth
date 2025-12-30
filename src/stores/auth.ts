import { defineStore } from 'pinia';
import { api, initializeCsrfToken } from 'boot/axios';
import { Platform } from 'quasar';
import type { AxiosResponse } from 'axios';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * User entity returned from the API
 */
export interface User {
  id: number;
  name: string;
  email: string;
  gravatar: string;
  tfa: boolean;
  roles: string[];
  permissions: string[];
}

/**
 * Login credentials payload
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Two-factor authentication payload
 */
export interface TwoFactorCredentials extends LoginCredentials {
  two_factor_code: string;
}

/**
 * Password reset request payload
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset completion payload
 */
export interface PasswordResetPayload {
  email: string;
  verification_code: string;
  password: string;
  password_confirmation: string;
}

/**
 * Authentication response from the API
 */
export interface AuthResponse {
  token?: string;
  two_factor_required?: boolean;
  user?: User;
}

/**
 * Result of a login attempt
 */
export interface LoginResult {
  success: boolean;
  requiresTwoFactor: boolean;
  user?: User | undefined;
}

/**
 * Internal auth store state
 */
interface AuthState {
  /** Whether the app is running on a mobile platform (Capacitor/Cordova/Electron) */
  isMobileApp: boolean;
  /** Current authenticated user */
  user: User | null;
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** Bearer token for mobile authentication */
  token: string | null;
  /** Interval for periodic auth validation (ms) */
  sessionCheckInterval: number;
  /** Timestamp of last auth check */
  lastSessionCheck: number | null;
  /** Whether 2FA is required to complete login */
  pendingTwoFactor: boolean;
  /** Stored credentials for 2FA flow continuation */
  pendingCredentials: LoginCredentials | null;
}

// ============================================================================
// STORAGE KEYS (centralized for consistency)
// ============================================================================

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * 🔄 USER SYNC POINT #1: Initial Load from localStorage
 * Safely retrieves and parses user data from localStorage
 * Returns null if data is missing, corrupted, or invalid
 * Called during store initialization to restore user from previous session
 */
function getSavedUser(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as unknown;

    // Validate the parsed object has required User properties
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'id' in parsed &&
      'email' in parsed &&
      'name' in parsed
    ) {
      return parsed as User;
    }

    // Invalid structure - clean up corrupted data
    localStorage.removeItem(STORAGE_KEYS.USER);
    return null;
  } catch {
    // JSON parse failed - clean up corrupted data
    localStorage.removeItem(STORAGE_KEYS.USER);
    return null;
  }
}

/**
 * Safely retrieves the auth token from localStorage
 */
function getSavedToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

/**
 * Detects if the app is running on a mobile platform
 */
function detectMobilePlatform(): boolean {
  return !!(Platform.is.capacitor || Platform.is.cordova || Platform.is.electron);
}

// ============================================================================
// AUTH STORE DEFINITION
// ============================================================================

export const useAuthStore = defineStore('auth', {
  // --------------------------------------------------------------------------
  // STATE
  // --------------------------------------------------------------------------
  state: (): AuthState => {
    // 🔄 USER SYNC POINT #2: Store Initialization
    // Loads user from localStorage on app startup
    const savedUser = getSavedUser();

    return {
      isMobileApp: detectMobilePlatform(),
      user: savedUser, // ← User loaded from localStorage here
      isAuthenticated: savedUser !== null,
      token: getSavedToken(),
      sessionCheckInterval: 60 * 1000, // 60 seconds
      lastSessionCheck: null,
      pendingTwoFactor: false,
      pendingCredentials: null,
    };
  },

  // --------------------------------------------------------------------------
  // GETTERS
  // --------------------------------------------------------------------------
  getters: {
    /**
     * Returns the current user's display name or email
     */
    displayName: (state): string => {
      return state.user?.name || state.user?.email || 'Guest';
    },

    /**
     * Checks if 2FA is enabled for the current user
     */
    hasTwoFactorEnabled: (state): boolean => {
      return state.user?.tfa ?? false;
    },

    /**
     * Returns the API instance
     */
    apiInstance: () => {
      return api;
    },
  },

  // --------------------------------------------------------------------------
  // ACTIONS
  // --------------------------------------------------------------------------
  actions: {
    // ========================================================================
    // PUBLIC: Authentication Flow
    // ========================================================================

    /**
     * Attempts to log in with the provided credentials
     * Automatically routes to the appropriate auth method (mobile/session)
     *
     * @param credentials - User's email and password
     * @returns LoginResult indicating success or if 2FA is required
     */
    async login(credentials: LoginCredentials): Promise<LoginResult> {
      try {
        const response = this.isMobileApp
          ? await this.authenticateWithToken(credentials)
          : await this.authenticateWithSession(credentials);

        // Handle 2FA requirement
        if (response.two_factor_required) {
          this.pendingTwoFactor = true;
          this.pendingCredentials = credentials;
          return { success: false, requiresTwoFactor: true };
        }

        // 🔄 USER SYNC POINT #3: After Successful Login
        // Fetches fresh user data from API after authentication
        await this.fetchCurrentUser();

        return {
          success: true,
          requiresTwoFactor: false,
          user: this.user ?? undefined,
        };
      } catch (error) {
        this.clearPendingTwoFactor();
        throw error;
      }
    },

    /**
     * Completes 2FA verification and finishes the login process
     *
     * @param code - The 2FA code from the user's authenticator app
     */
    async completeTwoFactorAuth(code: string): Promise<void> {
      if (!this.pendingCredentials) {
        throw new Error('No pending 2FA verification. Please start the login process again.');
      }

      const payload: TwoFactorCredentials = {
        ...this.pendingCredentials,
        two_factor_code: code,
      };

      // Initialize CSRF for session-based auth
      if (!this.isMobileApp) {
        await initializeCsrfToken();
      }

      const endpoint = this.isMobileApp
        ? '/auth/verify-two-factor'
        : '/auth/verify-two-factor-session';

      const response: AxiosResponse<AuthResponse> = await api.post(endpoint, payload);

      // Store token for mobile auth
      if (this.isMobileApp && response.data.token) {
        this.persistToken(response.data.token);
      }

      // 🔄 USER SYNC POINT #4: After 2FA Completion
      // Fetches fresh user data from API after 2FA verification
      await this.fetchCurrentUser();
      this.clearPendingTwoFactor();
    },

    /**
     * Cancels the pending 2FA verification
     */
    cancelTwoFactorAuth(): void {
      this.clearPendingTwoFactor();
    },

    /**
     * Logs out the current user and clears all auth state
     */
    async logout(): Promise<void> {
      try {
        const logoutEndpoint = this.isMobileApp ? '/auth/logout' : '/auth/logout-session';
        await api.post(logoutEndpoint);
      } catch (error) {
        // Log but don't throw - we still want to clear local state
        console.warn('Logout request failed:', error);
      } finally {
        this.clearAuthState();
      }
    },

    /**
     * Validates the current session and refreshes user data if needed
     * Uses a throttled approach to prevent excessive API calls
     */
    async validateSession(): Promise<boolean> {
      const now = Date.now();
      const shouldCheck =
        !this.lastSessionCheck || now - this.lastSessionCheck > this.sessionCheckInterval;

      if (!shouldCheck) {
        return this.isAuthenticated;
      }

      try {
        // 🔄 USER SYNC POINT #5: Session Validation (Throttled)
        // Periodically syncs user data from API to ensure it's up-to-date
        // Only runs if enough time has passed since last check (throttled)
        await this.fetchCurrentUser();
        this.lastSessionCheck = now;
        return true;
      } catch {
        return false;
      }
    },

    // ========================================================================
    // PUBLIC: Password Reset Flow
    // ========================================================================

    /**
     * Requests a password reset email
     *
     * @param email - User's email address
     */
    requestPasswordReset(email: string): Promise<void> {
      return api.post('/auth/password/reset/request', { email }).then(() => undefined);
    },

    /**
     * Completes the password reset with verification code
     *
     * @param payload - Password reset data including verification code
     */
    completePasswordReset(payload: PasswordResetPayload): Promise<void> {
      return api.post('/auth/password/reset/apply', payload).then(() => undefined);
    },

    // ========================================================================
    // PUBLIC: User Management
    // ========================================================================

    /**
     * 🔄 USER SYNC POINT #6: API Fetch Method
     * Fetches the current user's data from the API endpoint: GET /auth/me
     * This is the PRIMARY method for retrieving user information from the server
     * Called by: login(), completeTwoFactorAuth(), validateSession()
     */
    async fetchCurrentUser(): Promise<User | null> {
      try {
        // API call to fetch user data
        const response = await api.get<{ user: User }>('/auth/me');

        if (response.status === 200 && response.data.user) {
          // Sync user data to store and localStorage
          this.setUser(response.data.user);
          return this.user;
        }

        return null;
      } catch (error) {
        this.clearAuthState();
        throw error;
      }
    },

    /**
     * Clears all authentication state (used for logout or auth failures)
     */
    clearAuthState(): void {
      this.user = null;
      this.isAuthenticated = false;
      this.token = null;
      this.clearPendingTwoFactor();

      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);

      delete api.defaults.headers.common['Authorization'];
    },

    // ========================================================================
    // PRIVATE: Internal Methods
    // ========================================================================

    /**
     * Authenticates using token-based auth (mobile platforms)
     */
    async authenticateWithToken(credentials: LoginCredentials): Promise<AuthResponse> {
      const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials);

      if (response.data.token) {
        this.persistToken(response.data.token);
      }

      return response.data;
    },

    /**
     * Authenticates using session-based auth (web platform)
     */
    async authenticateWithSession(credentials: LoginCredentials): Promise<AuthResponse> {
      await initializeCsrfToken();
      const response = await api.post<AuthResponse>('/auth/login-session', credentials);
      return response.data;
    },

    /**
     * 🔄 USER SYNC POINT #7: State Update & Persistence
     * Updates the user state in memory and persists to localStorage
     * This is called by fetchCurrentUser() to sync API data to local state
     *
     * Flow: API → fetchCurrentUser() → setUser() → state + localStorage
     */
    setUser(user: User | null): void {
      // Update in-memory state
      this.user = user;
      this.isAuthenticated = user !== null;

      // Persist to localStorage for next session
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    },

    /**
     * Persists the auth token to state and localStorage
     */
    persistToken(token: string): void {
      this.token = token;
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    },

    /**
     * Clears pending 2FA state
     */
    clearPendingTwoFactor(): void {
      this.pendingTwoFactor = false;
      this.pendingCredentials = null;
    },
  },
});

// ============================================================================
// TYPE EXPORTS FOR EXTERNAL USE
// ============================================================================

export type AuthStore = ReturnType<typeof useAuthStore>;
