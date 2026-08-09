import { apiClient } from '@/lib/apiClient';

export const auditApi = {
  list(query?: Record<string, string | number | undefined>) {
    return apiClient('/audit-logs', { query });
  },
};
