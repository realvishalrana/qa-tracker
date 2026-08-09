import { apiClient } from '@/lib/apiClient';

export const releasesApi = {
  list(projectId: string) {
    return apiClient(`/projects/${projectId}/releases`);
  },
  get(id: string) {
    return apiClient(`/releases/${id}`);
  },
  create(projectId: string, body: { name: string; version: string; notes?: string }) {
    return apiClient(`/projects/${projectId}/releases`, { method: 'POST', body });
  },
  publish(id: string) {
    return apiClient(`/releases/${id}/publish`, { method: 'PATCH' });
  },
  linkBugs(id: string, bugIds: string[]) {
    return apiClient(`/releases/${id}/bugs`, { method: 'POST', body: { bugIds } });
  },
  unlinkBug(id: string, bugId: string) {
    return apiClient(`/releases/${id}/bugs/${bugId}`, { method: 'DELETE' });
  },
};
