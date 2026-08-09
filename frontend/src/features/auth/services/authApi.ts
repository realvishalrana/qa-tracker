import { apiClient } from '@/lib/apiClient';
import type { User } from '@/types';

export const authApi = {
  login(email: string, password: string) {
    return apiClient<User>('/auth/login', { method: 'POST', body: { email, password } });
  },
  register(payload: { email: string; password: string; name: string; roleName?: string }) {
    return apiClient<User>('/auth/register', { method: 'POST', body: payload });
  },
  logout() {
    return apiClient<{ message: string }>('/auth/logout', { method: 'POST' });
  },
  me() {
    return apiClient<User>('/auth/me');
  },
};
