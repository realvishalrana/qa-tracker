import { apiClient } from '@/lib/apiClient';

export const commentsApi = {
  list(bugId: string) {
    return apiClient(`/bugs/${bugId}/comments`);
  },
  create(bugId: string, body: string) {
    return apiClient(`/bugs/${bugId}/comments`, { method: 'POST', body: { body } });
  },
};
