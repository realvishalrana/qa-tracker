'use client';

import { useCallback, useEffect, useState } from 'react';
import { attachmentsApi } from '@/features/attachments/services/attachmentsApi';
import { useToast } from '@/components/ui/Toast';
import { withMutationToast } from '@/lib/mutationToast';

export type AttachmentItem = {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
};

export function useAttachments(bugId: string, onUploaded?: () => void) {
  const toast = useToast();
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(0);

  const reload = useCallback(async () => {
    if (!bugId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await attachmentsApi.list(bugId);
      setAttachments(res.data as AttachmentItem[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attachments');
    } finally {
      setLoading(false);
    }
  }, [bugId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        await withMutationToast(
          toast,
          async () => {
            await attachmentsApi.upload(bugId, file);
            await reload();
            onUploaded?.();
            setInputKey((k) => k + 1);
          },
          { success: 'File uploaded' }
        );
      } finally {
        setUploading(false);
      }
    },
    [bugId, reload, toast, onUploaded]
  );

  return { attachments, loading, error, uploading, reload, upload, inputKey };
}
