import { apiClient } from '@/lib/apiClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const reportsApi = {
  byStatus() {
    return apiClient('/reports/bugs-by-status');
  },
  bySeverity() {
    return apiClient('/reports/bugs-by-severity');
  },
  byAssignee() {
    return apiClient('/reports/bugs-by-assignee');
  },
  resolutionTime() {
    return apiClient('/reports/resolution-time');
  },
  async export(type: 'json' | 'csv') {
    const res = await fetch(`${API_URL}/reports/export?type=${type}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Export failed');
    if (type === 'csv') {
      const text = await res.text();
      return { data: text };
    }
    return res.json();
  },
};
