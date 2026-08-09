import { apiClient } from '@/lib/apiClient';
import type { Project, ProjectRole, User } from '@/types';

export type ProjectMemberRow = {
  id: string;
  projectRole: ProjectRole;
  user: User;
};

export const projectsApi = {
  list() {
    return apiClient<Project[]>('/projects');
  },
  get(id: string) {
    return apiClient<Project>(`/projects/${id}`);
  },
  create(body: { name: string; key: string; description?: string }) {
    return apiClient<Project>('/projects', { method: 'POST', body });
  },
  members(id: string) {
    return apiClient<ProjectMemberRow[]>(`/projects/${id}/members`);
  },
  addMember(id: string, body: { userId: string; projectRole?: ProjectRole }) {
    return apiClient(`/projects/${id}/members`, { method: 'POST', body });
  },
  updateMember(id: string, userId: string, projectRole: ProjectRole) {
    return apiClient(`/projects/${id}/members/${userId}`, {
      method: 'PATCH',
      body: { projectRole },
    });
  },
  removeMember(id: string, userId: string) {
    return apiClient(`/projects/${id}/members/${userId}`, { method: 'DELETE' });
  },
  activity(id: string) {
    return apiClient<unknown[]>(`/projects/${id}/activity`);
  },
};

export const featuresApi = {
  list(projectId: string) {
    return apiClient(`/projects/${projectId}/features`);
  },
  create(projectId: string, body: { name: string; description?: string }) {
    return apiClient(`/projects/${projectId}/features`, { method: 'POST', body });
  },
};
