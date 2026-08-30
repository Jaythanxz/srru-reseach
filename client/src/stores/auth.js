import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('srru_user') || 'null'),
    token: localStorage.getItem('srru_auth_token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    userRole: (state) => state.user?.role || 'GUEST',
    isStudent: (state) => state.user?.role === 'STUDENT',
    isTeacher: (state) => state.user?.role === 'TEACHER',
    isAdmin: (state) => state.user?.role === 'ADMIN',
    canReview: (state) => state.user?.role === 'TEACHER' || state.user?.role === 'ADMIN',
    userName: (state) => state.user?.full_name || 'ผู้ใช้งานทั่วไป'
  },

  actions: {
    async login(username, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/auth/login', { username, password });
        if (response.success) {
          this.token = response.token;
          this.user = response.user;
          localStorage.setItem('srru_auth_token', response.token);
          localStorage.setItem('srru_user', JSON.stringify(response.user));
          return response;
        }
      } catch (err) {
        this.error = err.message || 'เข้าสู่ระบบไม่สำเร็จ';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async register(payload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/auth/register', payload);
        if (response.success) {
          this.token = response.token;
          this.user = response.user;
          localStorage.setItem('srru_auth_token', response.token);
          localStorage.setItem('srru_user', JSON.stringify(response.user));
          return response;
        }
      } catch (err) {
        this.error = err.message || 'ลงทะเบียนไม่สำเร็จ';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Quick switch demo user for testing ease
    async quickSwitchRole(role) {
      const demoUsers = {
        STUDENT: { username: 'student1', password: 'password123' },
        TEACHER: { username: 'teacher1', password: 'password123' },
        ADMIN: { username: 'admin', password: 'password123' }
      };

      if (demoUsers[role]) {
        return await this.login(demoUsers[role].username, demoUsers[role].password);
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('srru_auth_token');
      localStorage.removeItem('srru_user');
    }
  }
});
