import { create } from 'zustand';
import { loginUser, logoutUser, fetchMe } from '../services/auth.service';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Defaults to true while we try silent refreshes automatically
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const payload = await loginUser(email, password);
      
      // Pluck raw token mapping natively to standard browser LocalStorage
      localStorage.setItem('accessToken', payload.token);
      
      set({ 
        user: payload.data.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout ping failed natively", error);
    } finally {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      // Pluck accessToken blindly first
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        set({ isAuthenticated: false, isLoading: false, user: null });
        return;
      }
      
      const res = await fetchMe();
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      // If `fetchMe` fails even after automatic refresh logic, they are dead.
      localStorage.removeItem('accessToken');
      set({ isAuthenticated: false, isLoading: false, user: null });
    }
  }
}));
