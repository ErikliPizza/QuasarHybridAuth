import {defineStore} from "pinia";
import {api, initializeCsrfToken, sessionApi} from "boot/axios";
import {Platform} from "quasar";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    mobile: Platform.is.capacitor || Platform.is.cordova || Platform.is.electron,
    user: JSON.parse(localStorage.getItem("auth_user")) || null,
    isAuthenticated: !!localStorage.getItem("auth_user"),
    token: localStorage.getItem("auth_token"),
    authCheckInterval: 60 * 1000, // 60 seconds
    lastAuthCheck: null,
    twoFactorRequired: false, // State to handle 2FA requirement
  }),

  actions: {
    async login(credentials) {
      try {
        if (this.mobile) {
          const response = await this.MobileLogin(credentials);
          this.twoFactorRequired = !!response.data.two_factor_required;
        } else {
          const response = await this.SessionLogin(credentials);
          this.twoFactorRequired = !!response.data.two_factor_required;
        }
      } catch (error) {
        throw error;
      }
    },

    async MobileLogin(credentials) {
      const response = await api.post("auth/login", credentials);
      if (response.data.two_factor_required) {
        return response; // Handle 2FA flow in the frontend
      }
      const token = response.data.token;
      this.token = token;
      localStorage.setItem("auth_token", token); // Store the token
      await this.getUser();
      return response;
    },

    async SessionLogin(credentials) {
      await initializeCsrfToken(); // Initialize CSRF token for SPA
      const response = await sessionApi.post("auth/login", credentials);
      if (response.data.two_factor_required) {
        return response; // Handle 2FA flow in the frontend
      }
      await this.getUser();
      return response;
    },

    async verifyTwoFactor(credentials) {
      if (!this.mobile) {
        // Initialize CSRF token for SPA
        await initializeCsrfToken();
      }

      const response = this.mobile ? await api.post("auth/verify-two-factor", credentials) : await sessionApi.post("auth/verify-two-factor-spa", credentials);

      if (this.mobile) {
        const token = response.data.token;
        this.token = token;
        localStorage.setItem("auth_token", token); // Store the token
      }

      await this.getUser();
      this.twoFactorRequired = false; // Reset 2FA flag after successful verification
    },

    async logout() {
      await this.handleApiRequest(async () => {
        if (this.mobile) {
          await api.post("auth/logout");
        } else {
          await sessionApi.post("auth/logout");
        }
        this.clearAuth();
      });
    },
    async getUser() {
      await this.handleApiRequest(async () => {
        const response = await api.get("auth/me");
        if (response.status === 200) {
          this.setUser(response.data.user);
        }
      });
    },
    setUser(user) {
      this.user = user;
      this.isAuthenticated = !!user;
      localStorage.setItem("auth_user", JSON.stringify(user));
    },
    clearAuth() {
      this.isAuthenticated = false;
      this.setUser(null);
      this.token = null; // Clear token when logging out
      localStorage.removeItem("auth_token"); // Clear token in local storage
      localStorage.removeItem("auth_user"); // Clear user data in local storage
      delete api.defaults.headers.common["Authorization"]; // Remove the Authorization header
    },
    /** @IMPORTANT
     * FOR REMOVE THE ON-ROUTE-CHANGE AUTH STATE CHECK:
     * remove the: src/router/index.js -> await authStore.initialAuthState();
     * OR
     * write a new logic to handle the same action
     * e.g: check the local storage for token if this platform is mobile and still send requests to the api if it is web app to reduce the request count, ETC.
     */
    async initialAuthState() {
      /* //////////////////////////////////////////
      /* axios.js will handle if it returns 401. ///
      */ //////////////////////////////////////////
      const now = new Date().getTime();

      if (!this.lastAuthCheck || now - this.lastAuthCheck > this.authCheckInterval) {
        await this.getUser();

        this.lastAuthCheck = new Date().getTime();
      }
    },
    async requestPasswordReset(email) {
      try {
        await api.post("/auth/password/reset/request", {email});
      } catch (error) {
        console.error("Password reset request error:", error);
        throw error;
      }
    },
    async resetPassword(data) {
      try {
        await api.post("auth/password/reset/apply", data);
      } catch (error) {
        console.error("Password reset error:", error);
        throw error;
      }
    },
    async handleApiRequest(apiCall) {
      try {
        await apiCall();
      } catch (error) {
        console.error(error);
        this.clearAuth();
      }
    },
  },
});
