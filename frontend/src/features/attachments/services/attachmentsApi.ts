import { apiClient } from '@/lib/apiClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const attachmentsApi = {
  list(bugId: string) {
    return apiClient(`/bugs/${bugId}/attachments`);
  },
  upload(bugId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient(`/bugs/${bugId}/attachments`, { method: 'POST', formData });
  },
  async download(id: string, filename: string) {
    const res = await fetch(`${API_URL}/attachments/${id}/download`, { credentials: 'include' });
    if (!res.ok) throw new Error('Download failed');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
  async previewUrl(id: string): Promise<string | null> {
    const res = await fetch(`${API_URL}/attachments/${id}/download`, { credentials: 'include' });
    if (!res.ok) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  },
};
