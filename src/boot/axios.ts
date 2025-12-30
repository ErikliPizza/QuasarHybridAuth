import { boot } from 'quasar/wrappers';
import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from 'src/stores/auth';
import debounce from 'lodash/debounce';
import { Platform, Notify } from 'quasar';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Notification payload that can be included in API responses
 */
export interface ApiNotification {
  enabled: boolean;
  type?: 'positive' | 'negative' | 'warning' | 'info';
  message?: string;
}

/**
 * Standard API response wrapper with optional notification
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  notify?: ApiNotification;
}

/**
 * Error response structure from the API
 */
export interface ApiErrorResponse {
  notify?: ApiNotification;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Response returned when handling 401 unauthorized errors
 */
export interface UnauthorizedResponse {
  status: 401;
  message: 'Unauthorized';
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Platform detection - determines which API base URL to use
 */
const isMobileApp: boolean = !!(Platform.is.capacitor || Platform.is.cordova);

/**
 * Storage key for auth token (should match auth store)
 */
const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Debounce delay for unauthorized handler (ms)
 */
const UNAUTHORIZED_DEBOUNCE_MS = 1000;

/**
 * Default error messages
 */
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access detected. Please log in again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  GENERIC_ERROR: 'An error occurred. Please try again.',
  DEFAULT_SUCCESS: 'Operation successful!',
} as const;

/**
 * API base URLs based on environment
 */
const API_CONFIG = {
  /** Main API with versioned prefix (e.g., /api/v1) */
  apiBaseUrl: isMobileApp
    ? `${import.meta.env.VITE_API_BASE_URL_MOBILE}/${import.meta.env.VITE_API_BASE_PREFIX}`
    : `${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_API_BASE_PREFIX}`,
} as const;

// ============================================================================
// AXIOS INSTANCES
// ============================================================================

/**
 * Main API instance for authenticated requests
 * - Uses versioned API prefix
 * - Automatically attaches Bearer token for mobile apps
 * - Handles CSRF for web apps
 */
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.apiBaseUrl,
  withCredentials: true,
  withXSRFToken: true,
});

// ============================================================================
// REQUEST INTERCEPTORS
// ============================================================================

/**
 * Attaches Bearer token to requests for mobile authentication
 */
function attachAuthorizationHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
}

/**
 * Handles request errors
 */
function handleRequestError(error: AxiosError): Promise<never> {
  return Promise.reject(error);
}

// Apply request interceptor to main API instance
api.interceptors.request.use(attachAuthorizationHeader, handleRequestError);

// ============================================================================
// RESPONSE HANDLERS
// ============================================================================

/**
 * Displays a notification using Quasar's Notify plugin
 */
function showNotification(
  type: 'positive' | 'negative' | 'warning' | 'info',
  message: string,
): void {
  Notify.create({ type, message });
}

/**
 * Handles successful responses with optional notification display
 */
function handleSuccessResponse(response: AxiosResponse): AxiosResponse {
  const data = response.data as ApiResponse;

  // Display notification if enabled in response
  if (data?.notify?.enabled) {
    const type = data.notify.type ?? 'positive';
    const message = data.notify.message ?? ERROR_MESSAGES.DEFAULT_SUCCESS;
    showNotification(type, message);
  }

  return response;
}

/**
 * Debounced handler for 401 unauthorized responses
 * - Clears auth state
 * - Redirects to login page
 * - Debounced to prevent multiple redirects
 */
const handleUnauthorizedAccess = debounce((): void => {
  const authStore = useAuthStore();

  // Prevent redundant logout actions
  if (!authStore.isAuthenticated) {
    return;
  }

  console.warn('Unauthorized access detected, redirecting to login.');
  authStore.clearAuthState();
  window.location.replace('/login');
}, UNAUTHORIZED_DEBOUNCE_MS);

/**
 * Handles 401 Unauthorized responses
 */
function handleUnauthorizedError(): Promise<UnauthorizedResponse> {
  handleUnauthorizedAccess();
  showNotification('negative', ERROR_MESSAGES.UNAUTHORIZED);

  // Return resolved promise to prevent error propagation for 401
  return Promise.resolve({
    status: 401,
    message: 'Unauthorized',
  });
}

/**
 * Handles API errors with notification display
 */
function handleApiError(errorData: ApiErrorResponse | undefined): void {
  if (errorData?.notify?.enabled) {
    const type = errorData.notify.type ?? 'negative';
    const message = errorData.notify.message ?? ERROR_MESSAGES.GENERIC_ERROR;
    showNotification(type, message);
  } else {
    const message = errorData?.notify?.message ?? ERROR_MESSAGES.GENERIC_ERROR;
    showNotification('negative', message);
  }
}

/**
 * Handles network errors (no response received)
 */
function handleNetworkError(): void {
  showNotification('negative', ERROR_MESSAGES.NETWORK_ERROR);
}

/**
 * Main error response handler
 */
function handleErrorResponse(error: AxiosError<ApiErrorResponse>): Promise<UnauthorizedResponse> {
  if (error.response) {
    const { status, data: errorData } = error.response;

    // Handle 401 Unauthorized specially
    if (status === 401) {
      return handleUnauthorizedError();
    }

    // Handle other API errors
    handleApiError(errorData);
  } else {
    // No response - network error
    handleNetworkError();
  }

  return Promise.reject(error);
}

// ============================================================================
// INTERCEPTOR SETUP
// ============================================================================

/**
 * Configures response interceptors for an Axios instance
 * - Handles success notifications
 * - Handles error notifications
 * - Manages 401 unauthorized responses
 */
function setupResponseInterceptors(axiosInstance: AxiosInstance): void {
  axiosInstance.interceptors.response.use(handleSuccessResponse, handleErrorResponse);
}

// Apply response interceptors to API instance
setupResponseInterceptors(api);

// ============================================================================
// CSRF TOKEN MANAGEMENT
// ============================================================================

/**
 * Initializes CSRF token for session-based authentication (Laravel Sanctum)
 * Should be called before making authenticated requests in web apps
 * Note: CSRF endpoint is at root level, not under /api/v1
 */
async function initializeCsrfToken(): Promise<void> {
  const baseUrl = isMobileApp
    ? import.meta.env.VITE_API_BASE_URL_MOBILE
    : import.meta.env.VITE_API_BASE_URL;

  // Create a temporary axios instance for CSRF cookie endpoint (root level)
  const csrfApi = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    withXSRFToken: true,
  });

  await csrfApi.get('/sanctum/csrf-cookie');
}

// ============================================================================
// VUE BOOT FILE
// ============================================================================

/**
 * Quasar boot file that attaches axios instances to Vue global properties
 * Enables usage via this.$axios and this.$api in Options API components
 */
export default boot(({ app }) => {
  // Standard axios instance (for direct usage without interceptors)
  app.config.globalProperties.$axios = axios;

  // Configured API instance with interceptors
  app.config.globalProperties.$api = api;
});

// ============================================================================
// EXPORTS
// ============================================================================

export { api, initializeCsrfToken, isMobileApp, API_CONFIG, ERROR_MESSAGES, showNotification };
