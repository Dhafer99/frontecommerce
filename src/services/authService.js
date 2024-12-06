import api from './api';
import { reactive } from 'vue';
import { useAuthStore } from './auth';

export const authState = reactive({
  isLoggedIn: false,
  authChecked: false,
});

export const authService = {
  async login(email, password) {
    try {
      const { data } = await api.post('/auth/login', { email, password });

      // Extract token and roles
      const { accessToken, roles } = data;

      // Use Pinia store
      const authStore = useAuthStore();
      authStore.setAuth(accessToken, roles);

      // Update auth state
      authState.isLoggedIn = true;
      authState.authChecked = true;

      return accessToken; // Return access token for further use
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);
      throw error;
    }
  },

  
    async isAuthenticated() {
      try {
        const response = await api.get('/auth/validate', { withCredentials: true });
        authState.isLoggedIn = response.status === 200;
        authState.authChecked = true;
        return authState.isLoggedIn;
      } catch (error) {
        console.error('Error during authentication check:', error);
        authState.isLoggedIn = false;
        authState.authChecked = true;
        return false;
      }
    },

    async fetchUserRoles () {
      const response = await api.get('/auth/roles', { withCredentials: true })
      return response.data
    }
};

export default authService;
