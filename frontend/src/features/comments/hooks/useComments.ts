'use client';

import { useCallback, useEffect, useState } from 'react';
import { commentsApi } from '@/features/comments/services/commentsApi';
import { useToast } from '@/components/ui/Toast';
import { withMutationToast } from '@/lib/mutationToast';

export type CommentItem = {
  id: string;
  body: string;
  author?: { id: string; name: string; email: string };
  createdAt: string;
};

export function useComments(bugId: string) {
  const toast = useToast();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reload = useCallback(async () => {
    if (!bugId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await commentsApi.list(bugId);
      setComments(res.data as CommentItem[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [bugId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const addComment = useCallback(
    async (body: string) => {
      setSubmitting(true);
      try {
        await withMutationToast(
          toast,
          async () => {
            await commentsApi.create(bugId, body);
            await reload();
          },
          { success: 'Comment added' }
        );
      } finally {
        setSubmitting(false);
      }
    },
    [bugId, reload, toast]
  );

  return { comments, loading, error, submitting, reload, addComment };
}
