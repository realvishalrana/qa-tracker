import { apiClient } from '@/lib/apiClient';

export const notificationsApi = {
  list() {
    return apiClient('/notifications');
  },
  unreadCount() {
    return apiClient<{ count: number }>('/notifications/unread-count');
  },
  markRead(id: string) {
    return apiClient(`/notifications/${id}/read`, { method: 'PATCH' });
  },
  markAllRead() {
    return apiClient('/notifications/read-all', { method: 'POST' });
  },
};
