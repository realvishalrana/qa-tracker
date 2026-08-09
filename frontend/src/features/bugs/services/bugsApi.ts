import { apiClient } from '@/lib/apiClient';
import type { Bug, BugStatus } from '@/types';

export const bugsApi = {
  list(query?: Record<string, string | number | undefined>) {
    return apiClient<Bug[]>('/bugs', { query });
  },
  get(id: string) {
    return apiClient<Bug>(`/bugs/${id}`);
  },
  create(projectId: string, body: Record<string, unknown>) {
    return apiClient<Bug>(`/projects/${projectId}/bugs`, { method: 'POST', body });
  },
  update(id: string, body: Record<string, unknown>) {
    return apiClient<Bug>(`/bugs/${id}`, { method: 'PATCH', body });
  },
  updateStatus(id: string, status: BugStatus) {
    return apiClient<Bug>(`/bugs/${id}/status`, { method: 'PATCH', body: { status } });
  },
  assign(id: string, assigneeId: string | null) {
    return apiClient<Bug>(`/bugs/${id}/assign`, { method: 'PATCH', body: { assigneeId } });
  },
  history(id: string) {
    return apiClient(`/bugs/${id}/history`);
  },
  timeline(id: string) {
    return apiClient(`/bugs/${id}/timeline`);
  },
};
