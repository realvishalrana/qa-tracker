import { apiClient } from '@/lib/apiClient';

export const dashboardApi = {
  summary() {
    return apiClient('/dashboard/summary');
  },
  charts() {
    return apiClient('/dashboard/charts');
  },
  myWork() {
    return apiClient('/dashboard/my-work');
  },
};
