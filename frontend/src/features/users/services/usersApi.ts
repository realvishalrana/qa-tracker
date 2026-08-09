import { apiClient } from '@/lib/apiClient';
import type { SystemRole, User } from '@/types';

export const usersApi = {
  list(query?: { q?: string; page?: number; limit?: number }) {
    return apiClient<User[]>('/users', {
      query: {
        q: query?.q,
        page: query?.page,
        limit: query?.limit,
      },
    });
  },
  create(body: { email: string; password: string; name: string; roleNames?: string[] }) {
    return apiClient<User>('/users', { method: 'POST', body });
  },
  update(id: string, body: { name?: string; isActive?: boolean }) {
    return apiClient<User>(`/users/${id}`, { method: 'PATCH', body });
  },
  setRoles(id: string, roleNames: string[]) {
    return apiClient<User>(`/users/${id}/roles`, { method: 'PATCH', body: { roleNames } });
  },
  remove(id: string) {
    return apiClient(`/users/${id}`, { method: 'DELETE' });
  },
};

export const rolesApi = {
  list() {
    return apiClient<Array<SystemRole & { permissions: string[] }>>('/roles');
  },
};
