// /auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    roles: [],
  }),
  actions: {
    setAuth(token, roles) {
      this.accessToken = token;
      this.roles = roles;
    },
    setRoles(roles) {
      this.roles = roles; // Dedicated method to set roles
    },
    clearAuth() {
      this.accessToken = null;
      this.roles = [];
    },
  },
});
