import {boot} from "quasar/wrappers";
import axios from "axios";
import {useAuthStore} from "src/stores/auth";
import debounce from "lodash/debounce";
import {Platform, Notify} from "quasar";

/**
 * @IMPORTANT!
 * REMEMBER TO REFACTOR THE BASE URL LOGIC HERE BASED ON YOUR REQUESTS DURING DEPLOYMENT. SOME FEATURES IMPLEMENTED FOR DEV ENVIRONMENT
 *
 */

// Determine if running on a mobile app environment
const isMobileApp = Platform.is.capacitor || Platform.is.cordova;

// Create Axios instance with base URL depending on the environment
const api = axios.create({
  baseURL: isMobileApp ? import.meta.env.VITE_API_BASE_URL_MOBILE + "/" + import.meta.env.VITE_API_BASE_PREFIX : import.meta.env.VITE_API_BASE_URL + "/" + import.meta.env.VITE_API_BASE_PREFIX, // Environment-based base URL
  withCredentials: true, // Include credentials with requests
  withXSRFToken: true,
});

const sessionApi = axios.create({
  baseURL: isMobileApp ? import.meta.env.VITE_API_BASE_URL_MOBILE : import.meta.env.VITE_API_BASE_URL, // Environment-based base URL
  withCredentials: true, // Include credentials with requests
  withXSRFToken: true,
});

// Dynamically add Authorization header using Axios request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("auth_token"); // Retrieve token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Set the Authorization header dynamically
    }
    return config;
  },
  error => Promise.reject(error)
);

// Debounced function to handle unauthorized access and redirect to login
const handleUnauthorized = debounce(() => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) return; // Prevent redundant logout actions

  console.log("Unauthorized access detected, redirecting to login.");
  authStore.clearAuth(); // Clear the authentication state in the store
  window.location.replace("/login"); // Directly use window location for redirect
}, 1000);

// Setup response interceptor to handle specific status codes globally
function setupInterceptors(axiosInstance) {
  axiosInstance.interceptors.response.use(
    (response) => {
      // Check if the response contains notification settings
      if (response.data.notify && response.data.notify.enabled) {
        const { type = "positive", message = "Operation successful!" } = response.data.notify;
        Notify.create({
          type,
          message,
        });
      }
      return response; // Return the response as usual
    },
    (error) => {
      if (error.response) {
        // Handle error responses globally
        const status = error.response.status;
        const message = error.response.data.message || "An error occurred. Please try again.";

        if (status === 401) {
          console.log(error.response);
          handleUnauthorized();
          Notify.create({
            type: "negative",
            message: "Unauthorized access detected. Please log in again.",
          });
          return Promise.resolve({ status: 401, message: "Unauthorized" }); // Return a resolved promise for 401 status
        } else {
          // If error response has notify indicator, use it
          if (error.response.data.notify && error.response.data.notify.enabled) {
            const { type = "negative", message = "An error occurred. Please try again." } = error.response.data.notify;
            Notify.create({
              type,
              message,
            });
          } else {
            Notify.create({
              type: "negative",
              message: message,
            });
          }
        }
      } else {
        Notify.create({
          type: "negative",
          message: "Network error. Please check your connection and try again.",
        });
      }
      return Promise.reject(error); // Reject promise for all other errors
    }
  );
}

// Apply interceptors to both instances
setupInterceptors(api);
setupInterceptors(sessionApi);

// CSRF Token Initialization for SPA (e.g., before login request)
async function initializeCsrfToken() {
  await sessionApi.get("/sanctum/csrf-cookie"); // Get CSRF cookie for SPA session-based auth
}

// Boot file to attach axios instances to Vue global properties
export default boot(({app}) => {
  app.config.globalProperties.$axios = axios; // Standard axios instance
  app.config.globalProperties.$api = api; // Axios instance with custom interceptors
});

export {api, sessionApi, initializeCsrfToken};
